import {error} from "@sveltejs/kit";

import {metadata} from "$lib/spreadsheet/workbook";
import type {Worksheet} from "$lib/spreadsheet/workbook";
import {getWorksheet, workbooks} from "$lib/spreadsheet/workbook.server";
import type {PageServerLoadEvent} from "./$types";

/** @type {import("./$types").PageServerLoad} */
export async function load({params}: PageServerLoadEvent) {
	if (!(params.workbook in workbooks)) {
		error(404, "Invalid Spreadsheet");
	}
	const meta = metadata[params.workbook];

	const worksheets: Worksheet[] = await Promise.all(
		Object.keys(meta.sheets).map(key => getWorksheet(params.workbook, key, meta.sheets[key]))
	);

	return {
		meta,
		worksheets,
	};
}
