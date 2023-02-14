<script lang="ts">
	import Workbook from "components/spreadsheet/Workbook.svelte";

	import type {PageData} from "./$types";

	export let data: PageData;

	const {keys, names, worksheets} = data;
</script>

<Workbook {keys} {names} {worksheets}/>
