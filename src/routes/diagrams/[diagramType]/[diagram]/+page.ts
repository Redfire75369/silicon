import {error} from "@sveltejs/kit";

import type {PageLoadEvent} from "./$types";
import {metadata} from "$lib/diagram/diagram";

/** @type {import("./$types").PageLoad} */
export async function load({params}: PageLoadEvent) {
	if (!Object.keys(metadata).includes(params.diagramType)) {
		throw error(404, "Invalid Diagram");
	}

	const meta = metadata[params.diagramType];
	if (!Object.keys(meta.variants).includes(params.diagram)) {
		throw error(404, "Invalid Diagram");
	}

	const variant = meta.variants[params.diagram];

	const diagrams = (await Promise.all(variant.dies.map(die => `${variant.codename}-${die}`).map(path => {
		return import(`../../../../content/diagrams/generated/${params.diagramType}/${path}.svg?component`);
	}))).map(d => d.default);

	return {
		variant,
		diagrams,
	};
}
