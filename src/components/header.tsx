import React from "react";

//@ts-ignore
import {header, headerInner, logo, title} from "./header.module.scss";

interface HeaderProps {
	title: string,
}

function Header(props: HeaderProps) {
	return (
		<>
			<div className={logo}>
			</div>
			<div className={header}>
				<div className={headerInner}>
					<a href="/">
						<img src="/img/icon.png" alt="Silicon Logo"/>
					</a>
					<div className={title}>
						<h1>{props.title}</h1>
					</div>
				</div>
				<hr/>
			</div>
		</>
	);
}

export default Header;
