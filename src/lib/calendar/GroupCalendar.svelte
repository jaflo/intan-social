<script lang="ts">
	import { unique } from "$lib/helpers/util";
	import type { GroupMemberTransition } from "$lib/types";
	import Calendar from "./Calendar.svelte";

	export let currentAvailabilityPerUser: string[];
	export let transitions: GroupMemberTransition[];

	$: preparedTransitions = transitions
		.map((t) => ({
			...t,
			time: new Date(t.time)
		}))
		.sort((a, b) => a.time.getTime() - b.time.getTime());
	$: people = unique(transitions.map((t) => t.user));

	function dayShouldBeColor(date: Date) {
		const availableCount = people
			.map(
				(p) =>
					preparedTransitions
						.filter((t) => t.user === p)
						.findLast((t) => t.time.getTime() < date.getTime())?.available || true
			)
			.filter((isAvailable) => isAvailable).length;
		return `rgba(0,255,0,${availableCount / people.length})`;
	}
</script>

<Calendar {dayShouldBeColor} />
