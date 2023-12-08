import { signIn } from "@auth/sveltekit/client";
import { get } from "svelte/store";
import { group, reloadGroup } from "./shared";
import { user } from "$lib/components/user/user";

export async function joinGroup() {
	const _user = get(user);
	const _group = get(group);

	if (!_user) {
		// TODO: if just redirected, reprompt to join
		signIn("google");
		return;
	}
	if (!_group) return;

	const response = await fetch(`/api/group/${_group.group.shareId}/join`, {
		method: "POST"
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

export async function leaveGroup() {
	const _group = get(group);

	// hacky but whatever
	const myUserId = _group?.members?.find((m) => m.isSelf)?.id;
	if (!myUserId) return;
	return removeMember(myUserId);
}

export async function removeMember(userId: string) {
	const _group = get(group);
	if (!_group) return;

	const response = await fetch(`/api/group/${_group.group.shareId}/member/${userId}`, {
		method: "DELETE"
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
