<script lang="ts">
	import "../app.css";
	import { signIn } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import SpinnerWithText from "$lib/components/SpinnerWithText.svelte";

	let preventRender = !!$page.data.session?.shouldReauth;
	if (browser && preventRender) {
		signIn("google", undefined, {
			reauth: "yes"
		});
	}
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#353535" />
	<meta name="theme-color" content="#fcfdf6" />
</svelte:head>

<header>
	<a href="/"><h1>Intan</h1></a>
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
	}
</style>
