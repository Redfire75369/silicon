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
						<img src="/images/icon.png" alt="Silicon Logo"/>
					</a>
					<div className={title}>
						<h1>{props.title}</h1>
					</div>
					<a href="https://twitter.com/Redfire75369">
						<img src="images/twitter.png" alt="Twitter"/>
					</a>
					<a href="https://mastodon.online/@redfire" rel="me">
						<img src="images/mastodon.png" alt="Mastodon"/>
					</a>
				</div>
				<hr/>
			</div>
		</>
	);
}

export default Header;
