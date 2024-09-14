<script lang="ts">
	import Container from "components/Container.svelte";
	import Header from "components/header/Header.svelte";
	import Markdown from "components/Markdown.svelte";
	import Meta from "components/Meta.svelte";
	import Navigation from "components/navigation/Navigation.svelte";

	import type {PageData} from "./$types";

	export let data: PageData;

	const {slug, body, metadata} = data;
	const {title, author, icon, description, tags, index} = metadata;
	const type = index ? "website" : "article";
</script>

<Meta {title} {author} {type} {icon} {description} {tags} slug={slug.slice(1)}/>

<Container>
	<Header>{title}</Header>
	<Markdown>
		<svelte:component this={body}/>
		{#if index}
			<Navigation current={slug}/>
		{/if}
	</Markdown>
</Container>
