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
};

export const orders = {
	"/": ["diagrams", "earnings", "events", "spreadsheets"],
	"/events/": ["hot-chips", "amd", "intel"],
};

export const routes = [
	{
		regex: /^\/?earnings\/([\w-]*)\/(\d{4})\/quarter-(\d)\/?$/,

		path(matches: RegExpExecArray) {
			return `/earnings/${matches[1]}/q${matches[3]}-${matches[2]}`;
		}
	}
];
