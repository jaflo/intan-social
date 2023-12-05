<script lang="ts">
	import Modal from "./Modal.svelte";

	export let title: string;

	let isOpen = false;
	let openModal: () => void = () => (isOpen = true);
	let closeModal = () => (isOpen = false);
</script>

<slot name="button" {isOpen} {openModal} />

{#if isOpen}
	<Modal on:close={closeModal} {title}>
		<slot name="modal" {isOpen} {closeModal} />
	</Modal>
{/if}
