import {Workbook} from "exceljs";

import {WorksheetMetadata} from "./workbook";
import {Cell, Column, Range, Row, Worksheet} from "../types";

export default function getWorksheet(workbook: Workbook, metadata: WorksheetMetadata): Worksheet {
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

	const merges: { [key: string]: Range } = {};

	// @ts-ignore
	let keys = Object.keys(worksheet._merges);
	for (let i = 0; i < keys.length; i++) {
		// @ts-ignore
		let merge = worksheet._merges[keys[i]];
		merges[keys[i]] = {
			top: merge.model.top,
			left: merge.model.left,
			bottom: merge.model.bottom,
			right: merge.model.right,
		};
	}

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
