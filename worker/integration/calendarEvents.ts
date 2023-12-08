import { D1Database, D1Result } from "@cloudflare/workers-types/experimental";
import { CalendarEvent, TransitionRow } from "../types";
import { eventsToTransitions } from "./parseEvents";
import { DAY_IN_MS } from "../helpers";

export async function getCalendarEvents(
	emailAddress: string,
	accessToken: string
): Promise<CalendarEvent[]> {
	const aMonthAgo = new Date();
	aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);

	const queryString = new URLSearchParams({
		calendarId: "primary",
		timeMin: aMonthAgo.toISOString(),
		maxResults: String(2500),
		q: "Flight to",
		singleEvents: "true",
		orderBy: "startTime",
		fields: "items(id,summary,location,created,updated,end,htmlLink,source)"
	}).toString();

	const request = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
			emailAddress
		)}/events?${queryString}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`
			}
		}
	);

	const response = await request.json();
	if (!request.ok) {
		console.error(JSON.stringify(response));
	}
	return response.items;
}

export async function storeCalendarEvents(
	user_incrementing_id: number,
	gcalEvents: CalendarEvent[],
	DB: D1Database
): Promise<void> {
	const queuedQueries: Promise<D1Result | D1Result[]>[] = [];

	const parsedTransitions = eventsToTransitions(gcalEvents);

	// get all future transitions
	const transitionsQuery = await DB.prepare(
		"SELECT * FROM transitions WHERE user_id = ? AND time_start >= DATETIME('now')"
	)
		.bind(user_incrementing_id)
		.all<TransitionRow>();
	if (!transitionsQuery.success) {
		throw new Error("Failed to retrieve transitions");
	}
	const existingTransitions = transitionsQuery.results;

	// go through events and find any transitions that do not exist in gcal anymore, delete those
	const eventIds = gcalEvents.map((event) => event.id);
	const transitionsIdsToDelete = existingTransitions
		.filter(
			(transition) =>
				transition.gcal_event_id && // auto-imported from gcal before and
				!eventIds.includes(transition.gcal_event_id) // no longer in gcal
		)
		.map((transition) => transition.transition_id);
	queuedQueries.push(
		DB.prepare(
			`DELETE FROM transitions WHERE transition_id IN (${transitionsIdsToDelete
				.map(() => "?")
				.join(", ")})`
		)
			.bind(...transitionsIdsToDelete)
			.run()
	);

	// for each event, check if there is already transition for the day of the event, if there isn't, create a transition
	const transitionsToAdd: [number, string, string, string][] = [];
	const newTransitions = existingTransitions.filter(
		(transition) => !transitionsIdsToDelete.includes(transition.transition_id)
	);
	for (const calendarTransitions of parsedTransitions) {
		const existingTransition = newTransitions.find(
			(transition) =>
				// within a day of each other
				Math.abs(
					new Date(transition.time_start).getTime() - calendarTransitions.time.getTime()
				) < DAY_IN_MS
		);
		if (!existingTransition) {
			transitionsToAdd.push([
				user_incrementing_id,
				calendarTransitions.time.toISOString(),
				calendarTransitions.target,
				calendarTransitions.event.id
			]);
		}
	}
	if (transitionsToAdd.length > 0) {
		const insertTransition = DB.prepare(
			"INSERT INTO transitions (user_id, time_start, to_location, gcal_event_id) VALUES (?, ?, ?, ?)"
		);
		queuedQueries.push(
			DB.batch(transitionsToAdd.map((transition) => insertTransition.bind(...transition)))
		);
	}

	await Promise.all(queuedQueries);
}

export async function fetchAndStoreCalendarEvents(
	emailAddress: string,
	accessToken: string,
	DB: D1Database
): Promise<void> {
	// find the user ID matching the email
	const user_incrementing_id = await DB.prepare(
		"SELECT user_incrementing_id FROM users WHERE email = ?"
	)
		.bind(emailAddress)
		.first<number>("user_incrementing_id");
	if (!user_incrementing_id) {
		throw new Error("User does not exist");
	}

	// get their google calendar events
	const gcalEvents = await getCalendarEvents(emailAddress, accessToken);

	return storeCalendarEvents(user_incrementing_id, gcalEvents, DB);
}
