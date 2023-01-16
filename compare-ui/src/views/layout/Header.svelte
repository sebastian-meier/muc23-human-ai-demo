<script>
  import Menu from "../components/Menu.svelte";

  const menu = [
    { url: "/", label: "Home", protected: false },
    { url: "/spatial", label: "Spatial", protected: false },
    { url: "/taxonomies", label: "Taxonomies", protected: false },
  ];
</script>

<header>
  <nav>
    <Menu {menu} />
  </nav>
</header>
