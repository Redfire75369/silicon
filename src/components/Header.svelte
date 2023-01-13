<script>
	export let title;
</script>

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

			a {
				display: flex;
				flex-direction: row;
				margin-left: 0.25rem;
				margin-right: 0.25rem;

				img {
					margin-top: 0.5rem;
					align-self: center;
					justify-self: center;
					height: 5rem;
					width: 5rem;
				}

				img.small {
					height: 2.25rem;
					width: 2.25rem;
				}
			}

			.title {
				text-align: center;
				min-width: calc(#{$width} - 11rem);
				max-width: calc(#{$width} - 11rem);

				h1 {
					font-size: 2.5rem;
					color: #E5E7EB;
				}
			}
		}
	}
</style>

<div class="header">
	<div class="header-inner">
		<a href="/">
			<img src="/images/icon.png">
		</a>
		<div class="title">
			<h1>{title}</h1>
		</div>
		<a href="https://mastodon.online/@redfire" rel="me">
			<img src="/images/mastodon.png" alt="Mastodon" class="small">
		</a>
	</div>
</div>
