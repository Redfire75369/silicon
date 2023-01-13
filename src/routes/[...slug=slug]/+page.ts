import type {PageLoadEvent} from "./$types";
import {error} from "@sveltejs/kit";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	interface Metadata {
		title: string,
	}

	try {
		const slug = params.slug;
		const mdsvex = await import(`../../content/${slug}.svx`);

		const metadata = mdsvex.metadata;
		const body = mdsvex.default;

		if (body !== undefined) {
			throw error(404, "Failed to Parse MDSveX");
		}

		return {
			slug,
			body,
			metadata: {
				title: metadata.title,
			} satisfies Metadata,
		};
	} catch (e: any) {
		if (typeof e.status === "number") {
			throw error(e.status, e.body);
		} else {
			throw error(404, "Not Found");
		}

	}
}