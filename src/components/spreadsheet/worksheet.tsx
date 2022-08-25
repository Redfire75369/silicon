import React, {useEffect, useState} from "react";
import CSS from "csstype";
import {Cell, Worksheet} from "../../types";
import {CellBorders, getBorder, getMerges} from "../../node/styling";
import {cellToHyperlink, cellToString} from "../../node/cell";
import excelColour from "../../node/excel-colour";

// @ts-ignore
import {container, scrollable, sticky, table} from "./worksheet.module.scss";

type WorksheetProps = {
	worksheet: Worksheet,
};

type CellProps = {
	cell: Cell,
};

function WorksheetUI({worksheet}: WorksheetProps) {
	const frozen: [number, number] = [0, 0];
	if (worksheet.views[0].state === "frozen") {
		let view = worksheet.views[0];
		frozen[0] = (view.xSplit - 1) || 0;
		frozen[1] = (view.ySplit - 1) || 0;
	}

	// const sheetSettings = {
	// 	stretchH: "all",
	// };

	const merges = getMerges(worksheet);
	const colWidths = worksheet.columns.map((column, c) => {
		const maxBorder = worksheet.rows.reduce((acc, row, r) => {
			const cell = row.cells[c];
			if (cell?.style?.border) {
				const border = getTrueBorder(cell, r, c);
				return Math.max(acc, (border.left?.width ?? 1) + (border.right?.width ?? 1));
			} else {
				return acc;
			}
		}, 2);
		return (7.5 * (column?.width ?? worksheet.properties.defaultColWidth ?? 9)) + 2 + maxBorder;
	});

	const rowHeights = worksheet.rows.map((row, r) => {
		const maxBorder = row.cells.reduce((acc, cell, c) => {
			if (cell?.style?.border) {
				const border = getTrueBorder(cell, r, c);
				return Math.max(acc, (border.top?.width ?? 1) + (border.bottom?.width ?? 1));
			} else {
				return acc;
			}
		}, 2);
		return (row.height || worksheet.properties.defaultRowHeight) + 2 + maxBorder;
	});

	const totalHeight = rowHeights.reduce((a, h) => a + h);
	const totalWidth = colWidths.reduce((a, w) => a + w);

	const [windowHeight, setWindowHeight] = useState(0);

	useEffect(() => setWindowHeight(window.innerHeight), []);

	function getTrueBorder(cell: Cell, row: number, column: number): CellBorders {
		let [colspan, rowspan] = [1, 1];
		if (merges[row]?.[column]) {
			colspan = merges[row][column].colspan;
			rowspan = merges[row][column].rowspan;
		}

		const border = cell?.style?.border ? getBorder(cell?.style.border) : {};
		const mergeBorders: CellBorders = {};

		if (rowspan > 1) {
			const cell = worksheet.rows[row + rowspan - 1]?.cells[column];
			if (cell?.style?.border) {
				const border = getBorder(cell.style.border);
				if (border.bottom) {
					mergeBorders.bottom = border.bottom;
				}
			}
		}
		if (colspan > 1) {
			const cell = worksheet.rows[row]?.cells[column + colspan - 1];
			if (cell?.style?.border) {
				const border = getBorder(cell.style.border);
				if (border.right) {
					mergeBorders.right = border.right;
				}
			}
		}


		const surroundingBorders: CellBorders = {};
		{
			const cell = worksheet.rows[row + rowspan]?.cells[column];
			if (cell?.style?.border) {
				const border = getBorder(cell.style.border);
				if (border.top) {
					surroundingBorders.bottom = border.top;
				}
			}
		}
		{
			const cell = worksheet.rows[row]?.cells[column + colspan];
			if (cell?.style?.border) {
				const border = getBorder(cell.style.border);
				if (border.left) {
					surroundingBorders.right = border.left;
				}
			}
		}


		const trueBorder: CellBorders = {};

		if (row === 0 && border.top) {
			trueBorder.top = border.top;
		}
		if (column === 0 && border.right) {
			trueBorder.right = border.right;
		}

		const bottom = border?.bottom ?? mergeBorders?.bottom ?? surroundingBorders?.bottom;
		if (bottom) {
			trueBorder.bottom = bottom;
		}

		const right = border?.right ?? mergeBorders?.right ?? surroundingBorders?.right;
		if (right) {
			trueBorder.right = right;
		}

		return trueBorder;
	}

	function getStyles(cell: Cell, row: number, column: number): CSS.Properties {
		const style: CSS.Properties = {
			backgroundColor: "#FFFFFF",
			borderStyle: "solid",
			borderWidth: "0",
			color: "#000000",
			textAlign: "center",
			verticalAlign: "middle",
		};

		if (cell?.style) {
			const cellStyle = cell.style;

			const fillColour = excelColour(cellStyle?.fill?.type === "pattern" ? cellStyle.fill.fgColor : {});

			if (fillColour) {
				style.backgroundColor = fillColour.toRgbString();
			}

			if (cellStyle.alignment) {
				const alignment = cellStyle.alignment;
				switch (alignment.horizontal) {
					case "left":
						style.textAlign = "left";
						break;
					case "right":
						style.textAlign = "right";
						break;
					case "justify":
						style.textAlign = "justify";
						break;
					default:
				}
				switch (alignment.vertical) {
					case "top":
						style.verticalAlign = "top";
						break;
					case "bottom":
						style.verticalAlign = "bottom";
						break;
					default:
				}
			}

			const border = getTrueBorder(cell, row, column);

			if (row === 0) {
				style.borderTopColor = border.top?.colour ?? "#CCCCCC";
				style.borderTopWidth = `${border.top?.width ?? 1}px`;
			}
			if (column === 0) {
				style.borderLeftColor = border.left?.colour ?? "#CCCCCC";
				style.borderLeftWidth = `${border.left?.width ?? 1}px`;
			}

			style.borderBottomColor = border.bottom?.colour ?? "#CCCCCC";
			style.borderBottomWidth = `${border.bottom?.width ?? 1}px`;
			style.borderRightColor = border.right?.colour ?? "#CCCCCC";
			style.borderRightWidth = `${border.right?.width ?? 1}px`;
		}

		return style;
	}

	function Cell({cell}: CellProps) {
		const hyperlink = cellToHyperlink(cell);
		const text = cellToString(cell);

		return hyperlink ? (
			<a target="_blank" href={hyperlink}>{text}</a>
		) : (
			<>{text}</>
		);
	}

	return (
		<div className={scrollable}>
			<div className={container} style={{width: `100vw`, height: `${windowHeight - 40}px`}}>
				<table className={table} style={{width: `${totalWidth}px`, height: `${totalHeight}px`}}>
					<colgroup>
						{colWidths.map((width, c) => <col key={`col-${c}`} style={{width}}/>)}
					</colgroup>
					<thead>
					{
						worksheet.rows.slice(0, frozen[1] + 1).map((row, r) => {
							return (
								<tr key={`header-${r}`}>
									{
										row.cells.map((cell, c) => {
											const merge = merges[r]?.[c];
											const [colspan, rowspan] = [merge?.colspan ?? 1, merge?.rowspan ?? 1];
											const primary = merge?.primary ?? true;

											const style = getStyles(cell, r, c);
											style.width = `${colWidths[c]}px`;
											style.height = `${rowHeights[r]}px`;
											style.top = `${rowHeights.slice(0, r).reduce((a, r) => a + r, 0)}px`;
											if (c <= frozen[0]) {
												style.left = `${colWidths.slice(0, c).reduce((a, r) => a + r, 0)}px`
												style.zIndex = 1;
											}

											return primary ? (
												<td key={`header-${r}-${c}`} scope="col" className={sticky}
													style={style} colSpan={colspan} rowSpan={rowspan}>
													<Cell cell={cell}/>
												</td>
											) : <td key={`header-${r}-${c}`} scope="col" className={sticky}
													style={{display: "none"}}/>;
										})
									}
								</tr>
							);
						})
					}
					</thead>
					<tbody>
					{
						worksheet.rows.slice(frozen[1] + 1, worksheet.rows.length).map((row, r) => {
							return (
								<tr key={`body-${r + frozen[0] + 1}`}>
									{
										row.cells.map((cell, c) => {
											const merge = merges[r + frozen[1] + 1]?.[c];
											const [colspan, rowspan] = [merge?.colspan ?? 1, merge?.rowspan ?? 1];
											const primary = merge?.primary ?? true;

											const style = getStyles(cell, r + frozen[1] + 1, c);
											style.width = `${colWidths[c]}px`;
											style.height = `${rowHeights[r + frozen[1] + 1]}px`;
											if (c <= frozen[0]) {
												style.left = `${colWidths.slice(0, c).reduce((a, r) => a + r, 0)}px`
											}

											return primary ? (
												<td key={`body-${r + frozen[1] + 1}-${c}`} scope="col"
													className={c <= frozen[0] ? sticky : ""} style={style}
													colSpan={colspan} rowSpan={rowspan}>
													<Cell cell={cell}/>
												</td>
											) : <td key={`body-${r + frozen[1] + 1}-${c}`} scope="col"
													style={{display: "none"}}/>;
										})
									}
								</tr>
							);
						})
					}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default WorksheetUI;
