import {CsvWriteOptions} from "exceljs";
import {existsSync, mkdirSync} from "fs";
import type {GatsbyNode} from "gatsby";
import {join} from "path";

import diagrams from "./src/drawio/diagrams";
import saveDiagram from "./src/drawio/svg";
import routes from "./src/node/routes";
import {getWorkbook, workbook_metadata} from "./src/spreadsheet/workbook";
import getWorksheet from "./src/spreadsheet/worksheet";

const spreadsheetMediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type CreateNodeCallback = GatsbyNode["onCreateNode"];

export async function onCreateNode(...args: Parameters<CreateNodeCallback>): Promise<ReturnType<CreateNodeCallback>> {
	const {node, actions, createNodeId, createContentDigest} = args[0];
	const {createNode, createParentChildLink} = actions;
	if (node.internal.mediaType === spreadsheetMediaType && typeof node.relativePath === "string" && typeof node.name === "string") {
		const workbook = await getWorkbook(node.relativePath);
		const metadata = workbook_metadata[node.name];

		const worksheets = Object.values(metadata.sheets).map(meta => getWorksheet(workbook, meta));

		const workbookNode = {
			book: node.name,
			name: metadata.name,
			keys: Object.keys(metadata.sheets),
			names: Object.values(metadata.sheets).map(meta => meta[0]),
			worksheets: worksheets.map(worksheet => JSON.stringify(worksheet)),
			id: createNodeId(`${node.id} >>> Workbook`),
			children: [],
			parent: node.id,
			internal: {
				contentDigest: createContentDigest(worksheets),
				type: "Workbook",
			},
		};

		createNode(workbookNode);
		createParentChildLink({parent: node, child: workbookNode});

		const options: Partial<CsvWriteOptions> = {
			includeEmptyRows: true
		};

		const keys = Object.keys(metadata.sheets);
		for (let i = 0; i < keys.length; i++) {
			options.sheetName = metadata.sheets[keys[i]][0];
			const folder = join(process.cwd(), "content", "spreadsheets", "generated", node.relativePath.split("/")[1].split(".")[0]);
			const path = join(folder, `${keys[i]}.csv`);
			console.info(`[CSV]: Writing to ${path}`);
			if (!existsSync(folder)) {
				mkdirSync(folder, {recursive: true});
			}

			await workbook.csv.writeFile(path, options);
		}
	} else if (typeof node.relativePath === "string" && node.relativePath.endsWith(".drawio") && typeof node.name === "string") {
		if (node.name in diagrams) {
			const diagram = diagrams[node.name];
			for (const variant in diagram.variants) {
				const inner = diagram.variants[variant];
				const saved = await saveDiagram(node.relativePath, node.name, variant);

				const diagramNode = {
					name: inner.name,
					variant,
					diagrams: saved,
					id: createNodeId(`${node.id} ${variant} >>> ${diagram.type} Diagram`),
					children: [],
					parent: node.id,
					internal: {
						contentDigest: createContentDigest(saved.join(",")),
						type: `${diagram.type}Diagram`,
					},
				};

				createNode(diagramNode);
			}
		}
	}
}

type CreatePageCallback = GatsbyNode["onCreatePage"];

export function onCreatePage(...args: Parameters<CreatePageCallback>): ReturnType<CreatePageCallback> {
	const {page, actions} = args[0];
	const {createPage, deletePage} = actions;
	for (const route of routes) {
		const matches = route.regex.exec(page.path);
		if (matches !== null) {
			deletePage(page);
			page.path = route.path(matches);
			createPage(page);
			break;
		}
	}

	console.info(`[PAGE]: Created at ${page.path}`);
}
