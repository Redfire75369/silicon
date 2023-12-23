import {error} from "@sveltejs/kit";
import type {PageServerLoadEvent} from "./$types";
import {metadata} from "$lib/diagram/diagram";
import saveDiagram from "$lib/diagram/svg";


/** @type {import("./$types").PageServerLoad} */
export async function load({params}: PageServerLoadEvent) {
	if (!(params.diagramType in metadata)) {
		error(404, "Invalid Diagram");
	}

	const meta = metadata[params.diagramType];
	if (!(params.diagram in meta.variants)) {
		error(404, "Invalid Diagram");
	}

	await saveDiagram(params.diagramType, params.diagram);
	await new Promise(res => setTimeout(res, 3000));
}
