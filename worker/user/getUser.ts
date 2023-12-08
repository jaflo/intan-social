import { TransitionRow, UserRow, Env } from "../types";

export async function getUser(env: Env, request: Request): Promise<Response> {
	const payload = await request.json();
	const { email } = payload;
	const user = await env.DB.prepare("SELECT * FROM users WHERE email_address = ?")
		.bind(email)
		.first<UserRow>();
	if (!user) {
		return Response.json({
			success: false,
			message: "User not found"
		});
	}

	const transitionsQuery = await env.DB.prepare(
		`SELECT * FROM transitions
			WHERE user_id = ?
			AND (
				time_start > datetime('now')  -- in future or
				OR time_start = (             -- the one right before
					SELECT MAX(time_start) FROM transitions
					WHERE user_id = transitions.user_id AND time_start <= datetime('now')
				)
			)`
	)
		.bind(user.user_incrementing_id)
		.all<TransitionRow>();
	if (!transitionsQuery.success) {
		return Response.json({
			success: false,
			message: "Could not retrieve transitions"
		});
	}

	return Response.json({
		success: true,
		data: {
			user: {
				name: user.display_name,
				email: user.email_address,
				place: user.home_location
			},
			transitions: transitionsQuery.results.map((entry) => ({
				time: entry.time_start,
				place: entry.to_location,
				gcalId: entry.gcal_event_id
			}))
		}
	});
}
