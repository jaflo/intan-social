<script lang="ts">
	import type { GridItem } from "./shared";

	export let year: number;
	export let month: number;
	export let dayShouldBeColor: (d: Date) => string = () => "";

	let grid: (GridItem | null)[][] = [];

	$: {
		grid = [];

		const d = new Date(year, month, 1, 12, 0, 0, 0);
		const now = new Date();

		// spaces for the first row
		let row: (GridItem | null)[] = new Array(d.getDay()).fill(null);

		while (d.getMonth() === month) {
			row.push({
				number: d.getDate(),
				color: dayShouldBeColor(d),
				isPast: d.getTime() < now.getTime()
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

<strong>
	{new Date(year, month).toLocaleString("en-US", {
		month: "long",
		year: "numeric"
	})}
</strong>

<table>
	{#each grid as row}
		<tr>
			{#each row as day, i}
				{#if day}
					<td
						style:background={day.color}
						style:color={i === 0 || i === 6 ? "red" : undefined}
						style:opacity={day.isPast ? 0.5 : 1}
					>
						<div>
							<span>{day.number}</span>
						</div>
					</td>
				{:else}
					<td><div /></td>
				{/if}
			{/each}
		</tr>
	{/each}
</table>

<style>
	strong {
		display: block;
		text-align: center;
		padding: calc(100% / 7 / 2 - 1em) 0;
	}

	table {
		border-spacing: 0;
		border-collapse: collapse;
		table-layout: fixed;
		border: 0;
		text-align: center;
		width: 100%;
	}

	td {
		padding: 0;
	}

	td > div {
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
