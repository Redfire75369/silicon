import React from "react"
import {graphql, Link, useStaticQuery} from "gatsby"

// @ts-ignore
import {container, markdown} from "../components/summary/summary.module.scss";
import {Helmet} from "react-helmet";

function NotFound() {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					icon
				}
			}
		}
	`);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8"/>

				<title>404: Not Found</title>
				<link rel="icon" href={data.site.siteMetadata.icon}/>

				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<meta name="robots" content="noindex"/>
			</Helmet>
			<main className={container}>
				<title>404: Not Found</title>
				<div className={markdown}>
					<h1>Page not found</h1>
					<span>We couldn’t find what you were looking for.</span>
					<br/><br/>
					<Link to="/">Go home</Link>.
				</div>
			</main>
		</>
	);
}

export default NotFound;
