<script lang="ts">
	import { beforeUpdate, onDestroy, onMount } from "svelte";

	let ref: HTMLElement;
	let portal: HTMLElement;
	let prevFocusElement: HTMLElement;

	beforeUpdate(() => {
		// return focus after
		if (!prevFocusElement) {
			prevFocusElement = document.activeElement as any;
		}
	});

	onMount(() => {
		portal = document.createElement("div");
		portal.className = "portal";
		document.body.appendChild(portal);
		portal.appendChild(ref);

		// added fix to autofocus when needed
		const focusTarget =
			ref.querySelector<HTMLElement>("[autofocus]") ||
			ref.querySelector<HTMLElement>("input, button:not(.close), textarea") ||
			ref.querySelector<HTMLElement>("button");
		focus(focusTarget);
	});

	onDestroy(() => {
		portal && document.body.removeChild(portal);
		focus(prevFocusElement);
	});

	function focus(el: HTMLElement | null) {
		if (!el || el === document.body) return;

		el.focus({
			preventScroll: true,
		});
	}
</script>

<div bind:this={ref}>
	<slot />
</div>
