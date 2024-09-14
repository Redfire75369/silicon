import svg from "@poppanator/sveltekit-svg";
import {enhancedImages} from '@sveltejs/enhanced-img';
import {sveltekit} from "@sveltejs/kit/vite";
import type {UserConfig} from "vite";
import json5 from "vite-plugin-json5";

const config: UserConfig = {
	plugins: [
		sveltekit(),
		enhancedImages(),
		svg(),
		json5(),
	],
	build: {
		target: "firefox128",
	},
};

export default config;
