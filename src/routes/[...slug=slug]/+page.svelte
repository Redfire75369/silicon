<script lang="ts">
	import type {PageData} from "./$types";
	import Header from "../../components/Header.svelte";

	export let data: PageData;

	const {body, metadata} = data;
</script>

<style lang="scss">
	$width: max(80vw, min(95vw, 700px));

	:global(body) {
		margin: 0;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		min-height: calc(100vh - 40px);

		font-family: Helvetica, Arial, sans-serif;
		background: linear-gradient(#2A2A2A, #1C1C1C);

		padding-bottom: 40px
	}

	.markdown {
		min-width: $width;
		max-width: $width;

		font-size: 1.125rem;
		color: #D1D5DB;
		line-height: 1.625;

		strong, em, del {}

		h1, h2, h3, h4, h5, h6 {
			color: #E5E7EB;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.875rem;
		}

		h3 {
			font-size: 1.625rem;
		}

		h4 {
			font-size: 1.375rem;
		}

		h5 {
			font-size: 1.25rem;
		}

		h6	{}

		p, blockquote {
			margin: 0 1.5rem;
		}

		a {
			color: #FDE68A;
		}

		ol, ul {
			margin: 0 1rem;
			padding: 0 0.75rem;
		}

		li {
			padding: 0 0.5rem;

			p {
				margin: 0;
			}

			ol, ul {
				margin: 0 0.5rem;
			}
		}

		table {
			border-spacing: 0;
			margin: auto;
			border: #CBCBCB solid 3px;

			thead, tbody {
				tr {
					th, td {
						border: #CBCBCB solid 1px;
						text-align: center;
					}
				}
			}
		}

		p {}
		blockquote {}
		code {}
		hr {}
		img {}
		table, thead, tbody {}

		dl, dt, dd {}
		input[type=checkbox] {}
	}
</style>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>

<div class="container">
	<Header title={metadata.title}/>
	<div class="markdown">
		<svelte:component this={body}/>
	</div>
</div>