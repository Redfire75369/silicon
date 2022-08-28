import React from "react";
import {graphql, PageProps} from "gatsby";

import WorkbookUI from "../../components/spreadsheet/workbook";
import {Worksheet} from "../../types";

export const query = graphql`
	query ($id: String) {
		workbook(id: {eq: $id}) {
		    name
		    keys
		    names
		    worksheets
    	}
    }
`;

interface Query {
	workbook: {
		name: string,
		keys: string[],
		names: string[],
		worksheets: string[],
	}
}

function SpreadsheetPage({data}: PageProps<Query>) {
	const meta = {
		title: data.workbook.name,
		author: "Redfire"
	};
	const worksheets: Worksheet[] = data.workbook.worksheets.map(worksheet => JSON.parse(worksheet));

	return <WorkbookUI meta={meta} keys={data.workbook.keys} names={data.workbook.names} worksheets={worksheets}/>;
}

export default SpreadsheetPage;
