import type {CsvWriteOptions, Workbook} from "exceljs";
import {resolve} from "path";
import {existsSync} from "fs";
import {mkdir} from "fs/promises";

import {contentDir} from "$lib/directory.server";
import {metadata} from "$lib/spreadsheet/workbook";
import type {WorksheetMetadata} from "$lib/spreadsheet/workbook";
import type {Cell, Column, Range, Row} from "$lib/spreadsheet/types";
import ExcelJS from "exceljs";

async function getWorkbook(key: string): Promise<Workbook> {
	const workbook = new ExcelJS.Workbook();
	return await workbook.xlsx.readFile(resolve(contentDir, "spreadsheets", `${key}.xlsx`));
}

export const workbooks: Record<string, Workbook> = Object.fromEntries(
	await Promise.all(Object.keys(metadata).map(async key => {
		const workbook = await getWorkbook(key);
		return [key, workbook];
	}))
);

export async function getWorksheet(workbook_key: string, workbook: Workbook, key: string, metadata: WorksheetMetadata) {
	const worksheet = workbook.getWorksheet(metadata[0]);

	if (worksheet === undefined) {
		throw new Error(`Worksheet ${metadata[0]} not found in workbook`);
	}

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
	for (const key in worksheet._merges) {
		// @ts-ignore
		let merge: Range = worksheet._merges[key].model;
		merges[key] = {
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
