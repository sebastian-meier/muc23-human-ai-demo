<script lang="ts">
  import { link, location } from "svelte-spa-router";

  export let menu: {
    url: string;
    label: string;
    protected: boolean;
    role?: string[];
  }[] = [];

  $: allowedMenu = menu.filter((item) => {
    return true;
  });

  $: cLocation = $location;
</script>

<div class="menu">
  <ul>
    {#each allowedMenu as item}
      <li>
        <a
          href={item.url}
          class:active={(item.url !== "/" &&
            cLocation.indexOf(item.url) === 0) ||
            (item.url === "/" && cLocation === item.url)}
          use:link>{item.label}</a
        >
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .menu {
    margin-left: 10px;
  }
</style>
