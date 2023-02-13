import {error} from "@sveltejs/kit";
import {metadata} from "$lib/markdown";
import type {MDSveX} from "$lib/markdown";
import type {PageLoadEvent} from "./$types";
import {routes} from "$lib/navigation";

export const trailingSlash = "always";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	let slug = params.slug;
	for (const route of routes) {
		const matches = route.slugRegex.exec(slug);
		if (matches !== null) {
			slug = route.slug(matches);
			break;
		}
	}

	let mdsvex: MDSveX;

	const matches = import.meta.glob<MDSveX>("../../content/**/*.svx");
	if (matches[`../../content/${slug.slice(0, -1)}.svx`]) {
		mdsvex = await matches[`../../content/${slug.slice(0, -1)}.svx`]();
	} else if (matches[`../../content/${slug}index.svx`]) {
		mdsvex = await matches[`../../content/${slug}index.svx`]();
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
