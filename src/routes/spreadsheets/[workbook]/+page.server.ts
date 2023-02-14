import {error} from "@sveltejs/kit";

import {getWorksheet, metadata, workbookKeys, workbooks} from "$lib/spreadsheet/workbook";

import type {PageServerLoadEvent} from "./$types";

/** @type {import("./$types").PageServerLoad} */
export async function load({params}: PageServerLoadEvent) {
	if (!workbookKeys.includes(params.workbook)) {
		throw error(404, "Invalid Spreadsheet");
	}
	const workbook = workbooks[params.workbook];
	const meta = metadata[params.workbook];

	const worksheets = Object.values(meta.sheets).map(m => getWorksheet(workbook, m));

	return {
		keys: Object.keys(meta.sheets),
		names: Object.values(meta.sheets).map(meta => meta[0]),
		worksheets: worksheets
	};
}
