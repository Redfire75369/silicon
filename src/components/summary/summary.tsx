import {MDXRenderer} from "gatsby-plugin-mdx";
import React, {ReactChild} from "react";
import Meta, {MetaProps} from "../meta";
import Scroll from "../scroll";

// @ts-ignore
import {container, header, headerInner, logo, markdown, title} from "./summary.module.scss";

interface SummaryProps {
	meta: MetaProps,
	mdx: string,
	children?: ReactChild | ReactChild[]
}


function Summary({meta, mdx, children}: SummaryProps) {
	return (
		<>
			<Meta {...meta}/>
			<main className={container}>
				<div className={logo}>
				</div>
				<div className={header}>
					<div className={headerInner}>
						<a href="/">
							<img src="/img/icon.png" alt="Silicon Logo"/>
						</a>
						<div className={title}>
							<h1>{meta.title}</h1>
						</div>
					</div>
					<hr/>
				</div>
				<div className={markdown}>
					<MDXRenderer>
						{mdx}
					</MDXRenderer>
					{children}
				</div>
				<div>
					<Scroll/>
				</div>
			</main>
		</>
	);
}

export default Summary;
