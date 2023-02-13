/** @type import("@sveltejs/kit").ParamMatcher */
export function match(parameter: string) {
	return !parameter.includes(".");
}
