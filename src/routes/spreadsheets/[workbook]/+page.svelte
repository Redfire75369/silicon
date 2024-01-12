<script lang="ts">
	import Meta from "components/Meta.svelte";
	import Workbook from "components/spreadsheet/Workbook.svelte";
	import "./global.scss";

	import type {PageData} from "./$types";

	export let data: PageData;

	const {meta, worksheets} = data;
	const keys = Object.keys(meta.sheets);
	const names = keys.map(key => meta.sheets[key][0]);
</script>

<Meta title={`Spreadsheet: ${meta.name}`} author="Redfire"/>

<Workbook {keys} {names} {worksheets}/>
