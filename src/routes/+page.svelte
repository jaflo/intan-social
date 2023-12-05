<script lang="ts">
	import { page } from "$app/stores";
	import HeadTagContent from "$lib/components/HeadTagContent.svelte";
	import GroupList from "$lib/groups/GroupList.svelte";
	import UserCalendar from "$lib/calendar/UserCalendar.svelte";
	import type { UserTransition } from "$lib/types";

	async function getMyData() {
		const response = await fetch("/api/user");
		const { data } = await response.json<{
			success: boolean;
			data: {
				user: {
					name: string;
					email: string;
					place: string;
				};
				transitions: UserTransition[];
			};
		}>();
		return data;
	}
</script>

<HeadTagContent title="Home" />

{#if $page.data.session?.user}
	<h2>Groups</h2>
	<GroupList />

	<h2>Schedule</h2>
	{#await getMyData()}
		<p>Loading...</p>
	{:then { user, transitions }}
		<UserCalendar homeLocation={user.place} {transitions} />
	{:catch error}
		<p>{error.message}</p>
	{/await}
{:else}
	<!-- TODO: landing page -->
	Welcome!
{/if}
