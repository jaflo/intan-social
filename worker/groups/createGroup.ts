import { D1Database } from "@cloudflare/workers-types/experimental";
import { generateUserFacingId } from "../helpers";
import { GroupMemberRow, UserRow } from "../types";
import { isValidAirportCode } from "../airports";

export async function createGroup(
	DB: D1Database,
	user: UserRow,
	payload: { title: string; airport?: string }
) {
	const { title, airport } = payload;
	if (!title) {
		return Response.json({
			success: false,
			message: "Missing name of group"
		});
	}

	const matchCondition = airport && isValidAirportCode(airport) ? airport : "home";
	const share_id = generateUserFacingId();
	const createdGroupQuery = await DB.prepare(
		"INSERT INTO groups (owner_user_id, share_id, title, match_condition) VALUES (?, ?, ?, ?)"
	)
		.bind(user.user_incrementing_id, share_id, title, matchCondition)
		.run();
	if (!createdGroupQuery.success) {
		return Response.json({
			success: false,
			message: "Failed to create group"
		});
	}

	const createdGroupId = createdGroupQuery.meta.last_row_id;

	const addMemberQuery = await DB.prepare(
		"INSERT INTO group_members (group_id, user_id, user_incrementing_id) VALUES (?, ?, ?)"
	)
		.bind(createdGroupId, user.user_id, user.user_incrementing_id)
		.run<GroupMemberRow>();
	if (!addMemberQuery.success) {
		return Response.json({
			success: false,
			message: "Failed to add user to group"
		});
	}

	// Return the share ID of the newly created group
	return Response.json({
		success: true,
		data: {
			shareId: share_id
		}
	});
}
