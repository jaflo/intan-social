<script lang="ts">
	import { browser } from "$app/environment";
	import { user } from "./user";
</script>

{#if !browser || $user === undefined}
	<slot name="loading" />
{:else if $user === null}
	<slot name="loggedout" />
{:else}
	<slot name="loggedin" />
{/if}
