import Home from "../../views/pages/Index.svelte";
import Taxonomies from "../../views/pages/Taxonomies.svelte";
import Spatial from "../../views/pages/Spatial.svelte";

export const routes = {
  "/": Home,
  "/taxonomies": Taxonomies,
  "/spatial": Spatial,
};
