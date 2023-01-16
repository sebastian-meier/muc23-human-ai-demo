<script lang="ts">
  import FormElement from "./FormElement.svelte";
  export let id = "";
  export let rows = 7;
  export let warning = "";
  export let label = "";
  export let description = "";
</script>

<FormElement {label} {description} {id} {warning}>
  <textarea name={id} {rows} />
</FormElement>
