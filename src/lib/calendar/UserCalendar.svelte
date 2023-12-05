<script lang="ts">
	import { colors } from "$lib/helpers/colors";
	import type { UserTransition } from "$lib/types";
	import Calendar from "./Calendar.svelte";

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
</script>

<Calendar {dayShouldBeColor} />
