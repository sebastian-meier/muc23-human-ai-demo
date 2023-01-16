import { writable, Writable, Readable, derived } from 'svelte/store';

import {questions as allQuestions, vptree, vptreeReady, embeddings} from './questions';

export const detailId: Writable<number> = writable(null);
export const limit: Writable<number> = writable(10);

export const cache: Readable<publicQuestion> = derived(
  [
    detailId, allQuestions
  ],
  ([
    $detailId, $allQuestions
  ], 
  set) => {
    if ($detailId != null && $allQuestions && $allQuestions.length > 0) {
      set($allQuestions[$detailId]);
    }
  }
);

export const newClusterIds: Writable<number[]> = writable([]);
export const clusterIds: Readable<number[]> = derived(
  [detailId, newClusterIds],
  ([$detailId, $newClusterIds], set) => {
    set([...$newClusterIds, ...[$detailId]])
  }
);

export const questions: Readable<publicQuestion[]> = derived(
  [clusterIds, limit, cache, allQuestions, vptreeReady, embeddings],
  ([$clusterIds, $limit, $cache, $allQuestions, $vptreeReady, $embeddings], set) => {
    (async() => {
      if ($clusterIds.length > 0 && $cache && $vptreeReady) {
        const allHits = [];
        $clusterIds.forEach(c => {
          const hits = vptree.search($embeddings[c], $limit).map(s => s.i);
          hits.forEach(h => {
            h = parseInt(h);
            if (!allHits.includes(h) && h !== $cache.id) {
              allHits.push(h);
            }
          });
        });
        set(allHits.map(a => {
          return $allQuestions[a];
        }));
      } else {
        set([]);
      }
    })();
  }
);

export const ignoredIds: Writable<number[]> = writable([]);

export const relatedIds: Readable<number[]> = derived(
  [questions,clusterIds,ignoredIds],
  ([$questions,$clusterIds,$ignoredIds], set) => {
    if ($questions && $questions.length > 0) {
      const ids = $questions.map((q) => q.id);
      set(ids.filter((id) => !$clusterIds.includes(id) && !$ignoredIds.includes(id)));
    } else {
      set([]);
    }
  }
);

export const clusterQuestions: Readable<publicQuestion[]> = derived(
  [questions,clusterIds],
  ([$questions, $clusterIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $clusterIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);

export const relatedQuestions: Readable<publicQuestion[]> = derived(
  [questions,relatedIds],
  ([$questions, $relatedIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $relatedIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);

export const ignoredQuestions: Readable<publicQuestion[]> = derived(
  [questions,ignoredIds],
  ([$questions, $ignoredIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $ignoredIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);