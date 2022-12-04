import type {GatsbyNode} from "gatsby";

type SchemaCustomisationCallback = GatsbyNode["createSchemaCustomization"];

const definitions = [
	`
		type Mdx implements Node {
			frontmatter: MdxFrontmatter
		}

		type MdxFrontmatter {
			title: String!
			author: String!
		  	index: Boolean
		  	navigation: String
		  	date: Date
		}
	`
];

export function customiseSchema(...args: Parameters<SchemaCustomisationCallback>): ReturnType<SchemaCustomisationCallback> {
	const {actions} = args[0];
	const {createTypes} = actions;

	for (const definition of definitions) {
		createTypes(definition);
	}
}
