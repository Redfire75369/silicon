import {error} from "@sveltejs/kit";
import {getMetadata, getSlugs} from "$lib/markdown";
import type {MDSveX} from "$lib/markdown";
import type {PageLoadEvent} from "./$types";

export const trailingSlash = "always";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	const slugs = getSlugs();
	const slug = params.slug;
	const index = slugs.findIndex(s => s.slug === slug);

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

	const metadata = getMetadata(slugs[index]);

	return {
		slug,
		body,
		metadata,
	};
}
