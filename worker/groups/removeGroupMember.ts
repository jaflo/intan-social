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
	const userIdToBeRemoved = Number(userId);

	if (
		userIdToBeRemoved !== group.owner_user_id ||
		userIdToBeRemoved !== user.user_incrementing_id
	) {
		return Response.json({
			success: false,
			message: "User cannot remove member"
		});
	}

	if (
		userIdToBeRemoved === group.owner_user_id &&
		userIdToBeRemoved === user.user_incrementing_id
	) {
		return Response.json({
			success: false,
			message: "Owner cannot remove themselves"
		});
	}

	// Remove the specified userId from the group members
	const deleteQuery = await DB.prepare(
		`DELETE FROM group_members WHERE group_id = ? AND user_id = ?`
	)
		.bind(group_id, userIdToBeRemoved)
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
