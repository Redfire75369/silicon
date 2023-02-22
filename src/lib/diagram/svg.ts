// @ts-ignore
import {exportDiagram} from "drawio-export-puppeteer";
import {existsSync} from "fs";
import {mkdir, readFile, writeFile} from "fs/promises";
import {resolve} from "path";

import {metadata} from "$lib/diagram/diagram";
import {contentDir} from "$lib/directory.server";

interface Saves {
	[key: string]: {
		save: (key: string, variant: Variant) => void;
	}
}

const saves: Saves = {
	mesh: {
		save: async function (key, variant) {
			const {codename, start, dies} = variant;

			const graph = await readFile(resolve(contentDir, "diagrams", `${key}.drawio`), {encoding: "utf8"});
			const diagrams: string[] = await Promise.all(dies.map(function(_, index) {
				return exportDiagram(graph, start + index, "svg");
			}));

			const folder = resolve(contentDir, "diagrams", "generated", "mesh");
			if (!existsSync(folder)) {
				await mkdir(folder, {recursive: true});
			}

			await Promise.all(diagrams.map((diagram, index) => {
				const path = resolve(folder, `${codename}-${dies[index]}.svg`);
				console.info(`[SVG]: Writing to ${path}`);
				return writeFile(path, diagram, {encoding: "utf8", flag: "w"});
			}));
		}
	}
}

export default async function saveDiagram(key: keyof typeof metadata, variant: string) {
	const diagram = metadata[key];
	return saves[key].save(key, diagram.variants[variant]);
}


