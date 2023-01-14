<script lang="ts">
	import Container from "components/Container.svelte";
	import Header from "components/Header.svelte";
	import Markdown from "components/Markdown.svelte";
	import type {PageData} from "./$types";

	export let data: PageData;

	const {slug, body, metadata} = data;
	const url = `https://silicon.redfire.dev/${slug}/`;
</script>

<svelte:head>
	<title>{metadata.title}</title>
	<meta property="og:title" content={metadata.title}/>
	<meta property="twitter:title" content={metadata.title}/>

	<meta property="author" content={metadata.author}/>
	<meta property="og:author" content={metadata.author}/>

	<meta property="og:url" content={url}/>
	<meta property="twitter:url" content={url}/>

	{#if metadata.icon}
		<link rel="icon" href={metadata.icon}/>
	{:else}
		<link rel="icon" href="/favicon.ico"/>
	{/if}

	{#if metadata.description}
		<meta property="description" content={metadata.description}/>
		<meta property="og:description" content={metadata.description}/>
		<meta property="twitter:description" content={metadata.description}/>
	{/if}

	{#if metadata.tags}
		{#each metadata.tags as tag}
			<meta property="article:tag" content={tag}/>
		{/each}
	{/if}
</svelte:head>

<Container>
	<Header>{metadata.title}</Header>
	<Markdown>
		<svelte:component this={body}/>
	</Markdown>
</Container>
