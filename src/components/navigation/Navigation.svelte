<script lang="ts">
	import {metadata, slugs} from "$lib/markdown";
	import {orders} from "$lib/navigation";
	import type {Slug} from "$lib/markdown";
	import type {SlugMap} from "$lib/navigation";
	import Section from "components/navigation/Section.svelte";

	export let currentSlug: string;
	export let navigationSlugs: Slug[];

	const slug = slugs.find(slug => slug.slug === currentSlug);
	const existing = slug.slug.split("/").length;
	for (const [name, order] of Object.entries(orders)) {
		if (slug.slug === name) {
			navigationSlugs = navigationSlugs.sort((a, b) => {
				const path1 = a.slug.split("/").slice(existing - 1).join("/");
				const path2 = b.slug.split("/").slice(existing - 1).join("/");

				const index1 = order.findIndex((p) => path1.startsWith(p));
				const index2 = order.findIndex((p) => path2.startsWith(p));
				if (index1 === -1 || index2 === -1) {
					return 0;
				}
				return index1 - index2;
			});
			break;
		}
	}

	const map: SlugMap = {}
	for (const slug of navigationSlugs) {
		const segments = slug.slug.split("/").slice(existing - 1).filter(s => s !== "");
		let m = map;
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (typeof map[segment] === "undefined") {
				m[segment] = {};
			}
			m = m[segment];
		}

		m.index = metadata[slug.slug].navigation ?? metadata[slug.slug].title;
	}
</script>

<Section slugString={currentSlug} navigationSlugs={navigationSlugs} map={map}/>
