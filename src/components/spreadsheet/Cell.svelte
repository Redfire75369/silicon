<script lang="ts">
	interface Props {
		cell: string
	}
	let {cell}: Props = $props();

 	let hyperlink = $state(null);
</script>

{#if hyperlink}
	<a target="_blank" rel="noreferrer" href={hyperlink}>{cell}</a>
{:else }
	<div>{cell}</div>
{/if}
