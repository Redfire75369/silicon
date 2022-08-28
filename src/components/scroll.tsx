import React, {useEffect, useState} from "react";

//@ts-ignore
import {scroll, scrollPath} from "./scroll.module.scss";

function Scroll() {
	const [show, setShow] = useState(false);

	function onScroll() {
		if (document.documentElement.scrollTop > window.innerHeight) {
			setShow(true);
		} else {
			setShow(false);
		}
	}

	function onClick() {
		window.scrollTo({top: 0, behavior: "smooth"})
	}

	useEffect(function() {
		window.addEventListener("scroll", onScroll);
		return function() {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return show ? (
		<div className={scroll} onClick={onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
				<path className={scrollPath} fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
			</svg>
		</div>
	) : <></>;
}

export default Scroll;
