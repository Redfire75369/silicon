<script lang="ts">
	import {metadata} from "$lib/markdown";
	import {navigation, routes} from "$lib/navigation";
	import type {Slug} from "$lib/markdown";
	import type {SlugMap} from "$lib/navigation";
	import Self from "./Section.svelte";

	interface Props {
		slugString: string,
		slugs: Slug[],
		map: SlugMap,
	}

	let {slugString, slugs, map}: Props = $props();

	interface EmptyEntry {
		type: "empty",
	}

	interface NestedEntry {
		type: "nested",
		navigation: string,
		href: string,
		value: SlugMap,
	}

	interface LinkEntry {
		type: "link",
		href: string,
		index?: string,
	}

	type Entry = EmptyEntry | NestedEntry | LinkEntry;

	let entries: Entry[] = [];
	for (const [key, value] of Object.entries(map)) {
		if (typeof value === "string") {
			entries.push({type: "empty"});
		} else if (typeof value.index !== "string") {
			const href = `${slugString}/${key}/`.replace("//", "/");
			entries.push({
				type: "nested",
				navigation: metadata[href]?.navigation ?? navigation[href] ?? `Unknown: ${href} ${key}`,
				href,
				value,
			});
		} else {
			let href = `${slugString}/${key}/`.replaceAll("//", "/");

			for (const route of routes) {
				const matches = route.pathRegex.exec(href);
				if (matches !== null) {
					href = route.path(matches).replaceAll("//", "/");
					break;
				}
			}

			entries.push({
				type: "link",
				href,
				index: value.index,
			});
		}
	}
</script>

<ul>
	{#each entries as entry}
		{#if entry.type === "nested"}
			<li>
				{entry.navigation}
				<Self slugString={entry.href} slugs={slugs} map={entry.value}/>
			</li>
		{:else if entry.type === "link"}
			<li>
				<a data-sveltekit-reload href={entry.href}>{entry.index}</a>
			</li>
		{/if}
	{/each}
</ul>
