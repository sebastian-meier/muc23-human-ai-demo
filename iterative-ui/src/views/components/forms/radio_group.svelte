<script type="ts">
  export let id = 'radio';
  export let group: { label: string, value: string | number}[] = [];
  export let value: string | number = null;
</script>

<div class="radio-field">
  {#each group as item, i}
    <label for={`${id}-${i}`}>
      <span>{item.label}</span><br />
      <input type="radio" id={`${id}-${i}`} value={item.value} bind:group={value} />
    </label>    
  {/each}
</div>