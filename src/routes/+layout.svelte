<script lang="ts">
	import "../app.css";
	import { signIn } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import SpinnerWithText from "$lib/components/SpinnerWithText.svelte";
	import UserStatusSlots from "$lib/components/user/UserStatusSlots.svelte";
	import { pageTitle } from "$lib/helpers/util";
	import Split from "$lib/components/Split.svelte";
	import { user } from "$lib/components/user/user";
	import Spinner from "$lib/components/Spinner.svelte";
	import Avatar from "$lib/components/Avatar.svelte";

	$: path = $page.url.pathname;

	let preventRender = !!$page.data.session?.shouldReauth;
	if (browser) {
		if (preventRender) {
			signIn("google", undefined, {
				reauth: "yes"
			});
		} else {
			$user = $page.data.session?.user || null;
		}
	}
</script>

<header>
	<Split>
		<div class="main" slot="a">
			<h1><a href="/" class:active={path === "/"}>{pageTitle()}</a></h1>
		</div>
		<div slot="b">
			<UserStatusSlots>
				<Spinner slot="loading" />
				<a slot="loggedout" href="/profile" class:active={path === "/login"}>Log in</a>
				<a
					slot="loggedin"
					href="/profile"
					class:active={path === "/profile"}
					title="Profile"
				>
					<Avatar name={$user?.email || ""} size={32} />
				</a>
			</UserStatusSlots>
		</div>
	</Split>
</header>

<main>
	{#if preventRender}
		<SpinnerWithText>Redirecting...</SpinnerWithText>
	{:else}
		<slot />
	{/if}
</main>

<footer>&copy; 2023</footer>

<style>
	header,
	main,
	footer {
		max-width: 40em;
		margin: 1em auto;
		padding: 0 var(--pad);
	}

	h1 {
		--font-weight: bold;
		font-size: var(--font-size);
		padding-right: var(--half-pad);
		margin: 0;
		margin-right: var(--half-pad);
	}

	header h1 a {
		--logo-size: 18px;
		padding-left: calc(var(--logo-size) + var(--half-pad));
		background-image: url("/android-chrome-192x192.png");
		background-size: var(--logo-size);
		background-repeat: no-repeat;
		background-position: center left;
	}
</style>
