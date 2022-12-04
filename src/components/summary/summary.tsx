import React, {ReactNode} from "react";

import Header from "../header";
import Meta, {MetaProps} from "../meta";
import Scroll from "../scroll";

// @ts-ignore
import {container, markdown} from "./summary.module.scss";

interface SummaryProps {
	meta: MetaProps,
	mdx: string,
	children?: ReactNode | ReactNode[]
}

function Summary({meta, mdx, children}: SummaryProps) {
	return (
		<>
			<Meta {...meta}/>
			<main className={container}>
				<Header title={meta.title}/>
				<div className={markdown}>
					{mdx}
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
