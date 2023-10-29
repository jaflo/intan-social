<script lang="ts">
	import Spinner from "./Spinner.svelte";
</script>

<div class="waiting">
	<Spinner inline />
	<div>
		<slot />
	</div>
</div>

<style>
	.waiting {
		position: relative;
	}

	.waiting :global(.spinner) {
		position: absolute;
		top: 0;
		left: 0;
	}

	.waiting div {
		margin-left: 1em;
		padding-left: var(--half-pad);
	}
</style>
