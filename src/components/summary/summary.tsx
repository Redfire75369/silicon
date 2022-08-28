import {MDXRenderer} from "gatsby-plugin-mdx";
import React, {ReactChild} from "react";

import Header from "../header";
import Meta, {MetaProps} from "../meta";
import Scroll from "../scroll";

// @ts-ignore
import {container, markdown} from "./summary.module.scss";

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
				<Header title={meta.title}/>
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
