<script lang="ts">
	import Portal from "$lib/components/Portal.svelte";
	import { fly } from "svelte/transition";
	import Shade from "./Shade.svelte";
	import { IconAlertTriangle, IconX } from "@tabler/icons-svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { ModalType, getZIndex, modalCount } from ".";

	export let title: string;
	export let type: ModalType = ModalType.Generic;
	export let width: number | undefined = undefined;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	const zIndex = getZIndex();
	let myModalIndex = 0;
	let contentEl: HTMLElement;

	function closeModal() {
		if (type !== ModalType.Undismissable) {
			dispatch("close");
		}
	}

	function closeModalOnOutsideClick(event: MouseEvent) {
		if (!contentEl?.contains(event.target as Node)) {
			closeModal();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			closeModal();
		}
	}

	onMount(() => {
		myModalIndex = $modalCount;
		$modalCount++;
		return () => {
			$modalCount--;
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<Portal>
	<Shade {zIndex} />
	<!--
		svelte-ignore a11y-click-events-have-key-events
		svelte-ignore a11y-no-noninteractive-element-interactions
		window handler catches escape -->
	<div
		class="modal"
		in:fly={{ y: 10, duration: 200 }}
		out:fly={{ y: -10, duration: 200 }}
		role="dialog"
		on:click={closeModalOnOutsideClick}
		style:z-index={zIndex}
		style:--modal-index={myModalIndex}
		style:--width={width ? width + "px" : ""}
	>
		<div class="spacer" />
		<div class="wrapper" bind:this={contentEl}>
			<div class="header">
				<h2>
					{#if type === ModalType.Error}
						<IconAlertTriangle size={20} />
					{/if}
					{title}
				</h2>
				<button
					title="Close"
					class="close simple"
					disabled={type === ModalType.Undismissable}
					on:click={closeModal}
				>
					<IconX />
				</button>
			</div>
			<div class="contents">
				<slot />
			</div>
		</div>
		<div class="spacer" />
	</div>
</Portal>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		padding: 0 var(--pad);
	}

	.header {
		display: flex;
		align-items: center;
		border-bottom: var(--border-style);
		margin-bottom: calc(-1 * var(--half-pad));
	}

	h2 {
		font-size: 1em;
		flex: 1;
		padding: 0 var(--pad);
		margin: 0;
		--font-weight: 700;
		margin-top: calc(-1 * var(--half-pad));
	}

	h2 > :global(svg) {
		transform: translateY(0.25em);
		margin-right: 0.3em;
	}

	.close {
		padding: var(--pad);
		line-height: 0;
	}

	.close[disabled] {
		opacity: 0.2;
		pointer-events: none;
	}

	.spacer {
		min-height: var(--pad);
	}

	.wrapper {
		margin: auto;
		box-sizing: border-box;
		width: 100%;
		/* prop width if set, otherwise smaller on each modal open (min of 300px) */
		max-width: var(--width, max(300px, calc(400px - 20px * var(--modal-index, 0))));
		border-radius: var(--half-pad);
		background: var(--background-color);
		border: 2px solid var(--translucent-color);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		overflow-wrap: break-word;
	}

	.contents {
		position: relative;
		padding: var(--pad);
		padding-top: 0;
	}

	.contents > :global(:first-child) {
		margin-top: 0;
	}
</style>
