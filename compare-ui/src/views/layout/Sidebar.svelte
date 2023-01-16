<script lang="ts">
  import { _ } from "svelte-i18n";

  export let backlink = "";
  export let headline = "";
</script>

<div class="sidebar">
  {#if backlink !== ""}
    <a class="topline" href={backlink}><b>←</b> {$_("backlink")}</a>
  {/if}
  {#if headline !== ""}
    <h2>{headline}</h2>
  {/if}
  <slot />
</div>
