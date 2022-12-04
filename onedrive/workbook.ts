import JSON5 from "json5";
import {readFile} from "fs/promises";
import {resolve, dirname} from "path";
import {fileURLToPath} from "url";

import type {WorkbookMetadata} from "../src/spreadsheet/workbook";

export const dir = dirname(fileURLToPath(import.meta.url));

const metadata: { [key: string]: WorkbookMetadata } = JSON5.parse(
	await readFile(resolve(dir, "..", "content", "spreadsheets", "metadata.json5"), {encoding: "utf8"})
);

export default metadata;
