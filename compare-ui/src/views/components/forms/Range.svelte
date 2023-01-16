<script lang="ts">
  import FormElement from "./FormElement.svelte";

  export let id = "";
  export let warning = "";
  export let label = "";
  export let description = "";
  export let min = 0;
  export let max = 10;
  export let step = 1;

  let width: number;

  const labelMinWidth = 36;
  $: labelCount = width ? Math.floor(width / labelMinWidth) : 1;
  $: {
    console.log(labelCount, min, max);
  }
</script>

<FormElement {label} {description} {id} {warning}>
  <div class="range" bind:clientWidth={width}>
    <input type="range" name={id} {min} {max} {step} />
    <ul>
      {#each new Array(labelCount + 1) as a, index}
        <li>{(min + index * ((max - min) / labelCount)).toFixed(1)}</li>
      {/each}
    </ul>
  </div>
</FormElement>
