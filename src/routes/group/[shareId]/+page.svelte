<script lang="ts">
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import type { GroupDataItem } from "$lib/types";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import EditMatchCondition from "./EditMatchCondition.svelte";
	import DeleteGroup from "./DeleteGroup.svelte";
	import { user } from "$lib/components/user/user";
	import { signIn } from "@auth/sveltekit/client";

	export let data: PageData;

	let group: GroupDataItem | null = null;
	onMount(loadGroup);
	async function loadGroup() {
		const response = await fetch(`/api/group/${data.shareId}`);
		const { data: responseData } = await response.json<{
			success: boolean;
			data: GroupDataItem;
		}>();
		group = responseData;
	}

	async function joinGroup() {
		if (!$user) {
			// TODO: if not logged in, log in, then redirect
			signIn("google");
			return;
		}
		if (!group) return;

		const response = await fetch(`/api/group/${data.shareId}/join`, {
			method: "POST"
		});
		const { success, message } = await response.json<{
			success: boolean;
			message: string;
		}>();
		if (success) {
			await loadGroup();
		} else {
			alert(message);
		}
	}

	async function leaveGroup() {
		// hacky but whatever
		const myUserId = group?.members?.find((m) => m.isSelf)?.id;
		if (!myUserId) return;
		return removeMember(myUserId);
	}

	async function removeMember(userId: string) {
		if (!group) return;

		if (group.isOwner) {
			// TODO: make prettier
			alert("You own this group so you need to delete it to leave.");
			return;
		}

		const response = await fetch(`/api/group/${data.shareId}/member/${userId}`, {
			method: "DELETE"
		});
		const { success, message } = await response.json<{
			success: boolean;
			message: string;
		}>();
		if (success) {
			await loadGroup();
		} else {
			alert(message);
		}
	}
</script>

<HeadTagContent title="Group" />

{#if !group}
	<p>Loading...</p>
{:else}
	<h2>{group.group.title}</h2>
	Show when everyone is {group.group.matchCondition === "home"
		? "home"
		: `near ${group.group.matchCondition}`}
	{#if group.isOwner}
		<EditMatchCondition
			shareId={data.shareId}
			currentValue={group.group.matchCondition}
			reloadGroup={loadGroup}
		/>
	{/if}

	{#if !group.isMember}
		<button on:click={joinGroup}>Join group</button>
	{:else if !group.isOwner}
		<button on:click={leaveGroup}>Leave group</button>
	{/if}

	{#if group.isOwner}
		<DeleteGroup shareId={data.shareId} reloadGroup={loadGroup} />
		<!-- TODO: implement -->
		<button on:click={leaveGroup}>Rename group</button>
	{/if}

	{#if group.members}
		<h3>Members:</h3>
		<ul>
			{#each group.members as member}
				<li>
					{member.name}
					{#if member.isOwner}(you){/if}
					{#if member.isOwner}*{/if}
					{#if group.isOwner}
						<!-- TODO: implement -->
						(kick)
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if group.transitions}
		<h3>Transitions:</h3>
		<ul>
			{#each group.transitions as transition}
				<li>
					{transition.time}: {transition.user} change to {transition.available}
				</li>
			{/each}
		</ul>
	{/if}
{/if}
