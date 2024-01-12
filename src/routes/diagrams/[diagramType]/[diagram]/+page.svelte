<script lang="ts">
	import Container from "components/Container.svelte";
	import Header from "components/Header.svelte";
	import Meta from "components/Meta.svelte";
	import type {PageData} from "./$types";

	export let data: PageData;

	const {codename, dies, name} = data.variant;
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
	}

	.diagram {
		padding-bottom: 1.5rem;
	}
</style>

<Meta title={`Diagram: ${name}`} author="Redfire"/>

<Container>
	<Header>{name}</Header>
	<div class="diagram-container">
		{#each data.diagrams as diagram, i (`${codename}-${dies[i]}`)}
			<div class="diagram">
				<svelte:component this={diagram}/>
			</div>
			{#if i !== data.diagrams.length - 1}
				<hr/>
			{/if}
		{/each}
	</div>
</Container>
