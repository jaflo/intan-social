<script lang="ts">
	import GooView from "./GooView.svelte";
	import type { GridItem } from "./shared";

	export let year: number;
	export let month: number;
	export let dayShouldBeColor: (d: Date) => string = () => "";
	export let showHeader = true;

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	let grid: (GridItem | null)[][] = [];

	$: {
		grid = [];

		const d = new Date(year, month, 1, 12, 0, 0, 0);

		// spaces for the first row
		let row: (GridItem | null)[] = new Array(d.getDay()).fill(null);

		while (d.getMonth() === month) {
			row.push({
				number: d.getDate(),
				color: dayShouldBeColor(d)
			});

			if (d.getDay() % 7 === 6) {
				grid.push(row);
				row = [];
			}

			d.setDate(d.getDate() + 1);
		}
		if (row.length > 0) {
			grid.push(row);
		}

		// spaces after last days of month for the last row
		if (d.getDay() !== 0) {
			for (let i = d.getDay(); i < 7; i++) {
				row.push(null);
			}
		}

		grid = grid;
	}
</script>

{new Date(year, month).toLocaleString("en-US", {
	month: "long",
	year: "numeric"
})}

<div class="wrapper">
	<div class="view">
		<GooView {grid} />
	</div>
	<div class="interact">
		<table>
			{#if showHeader}
				<tr>
					{#each weekdays as day}
						<td>{day}</td>
					{/each}
				</tr>
			{/if}
			{#each grid as row}
				<tr>
					{#each row as day}
						{#if day}
							<td>{day.number}</td>
						{:else}
							<td />
						{/if}
					{/each}
				</tr>
			{/each}
		</table>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
	}

	.interact {
		position: relative;
		padding: 15px;
	}

	.view {
		position: absolute;
		bottom: 0;
	}

	table {
		border-spacing: 0;
		border-collapse: collapse;
		table-layout: fixed;
		border: 0;
		text-align: center;
	}

	td {
		width: 60px;
		height: 60px;
		padding: 0;
	}
</style>
