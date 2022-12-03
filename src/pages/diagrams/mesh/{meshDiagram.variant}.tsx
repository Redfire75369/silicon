import React, {Fragment} from "react";
import {graphql, PageProps} from "gatsby";

import Meta from "../../../components/meta";
import diagrams from "../../../drawio/diagrams";

//@ts-ignore
import {container, header} from "./mesh-diagram.module.scss";
import Header from "../../../components/header";

export const query = graphql`
  query ($id: String) {
    meshDiagram(id: {eq: $id}) {
      name
      variant
      diagrams
    }
  }
`;

interface Query {
	meshDiagram: {
		name: string,
		variant: string,
		diagrams: string[]
	}
}

function MeshDiagrams({data}: PageProps<Query>) {
	const mesh = data.meshDiagram;
	const meshInfo = diagrams.mesh.variants[mesh.variant];

	const meta = {
		author: "Redfire",
		title: meshInfo.name,
	};

	return (
		<>
			<Meta {...meta}/>
			<main className={container}>
				<Header title={meshInfo.name}/>
				{
					mesh.diagrams.map((diagram, index) => {
						return (
							<Fragment key={meshInfo.dies[index]}>
								<div dangerouslySetInnerHTML={{ __html: diagram }}></div>
								{index !== mesh.diagrams.length - 1 ? <hr/> : <></>}
							</Fragment>
						);
					})
				}
			</main>
		</>
	);
}

export default MeshDiagrams;
