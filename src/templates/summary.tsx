import React from "react";
import {graphql, PageProps} from "gatsby";

import Summary from "../components/summary/summary";
import Navigation from "../components/navigation";

export interface SummaryData {
	mdx: {
		frontmatter: {
			title: string,
			author: string,
			index: boolean | null,
		},
		body: string,
	},
}

export interface SummaryContext {
	id: string,
	slug: string,
}

export const query = graphql`
	query ($id: String!) {
		mdx(id: {eq: $id}) {
			frontmatter {
				title
				author
				index
			}
		}
	}
`;

function SummaryTemplate(props: PageProps<SummaryData, SummaryContext>) {
	const {pageContext, data, children} = props;
	const meta = {
		title: data.mdx.frontmatter.title,
		author: data.mdx.frontmatter.author
	};

	if (data.mdx.frontmatter.index) {
		return <Navigation meta={meta} mdx={children} slug={pageContext.slug}/>
	} else {
		return <Summary meta={meta} mdx={children}/>;
	}
}

export default SummaryTemplate;
