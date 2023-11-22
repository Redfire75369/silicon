<script lang="ts">
	import {metadata, slugs} from "$lib/markdown";
	import {orders} from "$lib/navigation";
	import type {SlugMap} from "$lib/navigation";
	import Section from "components/navigation/Section.svelte";

	export let current: string;

	let navigationSlugs = slugs.filter(slug => slug.slug.startsWith(current) && slug.slug !== current);

	const slug = slugs.find(slug => slug.slug === current);
    if (slug === undefined) {
        throw new Error("Invalid Slug");
	}

	const existing = slug.segments().length;
	for (const [name, order] of Object.entries(orders)) {
		if (slug.slug === name) {
			navigationSlugs = navigationSlugs.sort((a, b) => {
				const path1 = a.segments(existing).join("/");
				const path2 = b.segments(existing).join("/");

				const index1 = order.findIndex(p => path1.startsWith(p));
				const index2 = order.findIndex(p => path2.startsWith(p));
				if (index1 === -1 || index2 === -1) {
					return 0;
				}
				return index1 - index2;
			});
			break;
		}
	}

	const map: SlugMap = {};
	for (const slug of navigationSlugs) {
		const segments = slug.segments(existing);
		let m: SlugMap = map;
		for (const segment of segments) {
			if (typeof m[segment] === "undefined") {
				m[segment] = {};
			}
			// @ts-ignore
			m = m[segment];
		}
		m.index = metadata[slug.slug].navigation ?? metadata[slug.slug].title;
	}
</script>

<Section slugString={current} slugs={navigationSlugs} map={map}/>
