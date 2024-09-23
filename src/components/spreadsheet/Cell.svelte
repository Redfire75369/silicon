<script lang="ts">
	export let cell: string;

	$: hyperlink = null;
</script>

{#if hyperlink}
	<a target="_blank" rel="noreferrer" href={hyperlink}>{cell}</a>
{:else }
	<div>{cell}</div>
{/if}
