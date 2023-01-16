<script>
  import Router from "svelte-spa-router";
  import Header from "./views/layout/Header.svelte";
  import { routes } from "./lib/routes/root";
</script>

<div class="hasHeader">
  <Header />
  <main>
    <Router {routes} />
  </main>
</div>

<style lang="scss" global>
  @import "styles/index";
</style>
