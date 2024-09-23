import svg from "@poppanator/sveltekit-svg";
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import json5 from "vite-plugin-json5";
import wasm from "vite-plugin-wasm";
import wasmPack from "vite-plugin-wasm-pack";

const config: UserConfig = {
	plugins: [
		sveltekit(),
		enhancedImages(),
		json5(),
		svg(),
		wasm(),
		wasmPack("./parser"),
	],
	build: {
		target: "firefox128",
	},
};

export default config;
