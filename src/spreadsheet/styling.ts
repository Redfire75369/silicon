import {Border, Borders, BorderStyle} from "exceljs";

import excelColour from "./excel-colour";
import {Worksheet} from "../types";

export type Merge = {
	primary: boolean,
	colspan: number,
	rowspan: number,
};

export type Merges = Merge[][];

export type CellBorder = {
	width: number,
	colour: string,
};

export type CellBorders = {
	top?: CellBorder,
	left?: CellBorder,
	bottom?: CellBorder,
	right?: CellBorder,
};

export function getMerges(worksheet: Worksheet): Merges {
	const merges: Merges = [];
	for (const address in worksheet.merges) {
		const merge = worksheet.merges[address];
		const [col, row] = [merge.left - 1, merge.top - 1];

		const [colspan, rowspan] = [merge.right - merge.left + 1, merge.bottom - merge.top + 1];

		for (let r = row; r < row + rowspan; r++) {
			if (merges[r] === undefined) {
				merges[r] = [];
			}

			for (let c = col; c < col + colspan; c++) {
				const primary = c === col && r === row;
				merges[r][c] = {primary, colspan, rowspan};
			}
		}
	}
	return merges;
}

function borderWidth(style: BorderStyle | undefined): number {
	switch (style) {
		case "thin":
			return 1;
		case "medium":
			return 2;
		case "thick":
			return 3;
		default:
			return 0;
	}
}

function borderFromCellBorder(border: Partial<Border>): CellBorder {
	return {
		width: borderWidth(border.style),
		colour: excelColour(border.color)?.toRgbString() || "",
	};
}

export function getBorder(cellBorder: Partial<Borders>): CellBorders {
	const border: CellBorders = {};
	if (cellBorder.top) {
		border.top = borderFromCellBorder(cellBorder.top);
	}
	if (cellBorder.left) {
		border.left = borderFromCellBorder(cellBorder.left);
	}
	if (cellBorder.bottom) {
		border.bottom = borderFromCellBorder(cellBorder.bottom);
	}
	if (cellBorder.right) {
		border.right = borderFromCellBorder(cellBorder.right);
	}
	return border;
}
