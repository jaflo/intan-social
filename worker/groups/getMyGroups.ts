import { D1Database } from "@cloudflare/workers-types/experimental";
import { GroupRow, UserRow } from "../types";

export async function getMyGroups(DB: D1Database, user: UserRow) {
	const groupsQuery = await DB.prepare(
		`SELECT g.group_id, g.title, g.share_id, g.match_condition
			FROM groups g
			JOIN group_members gm ON g.group_id = gm.group_id
			WHERE gm.user_id = ?`
	)
		.bind(user.user_incrementing_id)
		.all<GroupRow>();
	if (!groupsQuery.success) {
		return Response.json({
			success: false,
			message: "Failed to retrieve groups"
		});
	}

	const groups = groupsQuery.results.map((group) => ({
		title: group.title,
		shareId: group.share_id,
		matchCondition: group.match_condition
	}));

	return Response.json({
		success: true,
		data: groups
	});
}
