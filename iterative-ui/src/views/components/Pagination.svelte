<script lang="ts">
  import { _ } from "svelte-i18n";

  export let results:number;
  export let max:number;
  export let current:number;
  export let range: number = 5;
</script>

<div class="pagination">
  <span>{$_('results')}: {results}</span>
  <ul>
    {#if current - range > 0}
    <li class:active={current==0} on:click={() => { current=0; }}>1</li>
    <li class="noclick">...</li>
    {/if}

    {#each Array(range * 2 + 1) as _, i}
    {#if current-range+i >= 0 && current-range+i < max}
    <li on:click={() => { current=current-range+i; }} class:active={i === range}>{current-range+i+1}</li>
    {/if}
    {/each}

    {#if max - current - range - 1 > 0}
    <li class="noclick">...</li>
    <li class:active={current==max-1} on:click={() => { current=(max-1); }}>{max}</li>
    {/if}
  </ul>
</div>