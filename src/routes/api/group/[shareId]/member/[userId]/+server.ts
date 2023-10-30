import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteGroupMember } from "$lib/api/group";

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, message } = await deleteGroupMember(email, params.shareId, params.userId);
	return json({
		success,
		message
	});
};
