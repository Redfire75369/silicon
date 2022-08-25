import {Workbook} from "exceljs";
import {join} from "path";

export async function getWorkbook(path: string): Promise<Workbook> {
	const workbook = new Workbook();
	return await workbook.xlsx.readFile(join(process.cwd(), "content", path));
}

export type WorksheetMetadata = [name: string, width: number, height: number];

export type WorkbookMetadata = {
	name: string,
	sheets: {
		[key: string]: WorksheetMetadata
	},
};

export const workbook_metadata: { [key: string]: WorkbookMetadata } = {
	cpus: {
		name: "CPUs",
		sheets: {
			desktop: ["Desktop", 18, 52],
			mobile: ["Mobile", 18, 68],
			"hedt-workstation": ["HEDT & Workstation", 18, 26],
			server: ["Server", 19, 151],
			legend: ["Legend", 9, 32],
		}
	},
	gpus: {
		name: "GPUs",
		sheets: {
			desktop: ["Desktop", 21, 27],
			mobile: ["Mobile", 20, 30],
			workstation: ["Workstation", 22, 32],
			server: ["Server", 33, 18],
			legend: ["Legend", 7, 16],
		},
	},
	"capital-expenditure": {
		name: "Capital Expenditure",
		sheets: {
			annual: ["Annual", 7, 54],
			quarterly: ["Quarterly", 20, 52],
			planned: ["Planned", 11, 110],
			completed: ["Completed", 12, 5],
		},
	},
};
