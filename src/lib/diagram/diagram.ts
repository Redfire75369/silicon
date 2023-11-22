import meta from "content/diagrams/metadata.json5";

interface Meshes {
	name: string,
	codename: string,
	start: number,
	dies: string[],
	dieNames: string[]
}

export type Variant = Meshes;

interface Diagram {
	type: string,
	variants: Record<string, Variant>,
}

export const metadata: Record<string, Diagram> = meta;
