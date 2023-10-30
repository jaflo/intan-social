import { getCalendarEvents, storeCalendarEvents } from "./calendarEvents";
import { getGoogleAccessToken } from "./getGoogleAccessToken";
import { Env, UserRow } from "../types";

export const GCAL_WEBHOOK_PATH = "/gcal-webhook";

export async function subscribeToUserCalendar(
	email: string,
	accessToken: string,
	gcalNotificationChannelId: string,
	webhookCallback: string
): Promise<boolean> {
	return true; // TODO: fix

	const thirtyDaysFromNow = new Date();
	thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

	const request = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${email}/events/watch`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({
				id: gcalNotificationChannelId,
				type: "web_hook",
				address: webhookCallback,
				expiration: thirtyDaysFromNow.getTime()
			}),
			method: "POST"
		}
	);

	const response = await request.json();
	if (!request.ok) {
		console.error(JSON.stringify(response));
	}
	return request.ok;
}

export async function handleWebhook(env: Env, request: Request) {
	const googleCalendarNotificationChannelId = request.headers.get("X-Goog-Channel-ID");

	const user = await env.DB.prepare(
		"SELECT * FROM users WHERE google_calendar_notification_channel_id = ?"
	)
		.bind(googleCalendarNotificationChannelId)
		.first<UserRow>();
	if (!user || !user.google_user_id) {
		return Response.json({
			success: false,
			message: "Google user matching notification ID does not exist, ignoring"
		});
	}

	const accessToken = await getGoogleAccessToken(env, user.google_user_id);
	const gcalEvents = await getCalendarEvents(user.email_address, accessToken);
	await storeCalendarEvents(user.user_incrementing_id, gcalEvents, env.DB);

	return Response.json({ success: true });
}

export async function triggerCalendarSync(env: Env, request: Request) {
	const { email } = await request.json();

	const user = await env.DB.prepare("SELECT * FROM users WHERE email_address = ?")
		.bind(email)
		.first<UserRow>();
	if (!user || !user.google_user_id) {
		return Response.json({
			success: false,
			message: "User not found"
		});
	}

	const accessToken = await getGoogleAccessToken(env, user.google_user_id);
	const gcalEvents = await getCalendarEvents(user.email_address, accessToken);
	await storeCalendarEvents(user.user_incrementing_id, gcalEvents, env.DB);

	return Response.json({ success: true });
}
