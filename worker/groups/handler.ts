import { Env, GroupRow, UserRow } from "../types";
import { createGroup } from "./createGroup";
import { getMyGroups } from "./getMyGroups";
import { joinGroup } from "./joinGroup";
import { deleteGroup } from "./deleteGroup";
import { getGroupDetails } from "./getGroupDetails";
import { updateGroupDetails } from "./updateGroupDetails";
import { removeGroupMember } from "./removeGroupMember";
import { resetShareCode } from "./resetShareCode";

export async function handleGroupRequest(env: Env, request: Request) {
	const payload = await request.json();
	const { email } = payload;
	const user = await env.DB.prepare("SELECT * FROM users WHERE email_address = ?")
		.bind(email)
		.first<UserRow>();
	if (!user) {
		return Response.json({
			success: false,
			message: "User not found"
		});
	}

	const url = new URL(request.url);
	const path = url.pathname;

	if (request.method === "POST" && path === "/group") {
		return createGroup(env.DB, user, payload);
	} else if (request.method === "GET" && path === "/group") {
		return getMyGroups(env.DB, user);
	} else if (path.startsWith("/group/")) {
		const pieces = path.split("/");
		const groupShareId = pieces[2];
		const action = pieces.length > 3 ? pieces[3] : null;

		const group = await env.DB.prepare("SELECT * FROM groups WHERE share_id = ?")
			.bind(groupShareId)
			.first<GroupRow>();
		if (!group) {
			return Response.json({
				success: false,
				message: "Group not found"
			});
		}

		if (request.method === "POST" && action === "join") {
			return joinGroup(env.DB, user, group);
		} else if (request.method === "DELETE" && !action) {
			return deleteGroup(env.DB, user, group);
		} else if (request.method === "GET" && !action) {
			return getGroupDetails(env.DB, user, group);
		} else if (request.method === "PATCH" && !action) {
			return updateGroupDetails(env.DB, user, group, payload);
		} else if (request.method === "POST" && action === "remove") {
			return removeGroupMember(env.DB, user, group, payload);
		} else if (request.method === "POST" && action === "reset-share") {
			return resetShareCode(env.DB, user, group);
		}
	}
}
