use umya_spreadsheet::{Color, Worksheet};

use crate::worksheet::merge::Merge;

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum BorderStyle {
	Dotted,
	Dashed,
	Solid,
	Double,
}

#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
#[repr(u32)]
pub enum BorderWidth {
	None = 0,
	Thin = 1,
	Medium = 2,
	Thick = 3,
}

impl BorderWidth {
	pub fn into_int(self) -> u32 {
		self as u32
	}
}

#[derive(Clone, Debug)]
pub struct Border {
	pub color: Color,
	pub style: BorderStyle,
	pub width: BorderWidth,
}

impl Border {
	fn from_umya_border(border: &umya_spreadsheet::Border) -> Option<Border> {
		use umya_spreadsheet::BorderStyleValues as BSV;
		let (style, width) = match border.get_style() {
			BSV::None => return None,

			BSV::Thin => (BorderStyle::Solid, BorderWidth::Thin),
			BSV::Dashed => (BorderStyle::Dashed, BorderWidth::Thin),
			BSV::Dotted => (BorderStyle::Dotted, BorderWidth::Thin),
			BSV::Double => (BorderStyle::Double, BorderWidth::Medium),

			BSV::Medium => (BorderStyle::Solid, BorderWidth::Medium),
			BSV::MediumDashed => (BorderStyle::Dashed, BorderWidth::Medium),

			BSV::Thick => (BorderStyle::Solid, BorderWidth::Thick),

			_ => unimplemented!("Border style {} is not implemented", border.get_border_style()),
		};

		Some(Border {
			color: border.get_color().clone(),
			style,
			width,
		})
	}

	pub(crate) fn is_none(&self) -> bool {
		self.width == BorderWidth::None
	}

	fn insert_opt(&mut self, other: Option<&umya_spreadsheet::Border>) {
		if let Some(other) = other.and_then(Border::from_umya_border) {
			self.insert(&other);
		}
	}

	fn insert(&mut self, other: &Border) {
		if self.is_none() {
			self.color = other.color.clone();
			self.style = other.style;
			self.width = other.width;
		} else if self.style == other.style && self.width < other.width {
			self.color = other.color.clone();
			self.width = other.width;
		}
	}
}

impl Default for Border {
	fn default() -> Border {
		let mut color = Color::default();
		color.set_indexed(0);
		Border {
			color,
			style: BorderStyle::Solid,
			width: BorderWidth::None,
		}
	}
}

#[derive(Clone, Debug, Default)]
pub struct Borders {
	pub top: Border,
	pub left: Border,
	pub bottom: Border,
	pub right: Border,
}

pub fn get_true_border(worksheet: &Worksheet, col: u32, row: u32, merge: &Merge) -> Borders {
	let border = worksheet.get_style((col + 1, row + 1)).get_borders();

	let mut merge_border_right = None;
	let mut merge_border_bottom = None;
	if merge.column_span > 1 {
		let style = worksheet.get_style((col + merge.column_span, row + 1));
		if let Some(borders) = style.get_borders() {
			merge_border_right = Some(borders.get_right());
		}
	}
	if merge.row_span > 1 {
		let style = worksheet.get_style((col + 1, row + merge.row_span));
		if let Some(borders) = style.get_borders() {
			merge_border_bottom = Some(borders.get_bottom());
		}
	}

	let adjacent_border_right = worksheet
		.get_style((col + merge.column_span + 1, row + 1))
		.get_borders()
		.map(|b| b.get_left());
	let adjacent_border_bottom = worksheet
		.get_style((col + 1, row + merge.row_span + 1))
		.get_borders()
		.map(|b| b.get_top());

	let mut true_border = Borders::default();

	let basic_border = {
		let mut color = Color::default();
		color.set_argb("FFCCCCCC");
		Border {
			color,
			style: BorderStyle::Solid,
			width: BorderWidth::Thin,
		}
	};

	if let Some(border) = border {
		if col == 0 {
			true_border.left.insert_opt(Some(border.get_left()));
			true_border.left.insert(&basic_border);
		}
		if row == 0 {
			true_border.top.insert_opt(Some(border.get_top()));
			true_border.top.insert(&basic_border);
		}
	}

	if let Some(border) = border {
		true_border.right.insert_opt(Some(border.get_right()));
		true_border.bottom.insert_opt(Some(border.get_bottom()));
	}

	true_border.right.insert_opt(merge_border_right);
	true_border.right.insert_opt(adjacent_border_right);
	true_border.bottom.insert_opt(merge_border_bottom);
	true_border.bottom.insert_opt(adjacent_border_bottom);

	true_border.right.insert(&basic_border);
	true_border.bottom.insert(&basic_border);

	true_border
}

pub fn get_true_borders(worksheet: &Worksheet, merges: &[Merge]) -> Vec<Borders> {
	let (columns, rows) = worksheet.get_highest_column_and_row();

	let size = columns * rows;
	let mut borders = vec![Borders::default(); size as usize];

	for r in 0..rows {
		for c in 0..columns {
			let index = (r * columns + c) as usize;
			borders[index] = get_true_border(worksheet, c, r, &merges[index]);
		}
	}

	borders
}
