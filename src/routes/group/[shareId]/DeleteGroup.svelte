<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import ButtonAndModal from "$lib/components/modal/ButtonAndModal.svelte";

	export let shareId: string;
	export let reloadGroup: () => void;

	let loading = false;

	async function confirmCancel(closeModal: () => void) {
		loading = true;

		// TODO: clean these up into some shared format
		const response = await fetch(`/api/group/${shareId}`, {
			method: "DELETE"
		});
		const { success, message } = await response.json<{
			success: boolean;
			message: string;
		}>();
		if (success) {
			await reloadGroup();
		} else {
			alert(message);
		}

		closeModal();
	}
</script>

<ButtonAndModal title="Cancel plan?">
	<svelte:fragment let:openModal slot="button">
		<button on:click={openModal}>Delete group</button>
	</svelte:fragment>
	<svelte:fragment slot="modal" let:closeModal>
		<p>
			Are you sure you want to cancel your plan? You will still have access until the end of
			your billing cycle.
		</p>
		<button
			on:click|once={() => confirmCancel(closeModal)}
			class="full primary"
			disabled={loading}
		>
			{#if loading}
				<Spinner inline />
			{:else}
				Yes, delete group
			{/if}
		</button>
		<button on:click={closeModal} class="full" disabled={loading}>Cancel</button>
	</svelte:fragment>
</ButtonAndModal>
