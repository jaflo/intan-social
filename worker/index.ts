import { ExportedHandler } from "@cloudflare/workers-types/experimental";
import { Env } from "./types";
import { syncUser } from "./integration/syncUser";
import { GCAL_WEBHOOK_PATH, handleWebhook, triggerCalendarSync } from "./integration/gcalWebhook";
import { handleGroupRequest } from "./groups/handler";
import { getUser } from "./user/getUser";

const handler: ExportedHandler<Env> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore Response here does not match Response from CF
	async fetch(r, env) {
		const request = r as unknown as Request;

		if (env.IS_DEV) {
			if (!request.headers.get("Signature") || !request.headers.get("Signature-Expiration")) {
				return Response.json(
					{
						success: false,
						details: "Missing signature"
					},
					{ status: 403 }
				);
			}

			const validSignature = await verify(request, env);
			if (!validSignature) {
				return Response.json(
					{
						success: false,
						details: "Invalid signature"
					},
					{ status: 401 }
				);
			}
		}

		return handle(request, env).catch((error) => {
			if (env.IS_DEV) {
				throw error;
			} else {
				return Response.json({
					success: false,
					details: error.toString()
				});
			}
		});
	}
};

function byteStringToUint8Array(byteString: string) {
	const ui = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; ++i) {
		ui[i] = byteString.charCodeAt(i);
	}
	return ui;
}

async function verify(request: Request, env: Env): Promise<boolean> {
	const url = new URL(request.url);

	const encoder = new TextEncoder();
	const secretKeyData = encoder.encode(env.SHARED_SERVICE_SECRET);
	const key = await crypto.subtle.importKey(
		"raw",
		secretKeyData,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"]
	);

	const expiry = Number(request.headers.get("Signature-Expiration"));
	const dataToAuthenticate = `${url.pathname}@${expiry}`;

	const receivedMacBase64 = request.headers.get("Signature")!;
	const receivedMac = byteStringToUint8Array(atob(receivedMacBase64));

	const verified = await crypto.subtle.verify(
		"HMAC",
		key,
		receivedMac,
		encoder.encode(dataToAuthenticate)
	);

	if (
		!verified || // invalid MAC
		Date.now() > expiry // signature expired
	) {
		return false;
	}

	return true;
}

async function handle(request: Request, env: Env) {
	const url = new URL(request.url);
	const path = url.pathname;

	if (path === "/get-me") {
		// get the users data
		return getUser(env, request);
	} else if (path === "/sync-user") {
		// when a user signs in/up
		return syncUser(env, request);
	} else if (path === GCAL_WEBHOOK_PATH) {
		// Google notifying of changes
		return handleWebhook(env, request);
	} else if (path === "/sync-calendar") {
		// manual calendar sync
		return triggerCalendarSync(env, request);
	} else if (path.startsWith("/group")) {
		// group related requests
		return handleGroupRequest(env, request);
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
}

export default handler;
