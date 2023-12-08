<script lang="ts">
	import ButtonList from "$lib/components/ButtonList.svelte";
	import { removeMember } from "./membership";
	import { group, shareLink } from "./shared";

	function selectAll(e: { currentTarget: HTMLInputElement }) {
		(e.currentTarget as HTMLInputElement)?.setSelectionRange(0, 9999);
	}
</script>

{#if $group?.members}
	<ButtonList
		list={$group.members.map((member) => ({
			label: [member.name, member.isSelf && "(you)", member.isOwner && "(owner)"]
				.filter((x) => !!x)
				.join(" "),
			action: async () => {
				if (confirm(`Are you sure you want to remove ${member.name} from the group?`)) {
					await removeMember(member.id);
				}
			},
			primaryIcon: member.id,
			secondaryIcon: $group?.isOwner && !member.isSelf ? "delete" : "none"
		}))}
	/>

	<p>
		Invite others using this link: <input
			readonly
			type="text"
			on:click={selectAll}
			on:focus={selectAll}
			value={$shareLink}
		/>
	</p>

	{#if $group.isOwner}
		<p>
			Your group link leaked and people keep joining? You can reset the link in the "Manage"
			tab!
		</p>
	{/if}
{/if}
