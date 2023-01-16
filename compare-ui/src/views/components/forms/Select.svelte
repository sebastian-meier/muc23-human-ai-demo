<script lang="ts">
  import FormElement from "./FormElement.svelte";

  export let id = "";
  export let warning = "";
  export let label = "";
  export let description = "";
  export let value = "";
  export let values: {
    label: string;
    value: number | string;
  }[] = [];
</script>

<FormElement {label} {description} {id} {warning}>
  <select bind:value>
    <option disabled={true}>Please choose</option>
    {#each values as item}
      <option value={item.value}>{item.label}</option>
    {/each}
  </select>
</FormElement>
