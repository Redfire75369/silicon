// @ts-ignore
import Exporter from "@redfire/drawio-export";
import {existsSync} from "fs";
import {mkdir, readFile, stat, writeFile} from "fs/promises";
import {resolve} from "path";

import type {Variant} from "$lib/diagram/diagram";
import {metadata} from "$lib/diagram/diagram";
import {cacheDir, contentDir} from "$lib/directory.server";

type Saves = Record<string, {
	save: (key: string, variant: Variant) => void
}>;

const exporter = await Exporter.launch();

const saves: Saves = {
	mesh: {
		async save(key, variant) {
			const {codename, start, dies} = variant;

			const diagramFile = resolve(contentDir, "diagrams", `${key}.drawio`);
			const diagramCacheDir = resolve(cacheDir, "diagrams");
			const diagramTimestamp = resolve(diagramCacheDir, `${key}-${codename}.drawio.timestamp`);

			const stats = await stat(diagramFile);
			if (existsSync(diagramTimestamp)) {
				const timestamp = new Date(await readFile(diagramTimestamp, {encoding: "utf8"}));
				if (timestamp >= stats.mtime) {
					console.info(`[SVG]: Found Diagram (${key}:${codename}) in Cache`);
					return;
				}
			}

			const diagram = await readFile(diagramFile, {encoding: "utf8"});
			const diagrams: string[] = await Promise.all(dies.map(function (_, index) {
				return exporter.exportSvg(diagram, start + index);
			}));

			const generatedDir = resolve(contentDir, "diagrams", "generated", "mesh");
			if (!existsSync(generatedDir)) {
				await mkdir(generatedDir, {recursive: true});
			}
			if (!existsSync(diagramCacheDir)) {
				await mkdir(diagramCacheDir, {recursive: true});
			}

			await Promise.all(diagrams.map((diagram, index) => {
				const path = resolve(generatedDir, `${codename}-${dies[index]}.svg`);
				console.info(`[SVG]: Writing Diagram (${key}:${codename}) to ${path}`);
				return writeFile(path, diagram, {encoding: "utf8", flag: "w"});
			}));

			console.info(`[SVG]: Writing Diagram (${key}:${codename}) Timestamp to Cache`);
			await writeFile(diagramTimestamp, stats.mtime.toISOString(), {encoding: "utf8", flag: "w"});
		}
	}
}

export default async function saveDiagram(key: keyof typeof metadata, variant: string) {
	return saves[key].save(key, metadata[key].variants[variant]);
}


