<script>
  import Menu from "../components/Menu.svelte";

  const menu = [
    { url: "/", label: "Taxonomies", protected: false },
  ];
</script>

<header>
  <nav>
    <Menu {menu} />
  </nav>
</header>
