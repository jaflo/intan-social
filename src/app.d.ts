import { SessionData } from "$lib/types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: Promise<SessionData | null>;
			needsToReauth?: boolean;
		}
		interface PageData {
			session: SessionData;
		}
		// interface Platform {}
	}
}

export {};
