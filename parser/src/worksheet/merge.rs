use umya_spreadsheet::Worksheet;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Merge {
	pub primary: bool,
	pub column_span: u32,
	pub row_span: u32,
}

impl Default for Merge {
	fn default() -> Self {
		Self {
			primary: true,
			column_span: 1,
			row_span: 1,
		}
	}
}

pub fn get_merges(worksheet: &Worksheet) -> Vec<Merge> {
	let (columns, rows) = worksheet.get_highest_column_and_row();

	let size = columns * rows;
	let mut merges = vec![Merge::default(); size as usize];

	for merge in worksheet.get_merge_cells() {
		let start_col = *merge.get_coordinate_start_col().unwrap().get_num();
		let start_row = *merge.get_coordinate_start_row().unwrap().get_num();
		let end_col = *merge.get_coordinate_end_col().unwrap().get_num();
		let end_row = *merge.get_coordinate_end_row().unwrap().get_num();

		let column_span = end_col - start_col + 1;
		let row_span = end_row - start_row + 1;

		for r in start_row..=end_row {
			for c in start_col..=end_col {
				let index = ((r - 1) * columns + (c - 1)) as usize;
				merges[index] = Merge {
					primary: c == start_col && r == start_row,
					row_span,
					column_span,
				};
			}
		}
	}

	merges
}
