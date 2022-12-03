import type {GatsbyNode} from "gatsby";

import {handleNodeCreate} from "./src/node/node";
import {handleCreatePage, handleCreatePages} from "./src/node/page";
import {customiseSchema} from "./src/node/type";

type CreateNodeCallback = GatsbyNode["onCreateNode"];
type CreatePageCallback = GatsbyNode["onCreatePage"];
type CreatePagesCallback = GatsbyNode["createPages"];
type SchemaCustomisationCallback = GatsbyNode["createSchemaCustomization"];

export async function onCreateNode(...args: Parameters<CreateNodeCallback>): Promise<ReturnType<CreateNodeCallback>> {
	return await handleNodeCreate(...args);
}

export function onCreatePage(...args: Parameters<CreatePageCallback>): ReturnType<CreatePageCallback> {
	return handleCreatePage(...args);
}

export async function createPages(...args: Parameters<CreatePagesCallback>): Promise<ReturnType<CreatePagesCallback>> {
	return await handleCreatePages(...args);
}

export function createSchemaCustomization(...args: Parameters<SchemaCustomisationCallback>): ReturnType<SchemaCustomisationCallback> {
	return customiseSchema(...args);
}
