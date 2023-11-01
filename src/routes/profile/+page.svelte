<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
</script>

<HeadTagContent title="Profile" />

<!-- TODO: view profile, edit home place, sync calkendar, add transitions -->

{#if $page.data.session?.user}
	<h2>{$page.data.session.user.name ?? "Profile"}</h2>

	<button on:click={() => signOut()} class="button">Sign out</button>

	<pre>{JSON.stringify($page.data.session, null, 2)}</pre>
{:else}
	<h2>Profile</h2>

	You are not signed in
	<button on:click={() => signIn("google")}>Sign in with Google</button>
	<button
		on:click={() =>
			signIn("google", undefined, {
				reauth: "yes"
			})}>Use a different account</button
	>
{/if}

<style>
	pre {
		overflow-x: scroll;
	}
</style>
