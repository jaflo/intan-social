import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupRow, UserRow } from "../types";
import { isCloseTo } from "../airports";

export async function getGroupDetails(DB: D1Database, user: UserRow, group: GroupRow) {
	const { group_id } = group;

	// Check if the user is a member of the group
	const groupMember = await DB.prepare(
		`SELECT * FROM group_members WHERE group_id = ? AND user_id = ?`
	)
		.bind(group_id, user.user_incrementing_id)
		.first();
	if (!groupMember) {
		return Response.json({
			success: false,
			message: "User is not a member of the group"
		});
	}

	// Get the details of all group members
	const groupMembersQuery = await DB.prepare(
		`SELECT user_incrementing_id, display_name, home_location FROM users
			WHERE user_incrementing_id IN (
				SELECT user_id FROM group_members WHERE group_id = ?
			)`
	)
		.bind(group_id)
		.all<{
			user_incrementing_id: number;
			display_name: string;
			home_location: string;
		}>();
	if (!groupMembersQuery.success) {
		return Response.json({
			success: false,
			message: "Failed to retrieve group members"
		});
	}

	// Retrieve the transitions from all of the group members in the next year
	const transitionQuery = await DB.prepare(
		`SELECT user_id, time_start, to_location FROM transitions
			WHERE user_id IN (
				SELECT user_id FROM group_members WHERE group_id = ?
			)
			AND time_start >= datetime('now')
			AND time_start <= datetime('now', '+1 year')`
	)
		.bind(group_id)
		.all<FetchedTransitionRow>();
	if (!transitionQuery.success) {
		return Response.json({
			success: false,
			message: "Could not retrieve transitions"
		});
	}

	// Retrieve the latest transition for each group member before the present moment
	const latestTransitionsQuery = await DB.prepare(
		`SELECT user_id, time_start, to_location FROM transitions
			WHERE user_id IN (
				SELECT user_id FROM group_members WHERE group_id = ?
			)
			AND time_start <= datetime('now')
			AND time_start = (
				SELECT MAX(time_start) FROM transitions
				WHERE user_id = transitions.user_id AND time_start <= datetime('now')
			)`
	)
		.bind(group_id)
		.all<FetchedTransitionRow>();
	if (!latestTransitionsQuery.success) {
		return Response.json({
			success: false,
			message: "Could not retrieve latest transitions"
		});
	}

	return Response.json({
		success: true,
		data: {
			group,
			members: groupMembersQuery.results.map((user) => ({
				id: user.user_incrementing_id,
				name: user.display_name,
				current: isAvailable(
					group,
					latestTransitionsQuery.results.find(
						// find matching transition
						(t) => t.user_id === user.user_incrementing_id
					)?.to_location || user.home_location,
					user.home_location
				)
			})),
			transitions: convertTransitions(
				transitionQuery.results,
				group,
				groupMembersQuery.results
			)
		}
	});
}

function convertTransitions(
	dbTransitions: FetchedTransitionRow[],
	group: GroupRow,
	groupMembers: {
		user_incrementing_id: number;
		display_name: string;
		home_location: string;
	}[]
) {
	const transitions = dbTransitions.map((transition) => ({
		user: transition.user_id,
		time: transition.time_start,
		available: isAvailable(
			group,
			transition.to_location,
			groupMembers.find((member) => member.user_incrementing_id === transition.user_id)
				?.home_location || ""
		)
	}));

	// Sort the transitions array by time
	transitions.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

	// Combine together transitions that don't change state
	const result: typeof transitions = [];
	const lastEntry: Record<number, boolean> = {};
	for (const transition of transitions) {
		if (lastEntry[transition.user] !== transition.available) {
			result.push(transition);
			lastEntry[transition.user] = transition.available;
		}
	}

	return result;
}

interface FetchedTransitionRow {
	user_id: number;
	time_start: string;
	to_location: string;
}

function isAvailable(
	group: GroupRow,
	currentLocation: string,
	homeLocationOfUser: string
): boolean {
	return group.match_condition === "home"
		? isCloseTo(currentLocation, homeLocationOfUser)
		: isCloseTo(currentLocation, group.match_condition);
}
