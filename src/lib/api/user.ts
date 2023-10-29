import { post } from "./base";

export async function syncUser(params: {
	access_token: string | undefined;
	refresh_token: string | undefined;
	expires_at: number | undefined;
	providerAccountId: string | undefined;
	email: string | null | undefined;
	name: string | null | undefined;
}) {
	return post<{
		hasRefreshToken: boolean;
	}>("/sync-user", params);
}
