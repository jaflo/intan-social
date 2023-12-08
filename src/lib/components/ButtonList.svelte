<script lang="ts">
	import { IconChevronRight, IconX } from "@tabler/icons-svelte";
	import Avatar from "./Avatar.svelte";

	export let list: {
		label: string;
		action: any;
		primaryIcon: typeof IconX | string;
		secondaryIcon?: "delete" | "none";
		shownIf?: boolean;
	}[];
</script>

<div class="list">
	{#each list as { label, action, primaryIcon, secondaryIcon, shownIf }}
		{#if shownIf === undefined || shownIf === true}
			<button on:click={action} class="simple">
				<div class="icon">
					{#if typeof primaryIcon === "string"}
						<Avatar name={primaryIcon} size={32} />
					{:else}
						<svelte:component this={primaryIcon} size={24} />
					{/if}
				</div>
				<div class="label">{label}</div>
				<div class="secondary">
					{#if secondaryIcon === "delete"}
						<IconX size={24} />
					{:else if secondaryIcon !== "none"}
						<IconChevronRight size={24} />
					{/if}
				</div>
			</button>
		{/if}
	{/each}
</div>

<style>
	.list button {
		display: flex;
		width: 100%;
		text-align: left;
		padding: var(--half-pad) 0;
		align-items: center;
		line-height: 1;
	}

	.list button .label {
		flex: 1;
		padding: 0 var(--half-pad);
	}
</style>
