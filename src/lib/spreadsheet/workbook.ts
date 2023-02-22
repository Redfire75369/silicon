// @ts-ignore
import meta from "content/spreadsheets/metadata.json5";

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: Record<string, WorksheetMetadata>,
	path: string,
};

export const metadata: Record<string, WorkbookMetadata> = meta;

export const workbookKeys = Object.keys(metadata);

