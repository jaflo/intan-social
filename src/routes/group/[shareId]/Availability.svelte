<script lang="ts">
	import GroupCalendar from "$lib/calendar/GroupCalendar.svelte";
	import { group } from "./shared";
</script>

{#if $group?.transitions}
	<GroupCalendar
		currentlyAvailableUsers={$group.members
			?.filter((user) => user.available)
			.map((user) => user.id) || []}
		transitions={$group.transitions}
	/>
{/if}
