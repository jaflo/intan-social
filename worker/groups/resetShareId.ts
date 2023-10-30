import { D1Database } from "@cloudflare/workers-types/experimental";
import { generateUserFacingId } from "../helpers";
import { GroupRow, UserRow } from "../types";

export async function resetShareId(DB: D1Database, user: UserRow, group: GroupRow) {
	if (group.owner_user_id !== user.user_incrementing_id) {
		return Response.json({
			success: false,
			message: "User does not own the group"
		});
	}

	const newShareId = generateUserFacingId();
	const updateQuery = await DB.prepare(`UPDATE groups SET share_id = ? WHERE group_id = ?`)
		.bind(newShareId, group.group_id)
		.run();
	if (!updateQuery.success) {
		return Response.json({
			success: false,
			message: "Share code could not be reset"
		});
	}

	return Response.json({
		success: true,
		message: "Share code has been reset",
		data: {
			shareId: newShareId
		}
	});
}
