import * as React from "react";
import {graphql, PageProps} from "gatsby";
import Summary from "../components/summary/summary";
import Navigation from "../components/navigation";

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        author
        title
		index
      }
      body
      slug
    }
  }
`;

interface Query {
	mdx: {
		frontmatter: {
			author: string,
			title: string,
			index: boolean,
		},
		body: string,
		slug: string,
	}
}

function SummaryPage({data}: PageProps<Query>) {
	const meta = {
		title: data.mdx.frontmatter.title,
		author: data.mdx.frontmatter.author
	};

	if (data.mdx.frontmatter.index) {
		return <Navigation meta={meta} mdx={data.mdx.body} slug={data.mdx.slug}/>
	} else {
		return <Summary meta={meta} mdx={data.mdx.body}/>;
	}
}

export default SummaryPage;
