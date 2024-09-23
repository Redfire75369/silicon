use std::io::Cursor;
use std::ptr;

use style::get_css_style;
use umya_spreadsheet::{reader::xlsx, writer::csv, CsvWriterOption, NumberingFormat, Spreadsheet};
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

use crate::worksheet::{
	border::get_true_borders,
	merge::{get_merges, Merge},
};

pub mod border;
pub mod merge;
pub mod style;

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Cell {
	pub value: String,
	pub format: String,
	pub merge: Merge,
	pub style: String,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Row {
	pub cells: Vec<Cell>,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Pane {
	pub horizontal_split: f64,
	pub vertical_split: f64,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug)]
pub struct Worksheet {
	pub name: String,

	pub rows: Vec<Row>,
	pub column_widths: Box<[f64]>,
	pub row_heights: Box<[f64]>,

	pub pane: Option<Pane>,
}

#[wasm_bindgen]
pub struct Workbook(Spreadsheet);

#[wasm_bindgen]
impl Workbook {
	#[wasm_bindgen(constructor)]
	pub fn new(bytes: &[u8]) -> Result<Workbook, JsError> {
		Ok(Workbook(xlsx::read_reader(Cursor::new(bytes), true)?))
	}

	pub fn get_worksheet(&self, key: &str) -> Option<Worksheet> {
		let worksheet = self.0.get_sheet_by_name(key)?;
		let (columns, rows) = worksheet.get_highest_column_and_row();

		let merges = get_merges(worksheet);
		let borders = get_true_borders(worksheet, &merges);

		let column_widths = (0..columns)
			.into_iter()
			.map(|c| {
				let max_border = (0..rows).into_iter().fold(2, |acc, r| {
					let index = (r * columns + c) as usize;
					let border = &borders[index];

					return acc.max(border.left.width.into_int() + border.right.width.into_int());
				});
				let mut width = *worksheet.get_column_dimension_by_number(&(c + 1)).unwrap().get_width();
				if width == 0.0 {
					width = *worksheet.get_sheet_format_properties().get_default_column_width();
				}
				7.5 * width + 2.0 + max_border as f64
			})
			.collect();

		let row_heights = (0..rows)
			.into_iter()
			.map(|r| {
				let max_border = (0..columns).into_iter().fold(2, |acc, c| {
					let index = (r * columns + c) as usize;
					let border = &borders[index];

					return acc.max(border.top.width.into_int() + border.bottom.width.into_int());
				});
				let mut height = *worksheet.get_row_dimension(&(r + 1)).unwrap().get_height();
				if height == 0.0 {
					height = *worksheet.get_sheet_format_properties().get_default_row_height();
				}
				height + 2.0 + max_border as f64
			})
			.collect();

		let pane = worksheet
			.get_sheets_views()
			.get_sheet_view_list()
			.first()
			.and_then(|v| v.get_pane())
			.map(|pane| Pane {
				horizontal_split: *pane.get_horizontal_split(),
				vertical_split: *pane.get_vertical_split(),
			});

		let rows = (0..rows)
			.into_iter()
			.map(|r| {
				let cells = (0..columns)
					.into_iter()
					.map(|c| {
						let index = (r * columns + c) as usize;

						let (format, style) = if merges[index].primary {
							let style = worksheet.get_style((c + 1, r + 1));
							let format = style.get_number_format().cloned().unwrap_or_default();

							let style = get_css_style(worksheet, c, r, &borders[index]);
							(format, style)
						} else {
							let mut format = NumberingFormat::default();
							format.set_format_code(NumberingFormat::FORMAT_NUMBER);
							(format, String::new())
						};

						Cell {
							value: worksheet.get_value((c + 1, r + 1)),
							format: String::from(format.get_format_code()),
							merge: merges[index],
							style,
						}
					})
					.collect();
				Row { cells }
			})
			.collect();

		Some(Worksheet {
			name: String::from(key),

			rows,
			column_widths,
			row_heights,

			pane,
		})
	}

	pub fn get_csv(&mut self, key: &str) -> Result<Box<[u8]>, JsError> {
		let mut idx = None;
		for i in 0..self.0.get_sheet_count() {
			let sheet = self.0.get_sheet_by_name(key);
			if sheet.is_some() && ptr::eq(self.0.get_sheet(&i).unwrap(), sheet.unwrap()) {
				idx = Some(i);
				break;
			}
		}
		let idx = idx.ok_or_else(|| JsError::new("invalid worksheet key"))?;

		self.0.set_active_sheet(idx as u32);
		let mut bytes = Cursor::new(Vec::new());
		let mut options = CsvWriterOption::default();
		options.set_do_trim(true);

		csv::write_writer(&self.0, &mut bytes, &options)?;
		Ok(bytes.into_inner().into_boxed_slice())
	}
}
