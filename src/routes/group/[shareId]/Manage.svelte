<script lang="ts">
	import EditMatchCondition from "./manage/EditMatchCondition.svelte";
	import { group } from "./shared";
	import { leaveGroup } from "./membership";
	import {
		IconDoorExit,
		IconEdit,
		IconMapPin,
		IconRotateClockwise2,
		IconTrash
	} from "@tabler/icons-svelte";
	import { deleteGroup, renameGroup, resetGroupShareLink } from "./manage";
	import ButtonList from "$lib/components/ButtonList.svelte";

	$: list = [
		{
			label: "Change location",
			action: () => {
				console.log("idk");
			},
			primaryIcon: IconMapPin,
			shownIf: !!$group?.isOwner
		},
		{
			label: "Rename group",
			action: async () => {
				const newName = prompt("Please enter the new group name:", $group?.group.title);
				if (newName) {
					await renameGroup(newName);
				}
			},
			primaryIcon: IconEdit,
			shownIf: !!$group?.isOwner
		},
		{
			label: "Reset share link",
			action: async () => {
				if (
					confirm(
						"Are you sure you want to reset the group share link? This will change the link to the group and any previously used link will stop working."
					)
				) {
					const shareId = await resetGroupShareLink();
					if (shareId) {
						alert(
							`Group link has been updated! Please make sure to take note of the new link (ending in ...${shareId.slice(
								-5
							)}) when you invite others.`
						);
					}
				}
			},
			primaryIcon: IconRotateClockwise2,
			shownIf: !!$group?.isOwner
		},
		{
			label: "Delete group",
			action: async () => {
				if (confirm("Are you sure you want to delete the group?")) {
					await deleteGroup();
				}
			},
			primaryIcon: IconTrash,
			shownIf: !!$group?.isOwner
		},
		{
			label: "Leave group",
			action: async () => {
				if (confirm("Are you sure you want to leave the group?")) {
					await leaveGroup();
				}
			},
			primaryIcon: IconDoorExit,
			shownIf: !$group?.isOwner
		}
	];
</script>

{#if $group}
	<p>
		This group shows when everyone is {$group?.group.matchCondition === "home"
			? "home"
			: `near ${$group?.group.matchCondition}`}.
	</p>

	<ButtonList {list} />

	{#if $group.isOwner}
		<EditMatchCondition />
	{/if}
{/if}
