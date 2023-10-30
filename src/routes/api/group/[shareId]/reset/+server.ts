import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { resetShareCode } from "$lib/api/group";

export const POST: RequestHandler = async ({ locals, params }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, message } = await resetShareCode(email, params.shareId);
	return json({
		success,
		message
	});
};
