<script lang="ts">
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import type { GroupDataItem } from "$lib/types";
	import type { PageData } from "./$types";

	export let data: PageData;

	async function getGroup() {
		const response = await fetch("/api/group/" + data.shareId);
		const { data: reponseData } = await response.json<{
			success: boolean;
			data: GroupDataItem;
		}>();
		return reponseData;
	}
</script>

<HeadTagContent title="Group" />

{#await getGroup()}
	<p>Loading...</p>
{:then data}
	<h2>{data.group.title}</h2>

	{#if !data.isMember}
		<!-- TODO: implement -->
		<button>Join group</button>
	{:else}
		<!-- TODO: implement -->
		<button>Leave group</button>
	{/if}

	<!-- TODO: if owner: remove others, delete, rename, change airport/match condition, reset -->

	{#if data.members}
		<h3>Members:</h3>
		<ul>
			{#each data.members as member}
				<li>{member.name}</li>
			{/each}
		</ul>
	{/if}

	{#if data.transitions}
		<h3>Transitions:</h3>
		<ul>
			{#each data.transitions as transition}
				<li>{transition.time}</li>
			{/each}
		</ul>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
