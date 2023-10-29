import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private"; // to update from .env: npm run sync
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { syncUser } from "$lib/api/user";
import type { SessionData } from "$lib/types";

function buildAuthHook(authParams: Record<string, string> = {}) {
	return SvelteKitAuth({
		providers: [
			Google({
				clientId: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						scope: [
							"https://www.googleapis.com/auth/userinfo.email",
							"https://www.googleapis.com/auth/userinfo.profile",
							"https://www.googleapis.com/auth/calendar.readonly"
						].join(" "),
						...authParams
					}
				}
			})
		],
		callbacks: {
			async jwt({ token, account, user }) {
				if (account) {
					const { access_token, refresh_token, expires_at, providerAccountId } = account;
					const { name, email } = user;
					const { hasRefreshToken } = await syncUser({
						access_token,
						refresh_token,
						expires_at,
						providerAccountId,
						email,
						name
					});
					token.needsRefreshToken = !hasRefreshToken;
				}
				return token;
			},
			async session({ session: s, token }) {
				const session = s as SessionData;
				session.shouldReauth = !!token.needsRefreshToken;
				return session;
			}
		}
	});
}

const authentication: Handle = async function (input) {
	if (input.event.url.searchParams.get("reauth")) {
		// get refresh token (but also shows permissions screen)
		return buildAuthHook({
			access_type: "offline",
			prompt: "consent"
		})(input);
	} else {
		return buildAuthHook()(input);
	}
};

const authorization: Handle = async function ({ event, resolve }) {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith("/authenticated")) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, "/auth");
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
};

// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authentication, authorization);
