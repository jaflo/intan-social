<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
</script>

{#if $page.data.session}
	Signed in as
	<strong>{$page.data.session.user?.name ?? "User"}</strong>
	<button on:click={() => signOut()} class="button">Sign out</button>

	<pre>{JSON.stringify($page.data.session, null, 2)}</pre>
{:else}
	You are not signed in
	<button on:click={() => signIn("google")}>Sign in with Google</button>
	<button
		on:click={() =>
			signIn("google", undefined, {
				reauth: "yes"
			})}>Use a different account</button
	>
{/if}
