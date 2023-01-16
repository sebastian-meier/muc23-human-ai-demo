import { Writable, writable, derived, Readable } from "svelte/store";

export type Taxonomy = {
  name: string;
  color: [number, number, number, number];
  ids: number[];
};

const initTaxonomies = JSON.parse(localStorage.getItem("taxonomies") || "[]").map(t => {
  t.ids = t.ids.map(id => parseInt(id.toString()));
  return t;
});
export const taxonomies: Writable<Taxonomy[]> = writable(initTaxonomies);
taxonomies.subscribe((taxonomies) => {
  localStorage.setItem("taxonomies", JSON.stringify(taxonomies));
});

export const taxonomyMap: Readable<{ [key: number]: number }> = derived(
  taxonomies,
  ($taxonomies) => {
    const map: { [key: number]: number } = {};
    $taxonomies.forEach((t, ti) => {
      t.ids.forEach((id) => {
        map[id] = ti;
      });
    });
    return map;
  }
);
