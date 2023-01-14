import {error} from "@sveltejs/kit";
import type {PageLoadEvent} from "./$types";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	interface Metadata {
		title: string,
	}

	const slug = params.slug;
	let mdsvex;

	try {
		try {
			mdsvex = await import(`../../content/${slug}.svx`);
		} catch {
			mdsvex = await import(`../../content/${slug}/index.svx`);
		}
	} catch {
		throw error(404, "Not Found");
	}
	console.log(slug);


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
