import {error} from "@sveltejs/kit";
import type {PageLoadEvent} from "./$types";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	interface Metadata {
		author: string,
		title: string,

		index?: boolean,
		navigation?: string,

		icon?: string,
		description?: string,
		tags?: string[],
	}

	interface MDSveX {
		default: any,
		metadata: Metadata,
	}

	const slug = params.slug;
	let mdsvex: MDSveX;

	const matches = import.meta.glob<MDSveX>(`../../content/**/*.svx`);
	if (matches[`../../content/${slug}.svx`]) {
		mdsvex = await matches[`../../content/${slug}.svx`]();
	} else if (matches[`../../content/${slug}/index.svx`]) {
		mdsvex = await matches[`../../content/${slug}/index.svx`]();
	} else {
		throw error(404, "Page Not Found");
	}

	const body = mdsvex.default;
	const metadata = mdsvex.metadata;

	if (body === undefined) {
		throw error(404, "Failed to Parse MDSveX");
	}

	if (metadata.author === undefined) {
		throw error(406, "Author Not Provided");
	} else if (metadata.title === undefined) {
		throw error(406, "Title Not Provided");
	}

	return {
		slug,
		body,
		metadata,
	};
}
