import { Env, UserRow } from "../types";

export async function getGoogleAccessToken(env: Env, googleUserId: string) {
	const row = await env.DB.prepare(
		// users with tokens expiring in next hour
		"SELECT * FROM users WHERE google_user_id = ?"
	)
		.bind(googleUserId)
		.first<UserRow>();

	if (!row) {
		throw new Error("Unknown user");
	}

	if (
		row.google_access_token &&
		row.google_token_expires_at &&
		row.google_token_expires_at > Date.now() / 1000 + 10
	) {
		// token won't expire in the next 10 seconds, valid
		return row.google_access_token;
	} else if (row.google_refresh_token) {
		// token expired, get a new one and return it
		const response = await fetch("https://oauth2.googleapis.com/token", {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: env.GOOGLE_CLIENT_ID,
				client_secret: env.GOOGLE_CLIENT_SECRET,
				grant_type: "refresh_token",
				refresh_token: row.google_refresh_token
			}),
			method: "POST"
		});
		const tokens: {
			access_token: string;
			expires_in: number;
			scope: string;
			token_type: string;
			refresh_token?: string;
			id_token: string;
		} = await response.json();
		if (!response.ok) throw tokens;

		await env.DB.prepare(
			`UPDATE users
				SET
					google_access_token = ?,
					google_token_expires_at = ?,
					google_refresh_token = ?
				WHERE user_incrementing_id = ?
			`
		)
			.bind(
				tokens.access_token,
				Math.floor(Date.now() / 1000 + tokens.expires_in),
				tokens.refresh_token ?? row.google_refresh_token,
				row.user_incrementing_id
			)
			.run();

		return tokens.access_token;
	} else {
		throw new Error("Bad state");
	}
}
