import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupMemberRow, GroupRow, UserRow } from "../types";

export async function joinGroup(DB: D1Database, user: UserRow, group: GroupRow) {
	const { group_id } = group;
	const { user_incrementing_id } = user;

	// Check if the user is already a member of the group
	const existingMember = await DB.prepare(
		`SELECT * FROM group_members WHERE group_id = ? AND user_id = ?`
	)
		.bind(group_id, user_incrementing_id)
		.run<GroupMemberRow>();
	if (existingMember) {
		return Response.json({
			success: false,
			message: "User is already a member of the group"
		});
	}

	// Add the user to the group
	const { success } = await DB.prepare(
		`INSERT INTO group_members (group_id, user_id) VALUES (?, ?)`
	)
		.bind(group_id, user_incrementing_id)
		.run();
	if (!success) {
		return Response.json({
			success: false,
			message: "Failed to add user to group"
		});
	}

	return Response.json({
		success: true,
		message: "User added to group successfully"
	});
}
