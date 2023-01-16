<script lang="ts">
  import FormElement from "./FormElement.svelte";
  export let id = "";
  export let warning = "";
  export let label = "";
  export let description = "";
  export let checked = false;
  export let labelLeft = "Ja";
  export let labelRight = "Nein";
</script>

<FormElement {label} {description} {id} {warning}>
  <div class="toggle">
    <span class:inactive={checked}>{labelLeft}</span>
    <label for={id}>
      <input type="checkbox" bind:checked {id} />
      <span />
    </label>
    <span class:inactive={!checked}>{labelRight}</span>
  </div>
</FormElement>
