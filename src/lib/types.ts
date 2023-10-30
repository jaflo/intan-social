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
	group: {
		ownerUserId: number;
		title: string;
		shareId: string;
		matchCondition: string;
	};
	members?: {
		id: number;
		name: string;
		currentAvailability: boolean;
	}[];
	transitions?: {
		user: number;
		time: string;
		available: boolean;
	}[];
}
