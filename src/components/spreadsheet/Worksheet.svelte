<script lang="ts">
	import excelColour from "$lib/spreadsheet/colour";
	import {getBorder, getMerges} from "$lib/spreadsheet/styles";
	import type {CellBorders} from "$lib/spreadsheet/styles";
	import type {Cell, Worksheet} from "$lib/spreadsheet/types";

	export let worksheet: Worksheet;

	let frozen: [number, number] = [0, 0];
	let view = worksheet.views[0];
	if (view.state === "frozen") {
		frozen[0] = (view.xSplit - 1) || 0;
		frozen[1] = (view.ySplit - 1) || 0;
	}

	let merges = getMerges(worksheet);

	let colWidths = worksheet.columns.map((column, c) => {
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

	let rowHeights = worksheet.rows.map((row, r) => {
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

	let totalHeight = rowHeights.reduce((a, h) => a + h);
	let totalWidth = colWidths.reduce((a, w) => a + w);

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

	function getStyles(cell: Cell, row: number, column: number): string {
		let style = "background-color: #FFFFFF; border-style: solid; border-width: 0; color: #000000; text-align: center; vertical-align: middle;";

		if (cell?.style) {
			const cellStyle = cell.style;

			const fill = excelColour(cellStyle?.fill?.type === "pattern" ? cellStyle.fill.fgColor : {});
			if (fill) {
				style += `background-color: ${fill.toRgbString()};`;
			}

			if (cellStyle.alignment) {
				const alignment = cellStyle.alignment;
				switch (alignment.horizontal) {
					case "left":
						style += "text-align: left;";
						break;
					case "right":
						style += "text-align: right;";
						break;
					case "justify":
						style += "text-align: justify;";
						break;
					default:
				}
				switch (alignment.vertical) {
					case "top":
						style = "vertical-align: top;";
						break;
					case "bottom":
						style = "vertical-align: bottom;";
						break;
					default:
				}
			}

			const border = getTrueBorder(cell, row, column);

			if (row === 0) {
				style += `border-top-color: ${border.top?.colour ?? "#CCCCCC"};`;
				style += `border-top-width: ${border.top?.width ?? 1}px;`;
			}
			if (column === 0) {
				style += `border-left-color: ${border.left?.colour ?? "#CCCCCC"};`;
				style += `border-left-width: ${border.left?.width ?? 1}px;`;
			}

			style += `border-bottom-color: ${border.bottom?.colour ?? "#CCCCCC"};`;
			style += `border-bottom-width: ${border.bottom?.width ?? 1}px;`;
			style += `border-right-color: ${border.right?.colour ?? "#CCCCCC"};`;
			style += `border-right-width: ${border.right?.width ?? 1}px;`;

		}
		return style;
	}

	let rows = worksheet.rows.map((row, r) => {
		return row.cells.map((cell, c) => {
			const merge = merges[r]?.[c];
			const [colspan, rowspan] = [merge?.colspan ?? 1, merge?.rowspan ?? 1];
			const primary = merge?.primary ?? true;

			let style = getStyles(cell, r, c);
			style += `width: ${colWidths[c]}px;`;
			style += `height: ${rowHeights[r]}px;`;
			if (r <= frozen[1]) {
				style += `top: ${rowHeights.slice(0, r).reduce((a, r) => a + r, 0)}px;`;
			}
			if (c <= frozen[0]) {
				style += `left: ${colWidths.slice(0, c).reduce((a, c) => a + c, 0)}px;`
				if (r <= frozen[1]) {
					style += "z-index: 1;";
				}
			}

			return {primary, colspan, rowspan, style, value: cell.value};
		});
	});
</script>

<style lang="scss">
	.scrollable {
		overflow: hidden;
	}

	.container {
		overflow: auto;
		position: relative;
	}

	:global {
		.table {
			font-family: "Segoe UI", sans-serif;
			font-size: 12px;
			border-spacing: 0;

			width: 100%;
			height: 100%;

			tr {
				th, td {
					box-sizing: border-box;
					padding: 0;
				}
			}
		}
	}

	.sticky {
		position: sticky;
	}
</style>

<div class="scrollable">
	<div class="container" style="width: 100vw; height: calc(100vh - 40px);">
		<table class="table" style="width: {totalWidth}px; height: {totalHeight}px;">
			<colgroup>
				{#each colWidths as width}
					<col style="width: {width};"/>
				{/each}
			</colgroup>
			<thead>
				{#each rows.slice(0, frozen[1] + 1) as row}
					<tr>
						{#each row as {primary, colspan, rowspan, style, value}}
							{#if primary}
								<th scope="col" class="sticky" {style} {colspan} {rowspan}>
									{value}
								</th>
							{:else}
								<th scope="col" class="sticky" style="display: none;">
									{value}
								</th>
							{/if}
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rows.slice(frozen[1] + 1, worksheet.rows.length) as row}
					<tr>
						{#each row as {primary, colspan, rowspan, style, value}, c}
							{#if primary}
								<td class={c <= frozen[0] ? "sticky" : ""} {style} {colspan} {rowspan}>
									{value}
								</td>
							{:else}
								<td style="display: none;">
									{value}
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
