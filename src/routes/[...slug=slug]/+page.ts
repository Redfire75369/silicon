import {error} from "@sveltejs/kit";
import type {MDSveX} from "$lib/markdown";
import {metadata} from "$lib/markdown";
import {routes} from "$lib/navigation";

import type {PageLoadEvent} from "./$types";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	let slug = `/${params.slug}`;
	for (const route of routes) {
		const matches = route.slugRegex.exec(slug);
		if (matches !== null) {
			slug = route.slug(matches);
			break;
		}
	}

	const content = import.meta.glob<MDSveX>("../../content/**/*.svx");

	let mdsvex: MDSveX;
	if (content[`../../content${slug.slice(0, -1)}.svx`]) {
		mdsvex = await content[`../../content${slug.slice(0, -1)}.svx`]();
	} else if (content[`../../content${slug}index.svx`]) {
		mdsvex = await content[`../../content${slug}index.svx`]();
	} else {
		throw error(404, "Page Not Found");
	}

	const body = mdsvex.default;

	if (body === undefined) {
		throw error(404, "Failed to Parse MDSveX");
	}

	return {
		slug,
		body,
		metadata: metadata[slug],
	};
}
