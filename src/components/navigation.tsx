import {graphql, useStaticQuery} from "gatsby";
import React from "react";

import {MetaProps} from "./meta";
import Summary from "./summary/summary";
import routes, {navigation, orders} from "../node/routes";

interface NavigationProps {
	meta: MetaProps,
	mdx: string,
	slug: string,
}

type SlugMap = {
	index?: string,
} & {
	[key: string]: SlugMap
};

interface Node {
	frontmatter: {
		title: string,
		navigation?: string,
	},
	slug: string
}

interface Query {
	allMdx: {
		nodes: Node[]
	}
}

function Navigation({meta, mdx, slug}: NavigationProps) {
	const query: Query = useStaticQuery(graphql`
		query NavigationQuery {
			allMdx(
				filter: {slug: {glob: "!mlid/**"}}
				sort: {order: DESC, fields: frontmatter___date}
			) {
				nodes {
					frontmatter {
						title
						navigation
					}
					slug
				}
			}
		}
	`);
	const existing = slug.split("/").length;

	let nodes = query.allMdx.nodes.filter(node => node.slug.startsWith(slug) && node.slug !== slug)
	for (const [name, order] of Object.entries(orders)) {
		if (slug == name) {
			nodes = nodes.sort((a, b) => {
				const path1 = a.slug.split("/").slice(existing - 1).join("/");
				const path2 = b.slug.split("/").slice(existing - 1).join("/");

				const index1 = order.findIndex((p) => path1.startsWith(p));
				const index2 = order.findIndex((p) => path2.startsWith(p));
				if (index1 === -1 || index2 === -1) {
					return 0;
				}
				return index1 - index2;
			});
			break;
		}
	}

	const map: SlugMap = {}
	nodes.forEach(node => {
		let slug = node.slug;

		const segments = slug.split("/").slice(existing - 1).filter(s => s !== "");
		let m = map;
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (m[segment] === undefined) {
				m[segment] = {}
			}
			m = m[segment];
		}
		m.index = node.frontmatter.navigation ?? node.frontmatter.title;
	});

	function NavigationSection({map, slug}: { map: SlugMap, slug: string }) {
		return (
			<ul>
				{
					Object.entries(map).map(([key, value]) => {
						if (typeof value === "string") {
							return <li key={key}></li>;
						}

						if (typeof value.index !== "string") {
							let href = `${slug}${key}`;

							return <li key={key}>
								{navigation[`/${href}`] ?? `Unknown: ${href} ${key}`}
								<NavigationSection map={value} slug={href}/>
							</li>;
						}

						let href = `/${slug}/${key}`.replace("//", "/");

						for (const route of routes) {
							const matches = route.regex.exec(href);
							if (matches !== null) {
								href = route.path(matches);
								break;
							}
						}

						return <li key={key}>
							<a href={href}>{value.index}</a>
						</li>;
					})
				}
			</ul>
		);
	}

	return (
		<Summary meta={meta} mdx={mdx}>
			<NavigationSection map={map} slug={slug}/>
		</Summary>
	);
}

export default Navigation;
