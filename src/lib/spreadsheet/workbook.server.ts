import { resolve } from "path";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import SSF from "ssf";

import { contentDir } from "$lib/directory.server";
import { metadataKeys, type Worksheet, type WorksheetMetadata } from "$lib/spreadsheet/workbook";
import { Workbook } from "parser/parser";

export const workbooks: Record<string, Workbook> = Object.fromEntries(
	await Promise.all(metadataKeys.map(async key => {
		const bytes = await readFile(resolve(contentDir, "spreadsheets", `${key}.xlsx`));
		return [key, new Workbook(bytes)];
	}))
);

export async function getWorksheet(workbook_key: keyof typeof workbooks, key: string, metadata: WorksheetMetadata): Promise<Worksheet> {
	const workbook = workbooks[workbook_key];
	const worksheet = workbook.get_worksheet(metadata.name);

	if (worksheet === undefined) {
		throw new Error(`Worksheet ${metadata.name} not found in workbook`);
	}

	const rows = worksheet.rows.slice(0, metadata.height).map(r => ({
		cells: r.cells.slice(0, metadata.width).map(cell => {
			const value = (cell.value === "" || isNaN(Number(cell.value))) ? cell.value : Number(cell.value);

			return {
				value: SSF.format(cell.format, value),
				hyperlink: cell.hyperlink,

				merge: {
					primary: cell.merge.primary,
					column_span: cell.merge.column_span,
					row_span: cell.merge.row_span,
				},
				style: cell.style,
			}
		}),
	}));

	const folder = resolve(contentDir, "spreadsheets", "generated", workbook_key);
	const csvFile = resolve(folder, `${key}.csv`);

	console.info(`[CSV]: Writing to ${csvFile}`);
	if (!existsSync(folder)) {
		await mkdir(folder, { recursive: true });
	}

	const csv = workbook.get_csv(metadata.name);
	await writeFile(csvFile, csv);

	return {
		name: worksheet.name,

		rows,
		column_widths: [...worksheet.column_widths].slice(0, metadata.width),
		row_heights: [...worksheet.row_heights].slice(0, metadata.height),

		pane: worksheet.pane ? {
			horizontal_split: worksheet.pane.horizontal_split,
			vertical_split: worksheet.pane.vertical_split,
		} : undefined,
	};
}
