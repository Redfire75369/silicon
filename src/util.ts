export function slugify(relativePath) {
	const slug = `/${relativePath.replace(".mdx", "")}/`;
	if (slug.endsWith("/index/")) {
		return slug.replace("index/", "");
	}
	return slug;
}
