<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";

	if (browser && $page.data.session?.shouldReauth) {
		signIn("google", undefined, {
			reauth: "yes"
		});
	}
</script>

<h1>Hello</h1>
<p>
	{#if $page.data.session}
		<small>Signed in as</small><br />
		<strong>{$page.data.session.user?.name ?? "User"}</strong>
		<button on:click={() => signOut()} class="button">Sign out</button>

		<pre>{JSON.stringify($page.data.session, null, 2)}</pre>
	{:else}
		You are not signed in
		<button on:click={() => signIn("google")}>Sign In with Google</button>
	{/if}
</p>
