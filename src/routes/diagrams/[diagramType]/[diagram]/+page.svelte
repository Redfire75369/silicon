<script lang="ts">
	import Container from "components/Container.svelte";
	import Header from "components/Header.svelte";
	import type {PageData} from "./$types";

	export let data: PageData;

	const {codename, dies, name} = data.variant;
	const {diagrams} = data;
</script>

<style lang="scss">
	$width: max(80vw, min(95vw, 700px));

	hr {
		min-width: $width;
		max-width: $width;
	}

	.diagram-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		min-height: 100vh;

		font-family: Helvetica, Arial, sans-serif;
		background: linear-gradient(#2A2A2A, #1C1C1C);

		padding-bottom: 40px
	}
</style>

<Container>
	<Header>{name}</Header>
	<div class="diagram-container">
		{#each diagrams as diagram, i (`${codename}-${dies[i]}`)}
			<svelte:component this={diagram}/>
			{#if i !== diagrams.length - 1}
				<hr/>
			{/if}
		{/each}
	</div>
</Container>
