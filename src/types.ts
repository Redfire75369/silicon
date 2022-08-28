import {Alignment, Borders, CellValue, Fill, WorksheetProperties, WorksheetView} from "exceljs";

export interface Range {
	top: number,
	left: number,
	bottom: number,
	right: number,
}

export interface Style {
	numFmt: string,
	alignment: Partial<Alignment>,
	border: Partial<Borders>,
	fill: Fill,
}

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
	merges: {
		[cell: string]: Range
	},
	properties: WorksheetProperties,
	views: Partial<WorksheetView>[],
}
