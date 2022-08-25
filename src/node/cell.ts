import {format} from "ssf";

import {Cell} from "../types";

export function cellToString(cell: Cell): string {
	if (cell.value) {
		if (typeof cell.value === "number") {
			const numfmt = (cell.style.numFmt || "0");
			let fmt = /0+\.0+/.test(numfmt) ? numfmt : numfmt
				.replaceAll("0|", "\\0|").replaceAll("#0", "#\\0")
				.replaceAll("|", "\\|").replaceAll(".", "\\.")
				.replaceAll("0#\\.0;", "0#.0;");


			if (!fmt.startsWith("[")) {
				fmt = fmt.replaceAll("[", "\\[").replaceAll("]", "\\]");
			} else {
				const split = fmt.split("]");
				const [condition, ...rest] = split;
				let remaining = rest.join("]");

				fmt = condition + "]" + remaining.replaceAll("[", "\\[").replaceAll("]", "\\]");
			}

			return format(fmt, cell.value);
		} else if (cell.value?.hyperlink) {
			return cell.value.text;
		} else {
			return cell.value.toString();
		}
	}
	return "";
}

export function cellToHyperlink(cell: Cell): string | null {
	if (typeof cell.value === "object" && cell.value !== null && "hyperlink" in cell.value) {
		return cell.value.hyperlink;
	}
	return null;
}

