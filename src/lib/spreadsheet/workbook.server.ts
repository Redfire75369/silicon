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
	const worksheet = workbook.get_worksheet(metadata[0]);

	if (worksheet === undefined) {
		throw new Error(`Worksheet ${metadata[0]} not found in workbook`);
	}

	const rows = worksheet.rows.map(r => ({
		cells: r.cells.map(cell => {
			const value = isNaN(parseFloat(cell.value)) ? cell.value : parseFloat(cell.value);

			return {
				value: SSF.format(cell.format, value),

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

	const csv = workbook.get_csv(metadata[0]);
	await writeFile(csvFile, csv);

	return {
		name: worksheet.name,

		rows,
		column_widths: [...worksheet.column_widths],
		row_heights: [...worksheet.row_heights],

		pane: worksheet.pane ? {
			horizontal_split: worksheet.pane.horizontal_split,
			vertical_split: worksheet.pane.vertical_split,
		} : undefined,
	};
}
