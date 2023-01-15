<script lang="ts">
	import {metadata, slugs} from "$lib/markdown";
	import {navigation, routes} from "$lib/navigation";
	import type {Slug} from "$lib/markdown";
	import type {SlugMap} from "$lib/navigation";

	export let slugString: string;
	export let navigationSlugs: Slug[];
	export let map: SlugMap;

	let entries = [];
	for (const [key, value] of Object.entries(map)) {
		if (typeof value === "string") {
			entries.push({type: "empty"});
		} else if (typeof value.index !== "string") {
			const href = `${slugString}/${key}/`.replace("//", "/");
			const innerSlug = navigationSlugs.find(slug => href === slugString);
			entries.push({
				type: "nested",
				navigation: metadata[href]?.navigation ?? navigation[href] ?? `Unknown: ${innerSlug} ${key}`,
				href,
				value,
			});
		} else {
			let href = `${slugString}/${key}`.replace("//", "/");

			for (const route of routes) {
				const matches = route.regex.exec(href);
				if (matches !== null) {
					href = route.path(matches);
					break;
				}
			}
			entries.push({
				type: "link",
				href,
				index: value.index
			});
		}
	}
</script>

<ul>
	{#each entries as entry}
		{#if entry.type === "empty"}
			<li></li>
		{:else if entry.type === "nested"}
			<li>
				{entry.navigation}
				<svelte:self slugString={entry.href} slugs={navigationSlugs} map={entry.value}/>
			</li>
		{:else}
			<li>
				<a href={`/${entry.href}`}>{entry.index}</a>
			</li>
		{/if}
	{/each}
</ul>
