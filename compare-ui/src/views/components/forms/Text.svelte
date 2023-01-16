<script lang="ts">
  import FormElement from "./FormElement.svelte";
  export let id = "";
  export let warning = "";
  export let label = "";
  export let description = "";
  export let placeholder = "";
  export let tight = false;
  export let value = "";
</script>

<FormElement {label} {description} {id} {warning} {tight}>
  <input type="text" {placeholder} name={id} bind:value />
</FormElement>
