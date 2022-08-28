interface Meshes {
	name: string,
	codename: string,
	start: number,
	dies: string[],
	die_names: string[]
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


const diagrams: Diagrams = {
	mesh: {
		type: "mesh",
		variants: {
			"ice-lake": {
				name: "Ice Lake-SP",
				codename: "icx",
				start: 0,
				dies: ["xcc", "hcc"],
				die_names: ["XCC", "HCC"],
			},
			"sapphire-rapids": {
				name: "Sapphire Rapids-SP",
				codename: "spr",
				start: 2,
				dies: ["xcc-hbm", "xcc", "mcc"],
				die_names: ["XCC HBM", "XCC", "HCC"],
			},
		},
	},
}

export default diagrams;
