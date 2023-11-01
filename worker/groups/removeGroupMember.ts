import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupRow, UserRow } from "../types";

export async function removeGroupMember(
	DB: D1Database,
	user: UserRow,
	group: GroupRow,
	payload: { userId: string }
) {
	const { group_id } = group;
	const { userId } = payload;
	if (!userId) {
		return Response.json({
			success: false,
			message: "User not specified"
		});
	}

	// Look up user_incrementing_id from group_members table
	const user_incrementing_id = await DB.prepare(
		`SELECT user_incrementing_id FROM group_members WHERE group_id = ? AND user_id = ?`
	)
		.bind(group_id, userId)
		.first<number>("user_incrementing_id");
	if (!user_incrementing_id) {
		return Response.json({
			success: false,
			message: "User not found in group"
		});
	}

	if (
		user_incrementing_id !== group.owner_user_id ||
		user_incrementing_id !== user.user_incrementing_id
	) {
		return Response.json({
			success: false,
			message: "User cannot remove member"
		});
	}

	if (
		user_incrementing_id === group.owner_user_id &&
		user_incrementing_id === user.user_incrementing_id
	) {
		return Response.json({
			success: false,
			message: "Owner cannot remove themselves"
		});
	}

	// Remove the specified userId from the group members
	const deleteQuery = await DB.prepare(
		`DELETE FROM group_members WHERE group_id = ? AND user_incrementing_id = ?`
	)
		.bind(group_id, user_incrementing_id)
		.run();
	if (!deleteQuery.success) {
		return Response.json({
			success: false,
			message: "User could not be removed from group"
		});
	}

	return Response.json({
		success: true,
		message: "User has been removed from the group"
	});
}
