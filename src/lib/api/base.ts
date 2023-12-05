import { browser } from "$app/environment";
import { SHARED_SERVICE_SECRET } from "$env/static/private";

if (browser) {
	throw new Error(
		"API client imported in browser. Do not do this, it exposes the service secret."
	);
}

const API_BASE_PATH = "http://0.0.0.0:8787";

const encoder = new TextEncoder();
const secretKeyData = encoder.encode(browser ? "" : SHARED_SERVICE_SECRET);
const key = await crypto.subtle.importKey(
	"raw",
	secretKeyData,
	{ name: "HMAC", hash: "SHA-256" },
	false,
	["sign"]
);

async function api<T>(path: string, method: string, data: unknown = {}) {
	const expirationMs = 60000; // 1 minute
	const expiry = Date.now() + expirationMs;

	const dataToAuthenticate = `${path}@${expiry}`;
	const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(dataToAuthenticate));
	const base64Mac = btoa(String.fromCharCode(...new Uint8Array(mac)));

	const result = await fetch(API_BASE_PATH + path, {
		headers: {
			"Content-Type": "application/json",
			Signature: base64Mac,
			"Signature-Expiration": String(expiry)
		},
		...(data ? { body: JSON.stringify(data) } : {}),
		method
	});
	const response: T & {
		success: boolean;
		message?: string;
	} = await result.json();

	if (!result.ok) {
		return {
			success: false,
			message: "Request failed: " + result.statusText
		};
	} else {
		return response;
	}
}

export async function POST<T>(path: string, data: unknown) {
	return api<T>(path, "POST", data);
}

export async function GET<T>(path: string) {
	return api<T>(path, "GET");
}

export async function DELETE<T>(path: string, data: unknown) {
	return api<T>(path, "DELETE", data);
}

export async function PATCH<T>(path: string, data: unknown) {
	return api<T>(path, "PATCH", data);
}
