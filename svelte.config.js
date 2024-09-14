import adapter from "@sveltejs/adapter-static";
import {mdsvex} from "mdsvex";
import relativeImages from "mdsvex-relative-images";
import remarkGfm from "remark-gfm";
import remarkGridTables from "remark-grid-tables";
import remarkToc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug-custom-id";
import {sveltePreprocess} from "svelte-preprocess";

/** @type {import("mdsvex").MdsvexOptions} */
const mdsvexConfig = {
	remarkPlugins: [
		relativeImages,
		remarkGfm,
		remarkGridTables,
		[remarkToc, {
			heading: "contents"
		}],
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
		sveltePreprocess(),
	],
	kit: {
		adapter: adapter({
			pages: "build"
		}),
		alias: {
			"components": "src/components",
			"content": "src/content",
		},
	},
};

export default config;
