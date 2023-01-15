import {error} from "@sveltejs/kit";

export interface Slug {
	slug: string,
	path: string,
}

export interface Metadata {
	author: string,
	title: string,

	index?: boolean,
	navigation?: string,

	icon?: string,
	description?: string,
	tags?: string[],
}

export interface MDSveX {
	default: any,
	metadata: Metadata,
}

export function getSlugs(): Slug[] {
	const content = import.meta.glob("../content/**/*.svx");

	return Object.keys(content).map((path) => {
		return {
			slug: path.slice(11).replace("/index.svx", "/").replace(".svx", "/"),
			path,
		};
	});
}

export async function getMetadata(slug: Slug): Promise<Metadata> {
	const content = import.meta.glob<MDSveX>("../content/**/*.svx");
	if (content[slug.path] !== undefined) {
		const metadata = (await content[slug.path]()).metadata;
		if (metadata.author && typeof metadata.author !== "string") {
			throw error(406, "Invalid Author");
		} else if (metadata.title && typeof metadata.title !== "string") {
			throw error(406, "Invalid Title");
		}
		// @ts-ignore
		return metadata;
	}
	throw error(404, "Metadata Not Found");
}
