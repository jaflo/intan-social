<script lang="ts">
	import { colors } from "$lib/helpers/colors";
	import type { UserTransition } from "$lib/types";
	import Month from "./Month.svelte";

	export let homeLocation: string;
	export let transitions: UserTransition[];

	$: preparedTransitions = transitions
		.map((t) => ({
			...t,
			time: new Date(t.time)
		}))
		.sort((a, b) => a.time.getTime() - b.time.getTime());
	$: places = transitions.map((t) => t.place).filter((p) => p !== homeLocation);

	function dayShouldBeColor(date: Date) {
		const place =
			preparedTransitions.findLast((t) => t.time.getTime() < date.getTime())?.place ||
			homeLocation;
		const index = places.indexOf(place);
		if (index === -1) {
			return "";
		} else {
			return colors[index % colors.length];
		}
	}

	const now = new Date();
	const currentMonth = now.getMonth();
	const months = Array(12)
		.fill(0)
		.map((_, index) => currentMonth + index);
</script>

{#each months as month, i}
	<Month
		year={now.getFullYear() + Math.floor(month / 12)}
		month={month % 12}
		{dayShouldBeColor}
		showHeader={i === 0}
	/>
{/each}
