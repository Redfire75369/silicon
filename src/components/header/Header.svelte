<div class="header">
	<div class="header-inner">
		<a href="/" aria-label="Homepage" class="link">
			<enhanced:img src="./icon.png" alt="Silicon Logo" />
		</a>
		<div class="title">
			<h1>
				<slot />
			</h1>
		</div>
		<a
			href="https://mastodon.online/@redfire"
			rel="me"
			aria-label="Mastodon"
			class="link"
		>
			<enhanced:img
				src="./mastodon.png"
				alt="Mastodon Logo"
				class="small"
			/>
		</a>
	</div>
</div>

<style lang="scss">
	$width: max(80vw, min(95vw, 700px));

	.header {
		min-width: $width;
		max-width: $width;
		margin: 0.5rem 0;

		.header-inner {
			display: flex;
			flex-direction: row;
			justify-content: start;

			.title {
				text-align: center;
				min-width: calc(#{$width} - 11rem);
				max-width: calc(#{$width} - 11rem);

				h1 {
					font-size: 2.5rem;
					color: #e5e7eb;
				}
			}
		}
	}

	.link {
		margin-left: 0.25rem;
		margin-right: 0.25rem;

		picture {
			margin-top: 0.7rem;
			display: flex;
			height: 5rem;
			width: 5rem;

			img {
				align-self: center;
				justify-self: center;
				height: 5rem;
				width: 5rem;
			}

			.small {
				height: 3rem;
				width: 3rem;
				margin: auto;
			}
		}
	}
</style>
