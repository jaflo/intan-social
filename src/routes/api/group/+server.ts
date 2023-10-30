import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createGroup, getGroups } from "$lib/api/group";

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, data } = await getGroups(email);
	return json({
		success,
		data
	});
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { title, place } = await request.json<{
		title?: string;
		place?: string;
	}>();
	if (!title || !place) {
		return json({
			success: false,
			message: "Missing title or place"
		});
	}

	const { success, data } = await createGroup(email, title, place);
	return json({
		success,
		data
	});
};
