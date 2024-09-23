use std::borrow::Cow;
use std::sync::OnceLock;

use css_style::{
	border::{BorderStyle, Side, Width},
	color::palette::rgb::{Rgba, Rgb},
	style,
	text::{TextAlign, VerticalAlign},
	unit::{Length, Px},
	Color,
};
use umya_spreadsheet::{drawing::Theme, new_file, EnumTrait, Worksheet};

use crate::worksheet::border::{Border, Borders};

pub static THEME: OnceLock<Theme> = OnceLock::new();

pub fn init_theme() {
	let workbook = new_file();
	let theme = workbook.get_theme();
	let _ = THEME.set(theme.clone());
}

fn umya_to_css_color(color: &umya_spreadsheet::Color) -> Color {
	let theme = THEME.get().unwrap();
	let mut argb = color.get_argb_with_theme(theme);
	if argb == "" {
		argb = Cow::Borrowed("000000");
	}
	argb_to_color(&argb)
}

fn argb_to_color(argb: &str) -> Color {
	if argb.len() == 6 {
		let red = u8::from_str_radix(&argb[0..2], 16).unwrap();
		let green = u8::from_str_radix(&argb[2..4], 16).unwrap();
		let blue = u8::from_str_radix(&argb[4..6], 16).unwrap();

		Color::RgbU8(Rgb::new(red, green, blue))
	} else if argb.len() == 8 {
		let alpha = u8::from_str_radix(&argb[0..2], 16).unwrap();
		let red = u8::from_str_radix(&argb[2..4], 16).unwrap();
		let green = u8::from_str_radix(&argb[4..6], 16).unwrap();
		let blue = u8::from_str_radix(&argb[6..8], 16).unwrap();

		Color::RgbaU8(Rgba::new(red, green, blue, alpha))
	} else {
		panic!("Invalid Color '{argb}");
	}
}

fn border_to_css(border: &Border) -> impl FnOnce(Side) -> Side {
	let color = umya_to_css_color(&border.color);
	let width = Width::Length(Length::Px(Px::from(border.width.into_int() as i32)));
	move |side| side.color(color).width(width).style(BorderStyle::Solid)
}

pub fn get_css_style(worksheet: &Worksheet, col: u32, row: u32, cell_border: &Borders) -> String {
	let mut css = style();
	let style = worksheet.get_style((col + 1, row + 1));

	if let Some(color) = style.get_font().map(|f| f.get_color()) {
		css = css.and_text(|text| text.color(umya_to_css_color(color)));
	}

	if let Some(color) = style.get_background_color() {
		css = css.and_background(|bg| bg.color(umya_to_css_color(color)));
	}

	if let Some(alignment) = style.get_alignment() {
		use umya_spreadsheet::HorizontalAlignmentValues as HAV;
		use umya_spreadsheet::VerticalAlignmentValues as VAV;

		let horizontal = match alignment.get_horizontal() {
			HAV::Center | HAV::General => TextAlign::Center,
			HAV::Justify => TextAlign::Justify,
			HAV::Left => TextAlign::Left,
			HAV::Right => TextAlign::Start,
			_ => unimplemented!(
				"Horizontal Alignment {} is not supported",
				alignment.get_horizontal().get_value_string()
			),
		};
		let vertical = match alignment.get_vertical() {
			VAV::Center => VerticalAlign::Middle,
			VAV::Top => VerticalAlign::Top,
			VAV::Bottom => VerticalAlign::Bottom,
			_ => unimplemented!(
				"Vertical Alignment {} is not supported",
				alignment.get_vertical().get_value_string()
			),
		};

		css = css.and_text(|text| text.align(horizontal).vertical_align(vertical));
	}

	if col == 0 && cell_border.left.is_none() {
		css = css.and_border(|border| border.and_left(border_to_css(&cell_border.left)));
	}
	if row == 0 && cell_border.top.is_none() {
		css = css.and_border(|border| border.and_top(border_to_css(&cell_border.top)));
	}
	css = css.and_border(|border| border.and_right(border_to_css(&cell_border.right)));
	css = css.and_border(|border| border.and_bottom(border_to_css(&cell_border.bottom)));

	css.to_css().unwrap()
}
