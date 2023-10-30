import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { joinGroup } from "$lib/api/group";

export const POST: RequestHandler = async ({ locals, params }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, message } = await joinGroup(email, params.shareId);
	return json({
		success,
		message
	});
};
