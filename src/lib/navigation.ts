export type IndexSlugMap = {
	index: string,
	[key: string]: string | SlugMap,
};

export type RegularSlugMap = {
	[key: string]: SlugMap,
}

export type SlugMap = IndexSlugMap | RegularSlugMap;

export const navigation: Record<string, string> = {
	"/earnings/intel/2021/": "2021",
	"/earnings/tsmc/2021/": "2021",
	"/events/amd/": "AMD",
	"/events/intel/": "Intel",
	"/events/hot-chips/": "Hot Chips",
	"/events/hot-chips/33/google/": "Google",
	"/events/vlsi/": "Symposium on VLSI Technology and Circuits",
	"/events/vlsi/2023/": "VLSI Symposium 2023",
};

export const orders: Record<string, string[]> = {
	"/": ["diagrams", "earnings", "events", "spreadsheets"],
	"/events/": ["hot-chips", "vlsi", "amd", "intel"],
};

export interface Route {
	pathRegex: RegExp,
	path(matches: RegExpExecArray): string,
	slugRegex: RegExp,
	slug(matches: RegExpExecArray): string,
}

export const routes: Route[] = [
	{
		pathRegex: /^\/earnings\/([\w-]*)\/(\d{4})\/quarter-(\d)\/$/,
		path(matches: RegExpExecArray) {
			return `/earnings/${matches[1]}/q${matches[3]}-${matches[2]}/`;
		},

		slugRegex: /^\/earnings\/([\w-]*)\/q(\d)-(\d{4})\/$/,
		slug(matches: RegExpExecArray) {
			return `/earnings/${matches[1]}/${matches[3]}/quarter-${matches[2]}/`;
		}
	}
];
