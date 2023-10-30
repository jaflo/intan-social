import type { GroupDataItem, GroupListItem } from "$lib/types";
import { DELETE, PATCH, POST } from "./base";

export async function createGroup(email: string, title: string, airport?: string) {
	return POST<{
		data: {
			shareId: string;
		};
	}>("/group", {
		email,
		title,
		airport
	});
}

export async function getGroups(email: string) {
	return POST<{
		data: GroupListItem[];
	}>("/group/list", { email });
}

export async function joinGroup(email: string, shareId: string) {
	return POST(`/group/${shareId}/join`, { email });
}

export async function deleteGroup(email: string, shareId: string) {
	return DELETE(`/group/${shareId}`, { email });
}

export async function getGroup(email: string, shareId: string) {
	return POST<{
		data: GroupDataItem;
	}>(`/group/${shareId}`, { email });
}

export async function updateGroup(
	email: string,
	shareId: string,
	title: string,
	matchCondition: string | "home"
) {
	return PATCH(`/group/${shareId}`, { email, title, matchCondition });
}

export async function deleteGroupMember(email: string, shareId: string, userId: string) {
	return POST(`/group/${shareId}/remove-user`, { email, userId });
}

export async function resetShareCode(email: string, shareId: string) {
	return POST(`/group/${shareId}/reset-share`, { email });
}
