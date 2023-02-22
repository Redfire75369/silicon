interface Meshes {
	name: string,
	codename: string,
	start: number,
	dies: string[],
	dieNames: string[]
}

type Variant = Meshes;

interface Variants {
	[key: string]: Variant
}

interface Diagram {
	type: string,
	variants: Variants,
}

interface Diagrams {
	[key: string]: Diagram
}
