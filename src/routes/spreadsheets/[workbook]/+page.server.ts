import {error} from "@sveltejs/kit";

import {getWorksheet, metadata, workbookKeys, workbooks} from "$lib/spreadsheet/workbook";

import type {PageServerLoadEvent} from "./$types";
import type {Worksheet} from "$lib/spreadsheet/types";

/** @type {import("./$types").PageServerLoad} */
export async function load({params}: PageServerLoadEvent) {
	if (!workbookKeys.includes(params.workbook)) {
		throw error(404, "Invalid Spreadsheet");
	}
	const workbook = workbooks[params.workbook];
	const meta = metadata[params.workbook];

	const worksheets: Worksheet[] = await Promise.all(
		Object.keys(meta.sheets).map(key => getWorksheet(params.workbook, workbook, key, meta.sheets[key]))
	);

	return {
		keys: Object.keys(meta.sheets),
		names: Object.values(meta.sheets).map(meta => meta[0]),
		worksheets: worksheets
	};
}
