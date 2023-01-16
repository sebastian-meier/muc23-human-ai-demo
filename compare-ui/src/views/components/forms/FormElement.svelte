<script lang="ts">
  export let label = "";
  export let description = "";
  export let warning = "";
  export let id = "";
  export let tight = false;
</script>

<div class="form-el" class:tight>
  {#if label !== ""}
    <label for={id}>{label}</label>
  {/if}
  {#if description !== ""}
    <p>{description}</p>
  {/if}
  <slot />
  {#if warning !== ""}
    <p class="warning">{warning}</p>
  {/if}
</div>
