import {error} from "@sveltejs/kit";

import {metadata} from "$lib/spreadsheet/workbook";
import type {Worksheet} from "$lib/spreadsheet/types";
import {getWorksheet, workbooks} from "$lib/spreadsheet/workbook.server";
import type {PageServerLoadEvent} from "./$types";

/** @type {import("./$types").PageServerLoad} */
export async function load({params}: PageServerLoadEvent) {
	if (!(params.workbook in workbooks)) {
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
