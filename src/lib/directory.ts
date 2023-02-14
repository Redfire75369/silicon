import {dirname, resolve} from "path";
import {fileURLToPath} from "url";

export const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const contentDir = resolve(srcDir, "content");
