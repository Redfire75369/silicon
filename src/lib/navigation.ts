export type SlugMap = {
	index?: string,
} & {
	[key: string]: SlugMap
};

export const navigation = {
	"earnings/intel/2021/": "2021",
	"earnings/tsmc/2021/": "2021",
	"events/amd/": "AMD",
	"events/intel/": "Intel",
	"events/hot-chips/": "Hot Chips",
	"events/hot-chips/33/google/": "Google",
	"events/vlsi/": "Symposium on VLSI Technology and Circuits",
	"events/vlsi/2023/": "VLSI Symposium 2023",
};

export const orders = {
	"/": ["diagrams", "earnings", "events", "spreadsheets"],
	"/events/": ["hot-chips", "vlsi", "amd", "intel"],
};

export const routes = [
	{
		pathRegex: /^\/?earnings\/([\w-]*)\/(\d{4})\/quarter-(\d)\/?$/,
		path(matches: RegExpExecArray) {
			return `/earnings/${matches[1]}/q${matches[3]}-${matches[2]}/`;
		},

		slugRegex: /^earnings\/([\w-]*)\/q(\d)-(\d{4})\/?$/,
		slug(matches: RegExpExecArray) {
			return `earnings/${matches[1]}/${matches[3]}/quarter-${matches[2]}/`;
		}
	}
];
