import adapter from "@sveltejs/adapter-static";
import {mdsvex} from "mdsvex";
import remarkGfm from "remark-gfm";
import remarkGridTables from "remark-grid-tables";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug-custom-id";
import preprocess from "svelte-preprocess";

/** @type {import("mdsvex").MdsvexOptions} */
const mdsvexConfig = {
	remarkPlugins: [
		remarkGfm,
		remarkGridTables
	],
	rehypePlugins: [
		rehypeSlug,
		rehypeAutolinkHeadings,
	]
};

/** @type {import("@sveltejs/kit").Config} */
const config = {
	extensions: [".svelte", ".svx"],
	preprocess: [
		mdsvex(mdsvexConfig),
		preprocess(),
	],
	kit: {
		adapter: adapter({
			pages: "build"
		}),
		alias: {
			"components": "src/components",
			"content": "src/content",
		}
	}
};

export default config;
