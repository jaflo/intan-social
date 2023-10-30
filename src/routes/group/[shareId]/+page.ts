import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
	return {
		shareId: params.shareId
	};
}) satisfies PageLoad;
