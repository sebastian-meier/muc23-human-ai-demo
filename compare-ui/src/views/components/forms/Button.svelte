<script lang="ts">
  export let label = "";
  export let type = "";
  export let bold = true;
  export let back = false;
  export let stretch = false;
  export let invert = false;
</script>

<button on:click class={type} class:stretch class:invert>
  {#if back}
    <b>←</b>&nbsp;
  {/if}
  {#if bold}
    <strong>{label}</strong>
  {:else}
    {label}
  {/if}
</button>
