import JSON5 from "json5";
import {readFile} from "fs/promises";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";

import type {WorkbookMetadata} from "../../src/lib/spreadsheet/workbook";

export const dir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const metadata: Record<string, WorkbookMetadata> = JSON5.parse(
	await readFile(resolve(dir, "src", "content", "spreadsheets", "metadata.json5"), {encoding: "utf8"})
);

export default metadata;
