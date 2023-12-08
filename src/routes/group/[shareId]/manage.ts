import { goto } from "$app/navigation";
import { get } from "svelte/store";
import { group, loadGroup, reloadGroup } from "./shared";

export async function deleteGroup() {
	const _group = get(group);
	if (!_group) return;

	// TODO: clean these up into some shared format
	const response = await fetch(`/api/group/${_group.group.shareId}`, {
		method: "DELETE"
	});
	const { success, message } = await response.json<{
		success: boolean;
		message: string;
	}>();
	if (success) {
		goto("/");
	} else {
		alert(message);
	}
}

export async function renameGroup(updatedName: string) {
	const _group = get(group);
	if (!_group) return;

	const response = await fetch(`/api/group/${_group.group.shareId}`, {
		method: "PATCH",
		body: JSON.stringify({
			title: updatedName
		})
	});
	const { success, message } = await response.json<{
		success: boolean;
		message: string;
	}>();
	if (success) {
		await reloadGroup();
	} else {
		alert(message);
	}
}

export async function resetGroupShareLink() {
	const _group = get(group);
	if (!_group) return;

	const response = await fetch(`/api/group/${_group.group.shareId}/reset`, {
		method: "POST"
	});
	const { success, message, data } = await response.json<{
		success: boolean;
		message: string;
		data: {
			shareId: string;
		};
	}>();
	if (success) {
		goto(`/group/${data.shareId}`);
		await loadGroup(data.shareId);
		return data.shareId;
	} else {
		alert(message);
	}
}
