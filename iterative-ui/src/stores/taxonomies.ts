import { derived, Readable, writable, Writable } from 'svelte/store';

export const taxonomies: Writable<Taxonomy[]> = writable(null);
export const taxonomyId: Writable<number> = writable(null);

let loaded = false;

export const load = (): void => {
  if (!loaded) {
    loaded = true;
    fetch("https://media.githubusercontent.com/sebastian-meier/chi23-human-ai-demo/main/iterative-ui/public/data/demo-taxonomies.json")
      .then((response) => response.json())
      .then((response) => {
        taxonomies.set(response);
      });
  }
};
