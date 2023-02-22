// @ts-ignore
import meta from "content/diagrams/metadata.json5";

export interface DiagramMetadata {
	type: string,
	variants: Variants,
}

export const metadata: Record<string, DiagramMetadata> = meta;
