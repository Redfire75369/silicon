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
			desktop: ["Desktop", 19, 25],
			mobile: ["Mobile", 19, 68],
			"hedt-workstation": ["HEDT & Workstation", 18, 23],
			server: ["Server", 19, 151],
			legend: ["Legend", 9, 33],
		}
	},
	gpus: {
		name: "GPUs",
		sheets: {
			desktop: ["Desktop", 21, 11],
			mobile: ["Mobile", 20, 30],
			workstation: ["Workstation", 22, 26],
			server: ["Server", 34, 15],
			legend: ["Legend", 7, 16],
		},
	},
	"capital-expenditure": {
		name: "Capital Expenditure",
		sheets: {
			annual: ["Annual", 8, 59],
			quarterly: ["Quarterly", 20, 52],
			planned: ["Planned", 11, 112],
			completed: ["Completed", 12, 6],
		},
	},
};
