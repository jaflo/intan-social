import type { Session } from "@auth/core/types";

export type SessionData = Session & {
	shouldReauth: boolean;
};
