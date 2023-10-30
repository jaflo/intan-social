import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupRow, UserRow } from "../types";

export async function deleteGroup(DB: D1Database, user: UserRow, group: GroupRow) {
	const { group_id, owner_user_id } = group;
	const { user_incrementing_id } = user;

	if (owner_user_id !== user_incrementing_id) {
		return Response.json({
			success: false,
			message: "User does not own the group"
		});
	}

	// Remove all members of the group
	const { success: success1 } = await DB.prepare(`DELETE FROM group_members WHERE group_id = ?`)
		.bind(group_id)
		.run();
	if (!success1) {
		return Response.json({
			success: false,
			message: "Failed to remove group members"
		});
	}

	// Delete the group row
	const { success: success2 } = await DB.prepare(`DELETE FROM groups WHERE group_id = ?`)
		.bind(group_id)
		.run();
	if (!success2) {
		return Response.json({
			success: false,
			message: "Failed to delete group"
		});
	}

	return Response.json({
		success: true,
		message: "Group deleted successfully"
	});
}
