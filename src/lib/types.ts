import type { Session } from "@auth/core/types";

export type SessionData = Session & {
	shouldReauth: boolean;
};

export interface GroupListItem {
	title: string;
	shareId: string;
	matchCondition: string;
}

export interface GroupDataItem {
	isMember: boolean;
	isOwner: boolean;
	group: {
		ownerUserId?: string;
		title: string;
		shareId: string;
		matchCondition: string;
	};
	members?: {
		id: string;
		name: string;
		currentAvailability: boolean;
	}[];
	transitions?: {
		user: string;
		time: string;
		available: boolean;
	}[];
}

export interface UserTransition {
	time: string;
	place: string;
	gcalId?: string;
}
