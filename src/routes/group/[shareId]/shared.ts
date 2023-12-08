import { browser, dev } from "$app/environment";
import type { GroupDataItem } from "$lib/types";
import { derived, get, writable } from "svelte/store";

export const group = writable<GroupDataItem | null | undefined>(undefined);

export async function loadGroup(shareId: string) {
	const response = await fetch(`/api/group/${shareId}`);
	const { data: responseData } = await response.json<{
		success: boolean;
		data: GroupDataItem;
	}>();
	group.set(responseData);
}

export async function reloadGroup() {
	const _group = get(group);
	if (!_group) {
		console.error("No group to reload");
	} else {
		return loadGroup(_group.group.shareId);
	}
}

export const shareLink = derived(
	group,
	($group) => (dev && browser ? window.location.origin : "") + "/group/" + $group?.group.shareId
);
