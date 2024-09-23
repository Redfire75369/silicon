/// <reference types="@sveltejs/kit" />

declare module "*.json5" {
	const value: Record<string, any>;
	export default value;
}

declare module "*.svelte" {
	import { SvelteComponent, Component, type ComponentConstructorOptions } from 'svelte'

	// Support using the component as both a class and function during the transition period
	interface ComponentType {
		(
			...args: Parameters<Component<Record<string, any>>>
		): ReturnType<Component<Record<string, any>, Record<string, any>>>
		new (o: ComponentConstructorOptions): SvelteComponent
	}
	const Comp: ComponentType;
	type Comp = SvelteComponent;
	export default Comp;
}

