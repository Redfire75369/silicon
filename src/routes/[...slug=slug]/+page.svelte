<script lang="ts">
	import Container from "components/Container.svelte";
	import Header from "components/Header.svelte";
	import Markdown from "components/Markdown.svelte";
	import type {PageData} from "./$types";

	export let data: PageData;

	const {body, metadata} = data;
</script>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>

<Container>
	<Header>{metadata.title}</Header>
	<Markdown>
		<svelte:component this={body}/>
	</Markdown>
</Container>
