import { POST } from "./base";

export async function syncUser(params: {
	access_token: string | undefined;
	refresh_token: string | undefined;
	expires_at: number | undefined;
	providerAccountId: string | undefined;
	email: string | null | undefined;
	name: string | null | undefined;
}) {
	return POST<{
		hasRefreshToken: boolean;
	}>("/sync-user", params);
}

export async function syncCalendar(params: { email: string }) {
	return POST("/sync-calendar", params);
}

export async function getSelfUser(params: { email: string }) {
	return POST<{
		data: {
			user: {
				name: string;
				email: string;
				place: string;
			};
			transitions: {
				time: string;
				place: string;
				gcalId: string;
			}[];
		};
	}>("/get-me", params);
}
