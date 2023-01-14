import adapter from "@sveltejs/adapter-static";
import {vitePreprocess} from "@sveltejs/kit/vite";
import {mdsvex} from "mdsvex";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	extensions: [".svelte", ".svx"],
	preprocess: [
		mdsvex(),
		vitePreprocess(),
	],
	kit: {
		adapter: adapter({
			pages: "build"
		}),
		alias: {
			"components": "src/components",
			"content": "src/content",
		}
	},
	onwarn: (warning, handler) => {
		const {code} = warning;
		if (code === "css-unused-selector") {
			return;
		}

		handler(warning);
	},
};

export default config;
