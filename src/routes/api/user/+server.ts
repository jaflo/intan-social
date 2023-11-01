import { getSelfUser } from "$lib/api/user";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;

	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { data } = await getSelfUser({ email });
	return json({
		success: true,
		data
	});
};
