<script lang="ts">
	interface Props {
		cell: string,
		hyperlink?: string,
	}
	let {cell, hyperlink}: Props = $props();
</script>

{#if hyperlink}
	<a target="_blank" rel="noreferrer" href={hyperlink}>{cell}</a>
{:else }
	<div>{cell}</div>
{/if}
