import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupRow, UserRow } from "../types";
import { isValidAirportCode } from "../airports";

export async function updateGroupDetails(
	DB: D1Database,
	user: UserRow,
	group: GroupRow,
	payload: { title?: string; matchCondition?: string }
) {
	const { group_id } = group;
	if (user.user_incrementing_id !== group.owner_user_id) {
		return Response.json({
			success: false,
			message: "User cannot manage group"
		});
	}

	const { title, matchCondition } = payload;
	if (!title && !matchCondition) {
		return Response.json({
			success: false,
			message: "No properties to update group specified"
		});
	}

	let newMatchCondition = matchCondition || group.match_condition;
	if (!isValidAirportCode(newMatchCondition) && newMatchCondition !== "home") {
		newMatchCondition = "home";
	}

	const updateQuery = await DB.prepare(
		`UPDATE groups SET title = ?, match_condition = ? WHERE group_id = ?`
	)
		.bind(title || group.title, newMatchCondition, group_id)
		.run();
	if (!updateQuery.success) {
		return Response.json({
			success: false,
			message: "Group could not be updated"
		});
	}

	return Response.json({
		success: true,
		message: "Group has been updated"
	});
}
