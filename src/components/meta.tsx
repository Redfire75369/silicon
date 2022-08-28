import {graphql, useStaticQuery} from "gatsby";
import React from "react"
import {Helmet} from "react-helmet";

export interface MetaProps {
	author: string,
	description?: string,
	icon?: string,
	title?: string,
}

function Meta({author, description, icon, title}: MetaProps) {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					icon
					title
				}
			}
		}
	`);

	const pageTitle = title || data.site.siteMetadata.title;
	const pageIcon = icon || data.site.siteMetadata.icon;

	return (
		<Helmet>
			<meta charSet="utf-8"/>

			<title>{pageTitle}</title>
			<meta name="author" content={author}/>
			<link rel="icon" href={pageIcon}/>

			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<meta name="robots" content="index, follow"/>

			<meta name="description" content={description || ""}/>
			<meta name="theme-color" content="#000000"/>

			<meta property="og:type" content="game"/>
			<meta property="og:title" content={pageTitle}/>
			<meta property="og:description" content={description || ""}/>
			<meta property="og:url" content="https://silicon.redfire.dev/"/>

			<meta property="twitter:title" content={pageTitle}/>
			<meta property="twitter:description" content={description || ""}/>
			<meta property="twitter:url" content="https://silicon.redfire.dev/"/>
		</Helmet>
	);
}

export default Meta;
