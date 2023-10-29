<script lang="ts">
	import { pageTitle } from "$lib/helpers/util";

	export let title = "Title";
	export let description = "Description";

	$: fullTitle = pageTitle(title);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<!-- <meta property="og:image" content="https://mofi.loud.red/preview.png" /> -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<!-- <meta property="twitter:image" content="https://mofi.loud.red/preview.png" /> -->
</svelte:head>
