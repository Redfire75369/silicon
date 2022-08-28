import type {GatsbyConfig} from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		icon: "/favicon.ico",
		title: "silicon",
	},
	plugins: [
		"gatsby-plugin-typescript",
		"gatsby-plugin-sass",

		"gatsby-plugin-react-helmet",

		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "content",
				path: "./content",
				ignore: ["**/drafts/**"]
			},
		},

		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./content/static/",
			},
		},

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
			resolve: "gatsby-source-filesystem",
			options: {
				name: "pages",
				path: "./src/pages/",
			},
		},

		"gatsby-plugin-image",
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",

		{
			resolve: "gatsby-plugin-mdx",
			options: {
				gatsbyRemarkPlugins: [
					{
						resolve: "gatsby-remark-autolink-headers",
						options: {
							enableCustomId: true,
						}
					},
					{
						resolve: "gatsby-remark-grid-tables",
					},
					{
						resolve: "gatsby-remark-relative-images",
						options: {
							staticFolderName: "static",
						},
					},
					{
						resolve: "gatsby-remark-images",
						options: {
							maxWidth: 1200,
						},
					},
				],
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

export default config;
