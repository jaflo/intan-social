<script lang="ts">
	import Spinner from "$lib/components/Spinner.svelte";
	import ButtonAndModal from "$lib/components/modal/ButtonAndModal.svelte";
	import { group, reloadGroup } from "../shared";

	let loading = false;
	let updatedName = "";

	async function saveName(closeModal: () => void) {
		if (!$group) return;

		loading = true;

		const response = await fetch(`/api/group/${$group.group.shareId}`, {
			method: "PATCH",
			body: JSON.stringify({
				place: updatedName
			})
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

		loading = false;
		closeModal();
	}

	function open(openModal: () => void) {
		updatedName = $group?.group.matchCondition || "";
		openModal();
	}
</script>

<ButtonAndModal title="Update name">
	<svelte:fragment let:openModal slot="button">
		(<button on:click={() => open(openModal)} class="link">change location</button>)
	</svelte:fragment>
	<svelte:fragment slot="modal" let:closeModal>
		<p>Change the match condition.</p>
		<form slot="modal" on:submit|preventDefault={() => saveName(closeModal)}>
			<!-- TODO: use a dropdown/search -->
			<input type="text" bind:value={updatedName} />
			<button class="full primary" disabled={loading}>
				{#if loading}
					<Spinner inline />
				{:else}
					Save
				{/if}
			</button>
		</form>
	</svelte:fragment>
</ButtonAndModal>
