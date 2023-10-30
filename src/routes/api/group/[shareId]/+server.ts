import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteGroup, getGroup, updateGroup } from "$lib/api/group";

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, data } = await getGroup(email, params.shareId);
	return json({
		success,
		data
	});
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const session = await locals.getSession();
	const email = session?.user?.email;
	if (!email) {
		return json({
			success: false,
			message: "Not logged in"
		});
	}

	const { success, message } = await deleteGroup(email, params.shareId);
	return json({
		success,
		message
	});
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
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

	const { success, message } = await updateGroup(email, params.shareId, title, place);
	return json({
		success,
		message
	});
};
