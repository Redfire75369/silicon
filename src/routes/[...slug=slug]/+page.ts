import {error} from "@sveltejs/kit";
import type {PageLoadEvent} from "./$types";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	interface Metadata {
		title: string,
	}

	const slug = params.slug;
	let mdsvex;

	const matches = import.meta.glob(`../../content/**/*.svx`);
	if (matches[`../../content/${slug}.svx`]) {
		mdsvex = await matches[`../../content/${slug}.svx`]();
	} else if (matches[`../../content/${slug}/index.svx`]) {
		mdsvex = await matches[`../../content/${slug}/index.svx`]();
	} else {
		throw error(404, "Page Not Found");
	}

	const metadata: Metadata = mdsvex.metadata;
	const body = mdsvex.default;

	if (body === undefined) {
		throw error(404, "Failed to Parse MDSveX");
	}

	return {
		slug,
		body,
		metadata,
	};
}
