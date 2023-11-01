<script lang="ts">
	import type { UserTransition } from "$lib/types";
	import Month from "./Month.svelte";

	export let transitions: UserTransition[] = [];
	// $: preparedTransitions = transitions.map(t=>({
	// 	...t,

	// }))

	// function dayShouldBeColor(date:Date) {
	// 	const
	// 	return closestTransition ? closestTransition.color : null;
	// }

	const now = new Date();
	const currentMonth = now.getMonth();
	const months = Array(12)
		.fill(0)
		.map((_, index) => currentMonth + index);
</script>

{#each months as month}
	<Month year={now.getFullYear() + Math.floor(month / 12)} month={month % 12} />
{/each}
