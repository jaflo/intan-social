import { ExportedHandler } from "@cloudflare/workers-types/experimental";
import { Env } from "./types";
import { syncUser } from "./integration/syncUser";
import { GCAL_WEBHOOK_PATH, handleWebhook, triggerCalendarSync } from "./integration/gcalWebhook";

const handler: ExportedHandler<Env> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore Response here does not match Response from CF
	async fetch(cfRequest, env) {
		try {
			const request = cfRequest as unknown as Request;
			const url = new URL(request.url);
			const path = url.pathname;

			if (path === "/sync-user") {
				// when a user signs in/up
				return syncUser(env, request);
			} else if (path === GCAL_WEBHOOK_PATH) {
				// Google notifying of changes
				return handleWebhook(env, request);
			} else if (path === "/sync-calendar") {
				// manual calendar sync
				return triggerCalendarSync(env, request);
			} else if (path === "/users") {
				const { results } = await env.DB.prepare("SELECT * FROM users").all();
				return Response.json({
					success: true,
					data: results
				});
			} else if (path === "/transitions") {
				const { results } = await env.DB.prepare("SELECT * FROM transitions").all();
				return Response.json({
					success: true,
					data: results
				});
			} else {
				return Response.json({
					success: true,
					data: "Hello World!"
				});
			}
		} catch (error) {
			console.error(error);
			return Response.json({
				success: false,
				details: error.toString()
			});
		}
	}
};

export default handler;
