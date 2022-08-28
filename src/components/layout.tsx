import React, {ReactNode} from "react";

import Meta, {MetaProps} from "./meta";

export interface LayoutProps {
	meta: MetaProps,
	children: ReactNode,
}

function Layout({meta, children}: LayoutProps) {
	return (
		<>
			<Meta {...meta}/>
			{children}
		</>
	);
}

export default Layout;
