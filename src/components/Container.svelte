<style lang="scss">
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
</style>

<div class="container">
	<slot/>
</div>
