<script>
	import Container from "components/Container.svelte";
	import Header from "components/header/Header.svelte";
	import Markdown from "components/Markdown.svelte";
	import Meta from "components/Meta.svelte";
</script>

<Meta title="Diagrams" author="Redfire"/>

<Container>
	<Header>Diagrams</Header>
	<Markdown>
		<ul>
			<li>
				Mesh Diagrams
				<ul>
					<li><a href="mesh/skylake/">Skylake-SP (SKX-SP)</a></li>
					<li><a href="mesh/cascade-lake/">Cascade Lake-SP (ICX-SP)</a></li>
					<li><a href="mesh/ice-lake/">Ice Lake-SP (ICX-SP)</a></li>
					<li><a href="mesh/sapphire-rapids/">Sapphire Rapids-SP (SPR-SP)</a></li>
					<li><a href="mesh/emerald-rapids/">Emerald Rapids-SP (EMR-SP)</a></li>
				</ul>
			</li>
		</ul>
	</Markdown>
</Container>
