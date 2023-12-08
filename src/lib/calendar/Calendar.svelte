<script lang="ts">
	import Month from "./Month.svelte";

	export let monthCount = 12;
	export let dayShouldBeColor: (date: Date) => string;

	const now = new Date();
	const currentMonth = now.getMonth();
	$: months = Array(monthCount)
		.fill(0)
		.map((_, index) => currentMonth + index);
</script>

<div class="calendar">
	{#each months as month}
		<div class="month">
			<Month
				year={now.getFullYear() + Math.floor(month / 12)}
				month={month % 12}
				{dayShouldBeColor}
			/>
		</div>
	{/each}
</div>

<style>
	.calendar {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--pad);
	}
</style>
