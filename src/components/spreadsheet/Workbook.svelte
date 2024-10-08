<script lang="ts">
	import Worksheet from "components/spreadsheet/Worksheet.svelte";
	import type {Worksheet as WorksheetT} from "$lib/spreadsheet/workbook";

	interface Props {
		keys: string[],
		names: string[],
		worksheets: WorksheetT[],
	}

	let {keys, names, worksheets}: Props = $props();

	let currentIndex = $state(0);
	let worksheet = $derived(worksheets[currentIndex]);

	const callbacks = keys.map((_, index) => {
		return () => {
			currentIndex = index;
		};
	});
</script>

<style lang="scss">
	$base-font: #F3F3F3;
	$hover-font: #FBBF24;
	$active-bg: #1E40AF;
	$inactive-bg: #261C2C;
	$border: #C4B5FD;

	.workbook {
		display: flex;
		flex-direction: column;
		font-family: "Segoe UI", sans-serif;
	}

	.navigation {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: center;
		min-height: 40px;
		max-height: 40px;
	}

	.tab {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;

		padding: 10px;

		border-left: 0.5px inset;
		border-right: 0.5px inset;
		border-radius: 2px;
		border-color: $border;

		color: $base-font;

		cursor: pointer;

		&.active {
			background: $active-bg;
		}

		&.inactive {
			background: $inactive-bg;

			&:hover {
				color: $hover-font;
			}
		}

		&.link {
			background: $inactive-bg;
			text-decoration: none;

			&:hover {
				color: $hover-font;
			}
		}
	}
</style>

<div class="workbook">
	<Worksheet {worksheet}/>

	<div class="navigation">
		<a class="tab link" href="../">
			Browse Spreadsheets
		</a>

		{#each keys as key, index (key)}
			{#if index === currentIndex}
				<div class="tab active">
					{names[index]}
				</div>
			{:else}
				<button class="tab inactive" onclick={callbacks[index]}>
					{names[index]}
				</button>
			{/if}
		{/each}
	</div>
</div>
