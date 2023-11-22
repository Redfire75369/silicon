import {resolve} from "path";

import {ROOT_DIRECTORY} from "$env/static/private";

export const rootDir = ROOT_DIRECTORY;
export const cacheDir = resolve(rootDir, ".svelte-kit", ".silicon-cache");
export const srcDir = resolve(rootDir, "src");
export const contentDir = resolve(srcDir, "content");
