<style lang="scss">
	$width: max(80vw, min(95vw, 700px));

	:global {
		.markdown {
			min-width: $width;
			max-width: $width;

			font-size: 1.125rem;
			color: #D1D5DB;
			line-height: 1.625;

			// strong, em, del {}

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

			// h6 {}

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
				border: #969696 solid 3px;

				thead, tbody {
					tr {
						th, td {
							border: #656565 solid 1px;
							text-align: center;
						}
					}
				}
			}

			// p {}
			// blockquote {}
			// code {}
			// hr {}
			// img {}
			// table, thead, tbody {}

			// dl, dt, dd {}
			// input[type=checkbox] {}
		}
	}
</style>

<div class="markdown">
	<slot/>
</div>
