import {Workbook} from "exceljs";
import {readFileSync} from "fs";
import {resolve} from "path";
import JSON5 from "json5";

import {contentDir} from "../constants";

export async function getWorkbook(path: string): Promise<Workbook> {
	const workbook = new Workbook();
	return await workbook.xlsx.readFile(resolve(contentDir, path));
}

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: {
		[key: string]: WorksheetMetadata
	},
	path: string,
};

export const metadata: { [key: string]: WorkbookMetadata } = JSON5.parse(
	readFileSync(resolve(contentDir, "spreadsheets", "metadata.json5"), {encoding: "utf8"})
);
