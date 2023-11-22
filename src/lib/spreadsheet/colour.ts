import type {Colord, HslaColor} from "colord";
import {colord} from "colord";

const indexedColours = [
	"#000000",
	"#FFFFFF",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#000000",
	"#FFFFFF",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#800000",
	"#008000",
	"#000080",
	"#808000",
	"#800080",
	"#008080",
	"#C0C0C0",
	"#808080",
	"#9999FF",
	"#993366",
	"#FFFFCC",
	"#CCFFFF",
	"#660066",
	"#FF8080",
	"#0066CC",
	"#CCCCFF",
	"#000080",
	"#FF00FF",
	"#FFFF00",
	"#00FFFF",
	"#800080",
	"#800000",
	"#008080",
	"#0000FF",
	"#00CCFF",
	"#CCFFFF",
	"#CCFFCC",
	"#FFFF99",
	"#99CCFF",
	"#FF99CC",
	"#CC99FF",
	"#FFCC99",
	"#3366FF",
	"#33CCCC",
	"#99CC00",
	"#FFCC00",
	"#FF9900",
	"#FF6600",
	"#666699",
	"#969696",
	"#003366",
	"#339966",
	"#003300",
	"#333300",
	"#993300",
	"#993366",
	"#333333",
	"#333399",
];

const themeColours = [
	"#FFFFFF",
	"#000000",
	"#E7E6E6",
	"#44546A",
	"#4472C4",
	"#ED7D31",
	"#A5A5A5",
	"#FFC000",
	"#5B9BD5",
	"#70AD47",
];

type ExcelColour = {
	argb?: string,
	indexed?: number,
	theme?: number,
	tint?: number,
};

function themeColour(theme: number, tint: number | undefined): HslaColor {
	let colour = colord(themeColours[theme]).toHsl();
	if (tint === undefined) {
		tint = 0;
	}
	if (tint < 0) {
		return {
			...colour,
			l: Math.max(0, Math.min(100, colour.l * (1 + tint))),
		};
	} else {
		return {
			...colour,
			l: Math.max(0, Math.min(100, 100 + (colour.l - 100) * (1 - tint))),
		};
	}
}

export default function excelColour(colour: ExcelColour | undefined): Colord | null {
	if (colour === undefined) {
		return null;
	} else if (typeof colour.argb === "string") {
		return colord("#" + colour.argb.substring(2) + colour.argb.substring(0, 2));
	} else if (typeof colour.indexed === "number") {
		return colord(indexedColours[colour.indexed]);
	} else if (typeof colour.theme === "number" && (typeof colour.tint === "number" || typeof colour.tint === "undefined")) {
		return colord(themeColour(colour.theme, colour.tint));
	} else {
		return null;
	}
}
