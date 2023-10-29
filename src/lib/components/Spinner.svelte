<script lang="ts">
	export let inline = false;
</script>

<div class="spinner" class:inline />

<style>
	.spinner {
		animation: spin 0.5s linear infinite;
		width: 1em;
		height: 1em;
		border: 0.1em solid transparent;
		border-top-color: currentColor;
		box-sizing: border-box;
		border-radius: 9em;
		margin: auto;
	}

	@keyframes spin {
		from {
			transform: translateY(0.15em) rotate(0);
		}
		to {
			transform: translateY(0.15em) rotate(360deg);
		}
	}

	.spinner.inline {
		display: inline-block;
		margin: 0;
	}
</style>
