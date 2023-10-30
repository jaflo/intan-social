import { D1Database } from "@cloudflare/workers-types/experimental";

export interface Env {
	DB: D1Database;

	// secrets (see .dev.vars)
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	SHARED_SERVICE_SECRET: string;
}

// {
// 	"id": "_6tl...r7e0r6e",
// 	"htmlLink": "https://www.google.com/calendar/event?eid=XXX",
// 	"created": "2023-08-16T04:30:00.000Z",
// 	"updated": "2023-08-16T04:30:00.956Z",
// 	"summary": "Flight to Seattle (AA XXXX)",
// 	"location": "Washington IAD",
// 	"end": {
// 		"dateTime": "2024-01-11T20:10:00-08:00",
// 		"timeZone": "America/Los_Angeles"
// 	},
// 	"source": {
// 		"url": "https://mail.google.com/mail?extsrc=cal&plid=XXX",
// 		"title": ""
// 	}
// }

export interface CalendarEvent {
	id: string;
	htmlLink: string;
	created: string;
	updated: string;
	summary: string;
	location?: string;
	end: {
		dateTime: string;
		timeZone: string;
	};
	source: {
		url: string;
		title: string;
	};
}

export interface TransitionRow {
	transition_id: number;
	user_id: string;
	time_start: string;
	to_location: string;
	gcal_event_id?: string;
	created_at: string;
	updated_at: string;
}

export interface UserRow {
	user_incrementing_id: number;
	user_id: string;
	display_name: string;
	email_address: string;
	home_location?: string;
	google_user_id?: string;
	google_access_token?: string;
	google_token_expires_at?: number; // seconds
	google_refresh_token?: string;
	google_calendar_notification_channel_id?: string;
	created_at: string;
	updated_at: string;
}

export interface GroupRow {
	group_id: number;
	owner_user_id: number;
	share_id: string;
	title: string;
	match_condition: string | "home"; // airport code or 'home'
	created_at: string;
	updated_at: string;
}

export interface GroupMemberRow {
	group_member_id: number;
	group_id: number;
	user_id: string;
	created_at: string;
	updated_at: string;
}
