import type {CellValue, Style, WorksheetProperties, WorksheetView} from "exceljs";

export interface Range {
	top: number,
	left: number,
	bottom: number,
	right: number,
}

export interface Merge {
	primary: boolean,
	colspan: number,
	rowspan: number,
};

export interface Cell {
	address: string,
	value: CellValue,
	style: Partial<Style>,
}

export interface Row {
	number: number,
	height: number,
	cells: Cell[],
}

export interface Column {
	number: number,
	width: number,
	style: Partial<Style>,
}

export interface Worksheet {
	name: string,
	state: string,
	rows: Row[],
	columns: Column[],
	merges: Record<string, Range>,
	properties: WorksheetProperties,
	views: Partial<WorksheetView>[],
}
