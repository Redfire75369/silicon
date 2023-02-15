import ExcelJS from "exceljs";
import type {CsvWriteOptions, Workbook} from "exceljs";
import {existsSync} from "fs";
import {readFile, mkdir} from "fs/promises";
import JSON5 from "json5";
import {resolve} from "path";

import {contentDir} from "$lib/directory.server";
import type {Cell, Column, Range, Row} from "$lib/spreadsheet/types";

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: Record<string, WorksheetMetadata>,
	path: string,
};


export const metadata: Record<string, WorkbookMetadata> = JSON5.parse(
	await readFile(resolve(contentDir, "spreadsheets", "metadata.json5"), {encoding: "utf8"})
);

async function getWorkbook(key: string): Promise<Workbook> {
	const workbook = new ExcelJS.Workbook();
	return await workbook.xlsx.readFile(resolve(contentDir, "spreadsheets", `${key}.xlsx`));
}

export const workbookKeys = Object.keys(metadata);

export const workbooks: Record<string, Workbook> = Object.fromEntries((await Promise.all(workbookKeys.map(key => {
	return getWorkbook(key);
}))).map((v, i) => [workbookKeys[i], v]));

export async function getWorksheet(workbook_key: string, workbook: Workbook, key: string, metadata: WorksheetMetadata) {
	const worksheet = workbook.getWorksheet(metadata[0]);

	// @ts-ignore
	const rows: Row[] = Array.from(worksheet._rows.slice(0, metadata[2]), (row: Row | undefined, r) => {
		let cells: Cell[] = [];
		if (row) {
			// @ts-ignore
			cells = Array.from(row._cells.slice(0, metadata[1]), (cell: Cell | undefined, c) => {
				if (cell) {
					return {
						address: cell.address,
						value: cell.value,
						style: {...cell.style},
					};
				} else {
					return {
						address: `${String.fromCharCode(65 + c)}${r + 1}`,
						value: null,
						style: {},
					};
				}
			});
		}
		for (let c = cells.length; c < metadata[1]; c++) {
			cells[c] = {
				address: `${String.fromCharCode(65 + c)}${r}`,
				value: null,
				style: {},
			};
		}

		return {
			number: r + 1,
			height: row?.height || 15,
			cells,
		};
	});

	const columns: Column[] = Array.from(worksheet.columns.slice(0, metadata[1]), (column, index) => {
		return {
			number: index + 1,
			width: column?.width || worksheet.properties.defaultColWidth || 9,
			style: {...column?.style},
		}
	});

	const merges: Record<string, Range> = {};

	// @ts-ignore
	let keys = Object.keys(worksheet._merges);
	for (let i = 0; i < keys.length; i++) {
		// @ts-ignore
		let merge: Range = worksheet._merges[keys[i]].model;
		merges[keys[i]] = {
			top: merge.top,
			left: merge.left,
			bottom: merge.bottom,
			right: merge.right,
		};
	}

	const options: Partial<CsvWriteOptions> = {
		includeEmptyRows: true,
		sheetName: metadata[0],
	};

	const folder = resolve(contentDir, "spreadsheets", "generated", workbook_key);
	const csv = resolve(folder, `${key}.csv`);

	console.info(`[CSV]: Writing to ${csv}`);
	if (!existsSync(folder)) {
		await mkdir(folder, {recursive: true});
	}

	await workbook.csv.writeFile(csv, options);

	return {
		name: worksheet.name,
		state: worksheet.state,
		rows,
		columns,
		merges,
		properties: {...worksheet.properties},
		views: [...worksheet.views]
	};
}
