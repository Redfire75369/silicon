import {Workbook} from "exceljs";
import {readFileSync} from "fs";
import {join} from "path";
import JSON5 from "json5";

export async function getWorkbook(path: string): Promise<Workbook> {
	const workbook = new Workbook();
	return await workbook.xlsx.readFile(join(process.cwd(), "content", path));
}

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: {
		[key: string]: WorksheetMetadata
	},
};

const metadata = readFileSync(join(process.cwd(), "content", "spreadsheets", "metadata.json5"), {encoding: "utf-8"});
export const workbook_metadata: { [key: string]: WorkbookMetadata } = JSON5.parse(metadata);
