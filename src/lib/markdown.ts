import {error} from "@sveltejs/kit";

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

export class Slug {
    constructor(public slug: string, public path: string) {
        if (!slug.startsWith("/") || !slug.endsWith("/")) {
            throw new Error("Invalid Slug");
        }
    }

    segments(existing: number = 0): string[] {
        return this.slug.split("/").slice(existing + 1, -1);
    }
}

export function getSlugs(): Slug[] {
    const content = import.meta.glob("../content/**/*.svx");

    return Object.keys(content).map((path) => {
        return new Slug(
            path.slice(10).replace("/index.svx", "/").replace(".svx", "/"),
            path,
        );
    });
}

async function getMetadata(slug: Slug): Promise<Metadata> {
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

export const slugs = getSlugs();
export const metadata: Record<string, Metadata> = {};

for (const slug of slugs) {
    metadata[slug.slug] = await getMetadata(slug);
}
