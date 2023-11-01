<script lang="ts">
	import { onMount } from "svelte";
	import type { GridItem } from "./shared";

	export let grid: (GridItem | null)[][];

	const gridItemSize = 60;
	const pad = gridItemSize / 4;

	let canvas: HTMLCanvasElement;
	onMount(() => {
		const ctx = canvas.getContext("2d");

		// let t = 0;

		function draw() {
			if (!ctx) {
				return;
			}

			// reset
			canvas.width = pad * 2 + grid[0].length * gridItemSize;
			canvas.height = pad * 2 + grid.length * gridItemSize;
			ctx.globalCompositeOperation = "lighten";

			// draw
			for (let i = 0; i < grid.length; i++) {
				const row = grid[i];
				for (let j = 0; j < row.length; j++) {
					const item = row[j];
					if (item?.color) {
						circle(
							pad + gridItemSize / 2 + j * gridItemSize,
							pad + gridItemSize / 2 + i * gridItemSize,
							gridItemSize * 0.9,
							item?.color
						);
					}
				}
			}

			// goo
			const minThreshold = 0.5;
			const maxThreshold = 0.55;
			const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for (let i = 0; i < d.data.length; i += 4) {
				const alpha = d.data[i + 3] / 255;
				let value = 0;
				if (alpha < minThreshold) {
					value = 0;
				} else if (alpha > maxThreshold) {
					value = 1;
				} else {
					value = (alpha - minThreshold) / (maxThreshold - minThreshold);
				}
				d.data[i + 3] = 255 * value;
			}
			ctx.putImageData(d, 0, 0);

			// // and again
			// t++;

			// requestAnimationFrame(draw);
		}

		draw();

		function circle(x: number, y: number, r: number, hex: string) {
			if (!ctx) {
				return;
			}

			const rgb = hexToRgb(hex.replace("#", ""));

			const radgrad = ctx.createRadialGradient(x, y, 0, x, y, r);
			radgrad.addColorStop(0, `rgba(${rgb},1)`);
			radgrad.addColorStop(0.4, `rgba(${rgb},.9)`);
			radgrad.addColorStop(1, `rgba(${rgb},0)`);
			ctx.fillStyle = radgrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		function hexToRgb(hex: string) {
			var bigint = parseInt(hex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			return r + "," + g + "," + b;
		}
	});
</script>

<canvas bind:this={canvas} />
