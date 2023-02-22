<script lang="ts">
	import type {Cell} from "$lib/spreadsheet/types";
	import {cellToHyperlink, cellToString} from "$lib/spreadsheet/cell";

	export let cell: Cell;

	$: hyperlink = cellToHyperlink(cell);
	$: text = cellToString(cell);
</script>

{#if hyperlink}
	<a target="_blank" rel="noreferrer" href={hyperlink}>{text}</a>
{:else }
	<div>{text}</div>
{/if}
