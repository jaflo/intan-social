<script lang="ts">
	import type { GroupListItem } from "$lib/types";

	async function getGroups() {
		const response = await fetch("/api/group");
		const { data } = await response.json<{
			success: boolean;
			data: GroupListItem[];
		}>();
		return data;
	}
</script>

{#await getGroups()}
	<p>Loading...</p>
{:then groups}
	<ul>
		{#each groups as group}
			<li>
				<a href="/group/{group.shareId}">{group.title}</a>
			</li>
		{/each}
	</ul>
{:catch error}
	<p>{error.message}</p>
{/await}
