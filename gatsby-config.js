function wrapESMPlugin(name) {
	return function wrapESM(options) {
		return async (...args) => {
			const mod = await import(name);
			const plugin = mod.default(options);
			return plugin(...args);
		};
	};
}

module.exports = {
	siteMetadata: {
		icon: "/favicon.ico",
		title: "silicon",
	},
	plugins: [
		"gatsby-plugin-sass",

		"gatsby-plugin-react-helmet",

		"gatsby-plugin-image",
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",

		{
			resolve: "gatsby-plugin-mdx",
			options: {
				gatsbyRemarkPlugins: [
					{
						resolve: "gatsby-remark-images",
						options: {
							maxWidth: 1200,
						},
					},
				],
				mdxOptions: {
					remarkPlugins: [
						require("remark-gfm"),
					],
					rehypePlugins: [
						[wrapESMPlugin("rehype-slug-custom-id"), {enableCustomId: true}],
						wrapESMPlugin("rehype-autolink-headings"),
					],
				},
			},
		},

		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "content",
				path: "./content",
				ignore: ["**/drafts/**"]
			},
		},

		// {
		// 	resolve: "gatsby-source-filesystem",
		// 	options: {
		// 		name: "images",
		// 		path: "./content/static/",
		// 	},
		// },

		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "workbooks",
				path: "./content/spreadsheets",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "diagrams",
				path: "./content/diagrams",
			},
		},

		{
			resolve: "gatsby-plugin-manifest",
			options: {
				name: "silicon",
				short_name: "silicon",
				start_url: "/",
				background_color: "#262626",
				theme_color: "#e5e7eb",
				display: "standalone",
				icon: "./static/images/icon.png",
			},
		},
	],
};
