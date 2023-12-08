<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import ButtonList from "$lib/components/ButtonList.svelte";
	import { IconBrandGoogle, IconLogout, IconMapPin, IconReplace } from "@tabler/icons-svelte";
</script>

<HeadTagContent title="Profile" />

{#if $page.data.session?.user}
	<h2>{$page.data.session.user.name ?? "Profile"}</h2>

	<ButtonList
		list={[
			{
				label: "Change location",
				action: () => {
					// TODO: edit home location
				},
				primaryIcon: IconMapPin
			},
			// {
			// 	label: "Re-sync calendar",
			// 	action: () => {
			// 		// TODO: sync calendar
			// 	},
			// 	primaryIcon: IconCalendar
			// },
			{
				label: "Log out",
				action: () => {
					signOut();
				},
				primaryIcon: IconLogout
			},
			{
				label: "Use a different account",
				action: () => {
					signIn("google", undefined, {
						reauth: "yes"
					});
				},
				primaryIcon: IconReplace
			}
		]}
	/>
{:else}
	<h2>Profile</h2>

	<p>You are not logged in. Log in with your Google account to share your travel plans.</p>

	<ButtonList
		list={[
			{
				label: "Log in with Google",
				action: () => {
					signIn("google");
				},
				primaryIcon: IconBrandGoogle
			},
			{
				label: "Use a different account",
				action: () => {
					signIn("google", undefined, {
						reauth: "yes"
					});
				},
				primaryIcon: IconReplace
			}
		]}
	/>
{/if}

<style>
	pre {
		overflow-x: scroll;
	}
</style>
