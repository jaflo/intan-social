import { CalendarEvent, Env, UserRow } from "../types";
import { GCAL_WEBHOOK_PATH, subscribeToUserCalendar } from "./gcalWebhook";
import { generateId } from "../helpers";
import { getCalendarEvents, storeCalendarEvents } from "./calendarEvents";
import { getHomeLocation } from "./parseEvents";

export async function syncUser(env: Env, request: Request) {
	const { access_token, refresh_token, expires_at, providerAccountId, email, name } =
		await request.json();
	const existingUser = await env.DB.prepare("SELECT * FROM users WHERE google_user_id = ?")
		.bind(providerAccountId)
		.first<UserRow>();

	const gcalNotificationChannelId =
		existingUser?.google_calendar_notification_channel_id ?? generateId();
	let homeLocation = existingUser?.home_location;
	let events: CalendarEvent[] = [];
	if (!existingUser) {
		const webhookCallback = new URL(request.url).origin + GCAL_WEBHOOK_PATH;

		const results = await Promise.all([
			subscribeToUserCalendar(
				email,
				access_token,
				gcalNotificationChannelId,
				webhookCallback
			),
			getCalendarEvents(email, access_token)
		]);
		const allTrue = results.every((result) => !!result);

		if (!allTrue) {
			console.error(results);
			throw new Error("Encountered error setting up new user");
		}

		events = results[1];
		homeLocation ??= getHomeLocation(events);
	}

	const query = existingUser
		? `UPDATE users SET
				google_access_token = ?2,
				google_refresh_token = ?3,
				google_token_expires_at = ?4,
				email_address = ?5,
				display_name = ?6,
				user_id = ?7,
				google_calendar_notification_channel_id = ?8,
				home_location = ?9
			WHERE google_user_id = ?1`
		: `INSERT INTO users (
				google_user_id,
				google_access_token,
				google_refresh_token,
				google_token_expires_at,
				email_address,
				display_name,
				user_id,
				google_calendar_notification_channel_id,
				home_location
			) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`;
	const { success } = await env.DB.prepare(query)
		.bind(
			/* 1 */ providerAccountId,
			/* 2 */ access_token,
			/* 3 */ existingUser?.google_refresh_token || refresh_token || null,
			/* 4 */ expires_at,
			/* 5 */ email,
			/* 6 */ name,
			/* 7 */ existingUser?.user_id ?? generateId(),
			/* 8 */ gcalNotificationChannelId,
			/* 9 */ homeLocation
		)
		.run<UserRow>();
	if (!success) {
		throw new Error("Failed to update user");
	}

	if (!existingUser) {
		// for new users, populate their events
		const user_incrementing_id = await env.DB.prepare(
			`SELECT user_incrementing_id FROM users WHERE google_user_id = ?`
		)
			.bind(providerAccountId)
			.first<number>("user_incrementing_id");
		if (!user_incrementing_id) {
			throw new Error("Failed to retrieve new user ID");
		}
		await storeCalendarEvents(user_incrementing_id, events, env.DB);
	}

	return Response.json({
		success: true,
		hasRefreshToken: !!(existingUser?.google_refresh_token || refresh_token)
	});
}
