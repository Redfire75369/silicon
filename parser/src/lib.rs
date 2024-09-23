use std::panic;

use wasm_bindgen::prelude::wasm_bindgen;

mod worksheet;

#[wasm_bindgen(start)]
pub fn main() {
	panic::set_hook(Box::new(console_error_panic_hook::hook));

	worksheet::style::init_theme();
}
