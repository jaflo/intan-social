<script lang="ts">
	export let year: number;
	export let month: number;
	export let dayShouldBeColor: (d: Date) => string = () => "";

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	interface GridItem {
		number: number;
		color?: string;
	}
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

<table>
	<tr>
		{#each weekdays as day}
			<td>{day}</td>
		{/each}
	</tr>
	{#each grid as row}
		<tr>
			{#each row as day}
				{#if day}
					<td style:background={day.color}>{day.number}</td>
				{:else}
					<td />
				{/if}
			{/each}
		</tr>
	{/each}
</table>

<style>
	table {
		border-spacing: 0;
		border-collapse: collapse;
		table-layout: fixed;
	}

	td {
		width: 40px;
	}
</style>
