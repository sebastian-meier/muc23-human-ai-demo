<script lang="ts">
  import FormElement from "./FormElement.svelte";
  export let id = "";
  export let warning = "";
  export let label = "";
  export let description = "";
  export let values: {
    label: string;
    value: number | string;
  }[] = [];
</script>

<FormElement {label} {description} {id} {warning}>
  <ul>
    {#each values as item, index}
      <li>
        <input
          id={`${id}_${index}`}
          type="radio"
          name={id}
          value={item.value}
        />
        <label for={`${id}_${index}`}><strong>{item.label}</strong></label>
      </li>
    {/each}
  </ul>
</FormElement>
