<script lang="ts">
	import { fade } from "svelte/transition";

	export let zIndex = 10;
	export let opacity = 1;
</script>

<div
	class="shade"
	transition:fade={{ duration: 200 }}
	aria-hidden="true"
	style:opacity
	style:z-index={zIndex}
/>

<style>
	.shade {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}
</style>
