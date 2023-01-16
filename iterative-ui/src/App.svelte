<script>
  import Router from 'svelte-spa-router'
  import Footer from './views/layout/footer.svelte'
  import Header from './views/layout/header.svelte'
  import { routes } from './lib/routes/root'
</script>

<Header />
<main>
  <Router {routes} />
</main>
<Footer />

<style lang="scss" global>
	@import 'styles/vars';
	@import 'styles/global';
  @import 'styles/form';
  @import 'styles/header';
  @import 'styles/footer';
  @import 'styles/datatables';
  @import 'styles/survey';
  @import 'styles/pagination';
  @import 'styles/admin';
</style>