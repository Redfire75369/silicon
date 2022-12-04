import React, {useEffect, useState} from "react";

import WorksheetUI from "./worksheet";
import Layout from "../layout";
import {MetaProps} from "../meta";
import {Worksheet} from "../../types";

// @ts-ignore
import {active, inactive, link, navigation, tab, workbook} from "./workbook.module.scss";

type WorkbookProps = {
	meta: MetaProps
	keys: string[],
	names: string[],
	worksheets: Worksheet[],
};

function WorkbookUI({meta, keys, names, worksheets}: WorkbookProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [worksheet, setWorksheet] = useState(worksheets[0]);

	useEffect(() => setWorksheet(worksheets[currentIndex]), [currentIndex]);

	return (
		<Layout meta={meta}>
			<div className={workbook}>
				<WorksheetUI worksheet={worksheet}/>
				<div className={navigation}>
					<a href="../" className={`${tab} ${link}`}>
						Browse Spreadsheets
					</a>
					{keys.map((key, index) => {
						const current = index === currentIndex;
						return <div key={key} className={`${tab} ${current ? active : inactive}`}
									onClick={() => current || setCurrentIndex(index)}>
							{names[index]}
						</div>
					})}
				</div>
			</div>
		</Layout>
	);
}

export default WorkbookUI;
