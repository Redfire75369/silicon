<script lang="ts">
	import type { Worksheet } from "$lib/spreadsheet/workbook";
	import Cell from "components/spreadsheet/Cell.svelte";

	interface Props {
		worksheet: Worksheet,
	}

	let {worksheet}: Props = $props();

	let frozenX = $derived(worksheet.pane?.horizontal_split ?? 0);
	let frozenY = $derived(worksheet.pane?.vertical_split ?? 0);

	let rows = $derived.by(() =>
		worksheet.rows.map((row, r) =>
			row.cells.map((cell, c) => {
				const sticky =
					r < frozenY || c < frozenX ? "cell sticky" : "cell";

				let style = cell.style;
				style += `width: ${worksheet.column_widths[c]}px;`;
				style += `height: ${worksheet.row_heights[r]}px;`;
				if (r < frozenY) {
					style += `top: ${worksheet.row_heights.slice(0, r).reduce((a, r) => a + r, 0)}px;`;
				}
				if (c < frozenX) {
					style += `left: ${worksheet.column_widths.slice(0, c).reduce((a, c) => a + c, 0)}px;`;
					if (r < frozenY) {
						style += "z-index: 1;";
					}
				}

				return { ...cell.merge, style, sticky, cell: cell.value, hyperlink: cell.hyperlink };
			}),
		),
	);
</script>

<div class="scrollable">
	<div class="container" style="width: 100vw; height: calc(100vh - 40px);">
		<table
			class="table"
			style="width: {worksheet.column_widths.reduce(
				(a, w) => a + w,
			)}px; height: {worksheet.row_heights.reduce((a, h) => a + h)}px;"
		>
			<colgroup>
				{#each worksheet.column_widths as width}
					<col style="width: {width};" />
				{/each}
			</colgroup>
			<thead>
				{#each rows.slice(0, frozenY) as row}
					<tr>
						{#each row as { primary, column_span, row_span, style, sticky, cell, hyperlink }}
							{#if primary}
								<th
									scope="col"
									class={sticky}
									{style}
									colspan={column_span}
									rowspan={row_span}
								>
									<Cell {cell} {hyperlink} />
								</th>
							{:else}
								<th scope="col" style="display: none;">
									<div></div>
								</th>
							{/if}
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rows.slice(frozenY, worksheet.rows.length) as row}
					<tr>
						{#each row as { primary, column_span, row_span, style, sticky, cell, hyperlink }}
							{#if primary}
								<td
									class={sticky}
									{style}
									colspan={column_span}
									rowspan={row_span}
								>
									<Cell {cell} {hyperlink} />
								</td>
							{:else}
								<td style="display: none;">
									<div></div>
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

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
				th,
				td {
					box-sizing: border-box;
					padding: 0;
				}
			}
		}
	}

	.cell {
		background-color: #ffffff;
		border-width: 0;
		color: #000000;
		text-align: center;
		vertical-align: middle;

		&.sticky {
			position: sticky;
		}
	}
</style>
