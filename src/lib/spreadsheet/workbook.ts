import meta from "content/spreadsheets/metadata.json5";

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: Record<string, WorksheetMetadata>,
	path: string,
};

export const metadataKeys = Object.keys(meta);
export const metadata: Record<string, WorkbookMetadata> = meta;

export interface Cell {
	value: string,
	merge: {
		primary: boolean,
		column_span: number,
		row_span: number,
	}
	style: string,
}

export interface Row {
	cells: Cell[],
}

export interface Worksheet {
	name: string,

	rows: Row[],
	column_widths: number[],
	row_heights: number[],

	pane?: {
		horizontal_split: number,
		vertical_split: number,
	}
}
