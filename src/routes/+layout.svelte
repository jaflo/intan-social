<script lang="ts">
	// import "../app.css";
	import { signIn } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";

	if (browser && $page.data.session?.shouldReauth) {
		signIn("google", undefined, {
			reauth: "yes"
		});
	}
</script>

<header>Intan</header>

<main>
	<slot />
</main>

<footer>
	&copy; 2023
	<a href="https://florian.janke.me/">Florian</a>
</footer>
