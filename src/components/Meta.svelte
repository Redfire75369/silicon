<script lang="ts">
	export let title: string;
	export let author: string;
	export let type: string | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let tags: string[] | undefined = undefined;
	export let slug: string | undefined = undefined;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title}/>
	<meta property="twitter:title" content={title}/>

	<meta name="author" content={author}/>
	<meta property="og:author" content={author}/>

	{#if type !== undefined}
		<meta property="og:type" content={type}/>
		{#if type === "article"}
			<meta property="article:section" content="Technology"/>
		{/if}
	{:else}
		<meta property="og:type" content="website"/>
	{/if}

	{#if icon !== undefined}
		<link rel="icon" href={icon}/>
	{:else}
		<link rel="icon" href="/favicon.ico"/>
	{/if}

	{#if description !== undefined}
		<meta property="description" content={description}/>
		<meta property="og:description" content={description}/>
		<meta property="twitter:description" content={description}/>
	{/if}

	{#if tags !== undefined}
		{#if tags.length !== 0}
			<meta name="keywords" content={tags.join(", ")}/>
		{/if}
		{#if type === "article"}
			{#each tags as tag}
				<meta property="article:tag" content={tag}/>
			{/each}
		{/if}
	{/if}

	{#if slug !== undefined}
		<meta property="og:url" content={`https://silicon.redfire.dev/${slug}`}/>
		<meta property="twitter:url" content={`https://silicon.redfire.dev/${slug}`}/>
	{/if}
</svelte:head>
