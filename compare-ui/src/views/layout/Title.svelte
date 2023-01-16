<script lang="ts">
  export let title = "";
  export let linkClass: string | null = null;
  export let link: string | null = null;
  export let linkLabel: string | null = null;
</script>

<h2 class="title">
  <span>{title}</span>
  {#if link && link.length > 0}
    <a href={link} class={linkClass}>{linkLabel}<span /></a>
  {/if}
</h2>
