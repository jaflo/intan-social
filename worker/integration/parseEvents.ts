import { CalendarEvent } from "../types";
import { getAirportCode } from "../airports";
import { DAY_IN_MS } from "../helpers";

interface Transition {
	target: string;
	time: Date;
	event: CalendarEvent;
}

export function eventsToTransitions(originalEvents: CalendarEvent[]) {
	// Parse dates and sort events by end date
	const events = originalEvents.map((event) => ({
		...event,
		// force time to UTC
		end: new Date(event.end.dateTime)
	}));
	events.sort((a, b) => a.end.getTime() - b.end.getTime());

	const transitions: Transition[] = [];
	let currentTransition: Transition | null = null;

	// build a index for this user's locations
	const locationToAirport: Record<string, string> = {};
	events.forEach((event) => {
		const lastIndex = event.location.lastIndexOf(" ");
		const name = event.location.substring(0, lastIndex);
		const code = event.location.substring(lastIndex + 1);
		locationToAirport[name] = code;
	});

	function createTransition(event: { id: string; end: Date; summary: string }): Transition {
		return {
			target:
				locationToAirport[getFlightDestinationFromSubject(event.summary)] ||
				getAirportCodeFromSubject(event.summary) ||
				event.summary,
			time: event.end,
			event: originalEvents.find((o) => o.id === event.id)!
		};
	}

	events.forEach((event) => {
		const transition = createTransition(event);
		if (
			currentTransition &&
			transition.time.getTime() - currentTransition.time.getTime() <= DAY_IN_MS
		) {
			// If the current transition is on the same day as the previous one, replace it with the new one
			transitions[transitions.length - 1] = transition;
		} else {
			// Otherwise, add the new transition to the list
			transitions.push(transition);
		}
		currentTransition = transition;
	});

	return transitions;
}

export function getFlightDestinationFromSubject(subject: string) {
	const matches = /Flight to ([^(]+)/.exec(subject);
	return matches?.[1].trim() || "";
}

export function getAirportCodeFromSubject(subject: string) {
	const homeLocation = getFlightDestinationFromSubject(subject);
	if (homeLocation) {
		return getAirportCode(homeLocation);
	}
	return undefined;
}

export function getHomeLocation(events: CalendarEvent[]) {
	if (events.length === 0) {
		return undefined;
	}

	const lastEventDestination = events[events.length - 1].summary;
	if (lastEventDestination) {
		return getAirportCodeFromSubject(lastEventDestination);
	}

	return undefined;
}
