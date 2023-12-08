<script lang="ts">
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import { group, loadGroup } from "./shared";
	import Members from "./Members.svelte";
	import Manage from "./Manage.svelte";
	import Availability from "./Availability.svelte";
	import SpinnerWithText from "$lib/components/SpinnerWithText.svelte";
	import { joinGroup } from "./membership";
	import { user } from "$lib/components/user/user";
	import { signIn } from "@auth/sveltekit/client";

	export let data: PageData;

	onMount(() => {
		loadGroup(data.shareId);

		return () => {
			$group = undefined;
		};
	});

	$: pages = [
		{
			label: "Availability",
			sideLabel: $group?.group.matchCondition,
			page: Availability
		},
		{
			label: $group?.members?.length === 1 ? "Invite Members" : "Members",
			sideLabel: $group?.members?.length,
			page: Members
		},
		{
			label: "Manage",
			page: Manage
		}
	];

	let currentPage = 0;
</script>

<HeadTagContent title={$group?.group.title ?? "Group"} />

{#if $group === undefined}
	<SpinnerWithText>Loading...</SpinnerWithText>
{:else if $group === null}
	<h2>Not found</h2>
{:else if !$group.isMember}
	<h2>{$group.group.title}</h2>

	<p>
		This group shows when everyone is {$group?.group.matchCondition === "home"
			? "home"
			: `near ${$group?.group.matchCondition}`}. Please join the group to view and share your
		availability.
	</p>

	{#if !$user}
		<p>You can log in through Google and all of your flights will be imported automatically!</p>
		<button on:click={() => signIn("google")}>Log in with Google</button>
	{:else}
		<button on:click={joinGroup}>Join group</button>
	{/if}
{:else}
	<h2>{$group.group.title}</h2>

	{#if $group.members?.length === 1}
		<!-- TODO: invite members instruction banner -->
		<p>Invite your friends by sending them this link</p>
	{/if}

	<div class="tabs">
		{#each pages as { label, sideLabel }, i}
			<button
				on:click={() => (currentPage = i)}
				class="simple tab"
				class:bolded={i === currentPage}
				class:selected={i === currentPage}
			>
				<div>
					{label}
					{#if sideLabel}
						<small>{sideLabel}</small>
					{/if}
				</div>
			</button>
		{/each}
	</div>
	{#each pages as { page }, i}
		<div style:display={i === currentPage ? "block" : "none"}>
			<svelte:component this={page} />
		</div>
	{/each}
{/if}

<style>
	.tabs {
		margin: calc(-1 * var(--half-pad)) 0 0 0;
	}

	.tabs button {
		padding: var(--pad) var(--pad) var(--pad) 0;
		border-bottom: 2px solid transparent;
	}

	.tabs button div {
		padding-bottom: var(--half-pad);
		border-bottom: 2px solid transparent;
		display: flex;
		align-items: center;
	}

	.tabs button div small {
		color: var(--background-color);
		background: var(--foreground-color);
		line-height: 1;
		border-radius: 9em;
		padding: 0.2em 0.4em;
		margin-left: var(--half-pad);
		font-weight: normal;
	}

	.tabs button.selected div {
		border-bottom-color: currentColor;
	}
</style>
