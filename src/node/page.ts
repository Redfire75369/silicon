import {GatsbyNode} from "gatsby";
import path from "path";

import routes from "./routes";
import {slugify} from "../util";

type CreatePageCallback = GatsbyNode["onCreatePage"];
type CreatePagesCallback = GatsbyNode["createPages"];

export function handleCreatePage(...args: Parameters<CreatePageCallback>): ReturnType<CreatePageCallback> {
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

interface Data {
	parent: {
		relativePath: string,
	},
	internal: {
		contentFilePath: string,
	},
	id: string,
}

interface Query {
	allMdx: {
		nodes: Data[],
	},
}

export async function handleCreatePages(...args: Parameters<CreatePagesCallback>): Promise<ReturnType<CreatePagesCallback>> {
	const {actions, graphql, reporter} = args[0];
	const {createPage} = actions;

	const query = await graphql<Query>(`
		query {
			allMdx {
				nodes {
					parent {
						... on File {
							relativePath
						}
					}
					internal {
						contentFilePath
					}
					id
				}
			}
		}
	`);

	if (query.errors) {
		reporter.panicOnBuild("Error loading MDX result", query.errors)
	}

	const template = path.join(process.cwd(), "src/templates/summary.tsx")

	query.data.allMdx.nodes.forEach(node => {
		const slug = slugify(node.parent.relativePath);
		console.info(`[TEMPLATE]: ${template}?__contentFilePath=${node.internal.contentFilePath}`);
		createPage({
			path: slug,
			component: `${template}?__contentFilePath=${node.internal.contentFilePath}`,
			context: {
				id: node.id,
				slug,
			},
		});
	});
}
