import {exportDiagram} from "drawio-export-puppeteer";
import {existsSync} from "fs";
import {readFile, writeFile, mkdir} from "fs/promises";
import {resolve} from "path";

import diagrams from "./diagrams";
import {contentDir} from "../constants";

interface Saves {
	[key: string]: {
		save: (string, Variant) => Promise<string[]>,
	},
}

const saves: Saves = {
	mesh: {
		save: async function (file, variant) {
			const {codename, start, dies} = variant;
			const graph = await readFile(resolve(contentDir, file), {encoding: "utf8"});

			const diagrams: string[] = await Promise.all(dies.map(function(_, index) {
				return exportDiagram(graph, start + index, "svg");
			}));
			const folder = resolve(contentDir, "diagrams", "generated");
			if (!existsSync(folder)) {
				await mkdir(folder, {recursive: true});
			}
			await Promise.all(diagrams.map(function(diagram, index) {
				const path = resolve(folder, `${codename}-${dies[index]}.svg`);
				console.info(`[SVG]: Writing to ${path}`);
				return writeFile(path, diagram, {encoding: "utf8", flag: "w"});
			}));
			return diagrams;
		},
	}
}

async function saveDiagram(file: string, key: keyof typeof diagrams, variant: string) {
	const diagram = diagrams[key];
	return await saves[key].save(file, diagram.variants[variant]);
}

export default saveDiagram;
