<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import type { GroupListItem } from "$lib/types";

	async function getGroups() {
		const response = await fetch("/api/group");
		const { data } = await response.json<{
			success: boolean;
			data: GroupListItem[];
		}>();
		return data;
	}
</script>

<HeadTagContent title="Home" />

{#if $page.data.session}
	Signed in as
	<strong>{$page.data.session.user?.name ?? "User"}</strong>
	<button on:click={() => signOut()} class="button">Sign out</button>

	<pre>{JSON.stringify($page.data.session, null, 2)}</pre>

	{#await getGroups()}
		<p>Loading...</p>
	{:then groups}
		<p>Showing {groups.length} groups.</p>

		<ul>
			{#each groups as group}
				<li>
					<a href="/group/{group.shareId}">{group.title}</a>
				</li>
			{/each}
		</ul>
	{:catch error}
		<p>{error.message}</p>
	{/await}
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
