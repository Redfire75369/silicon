import svg from "@poppanator/sveltekit-svg";
import {sveltekit} from "@sveltejs/kit/vite";
import type {UserConfig} from "vite";
import {json5Plugin as json5} from "vite-plugin-json5";

const config: UserConfig = {
	plugins: [
		sveltekit(),
		svg(),
		json5(),
	],
	build: {
		target: "firefox115",
	},
};

export default config;
