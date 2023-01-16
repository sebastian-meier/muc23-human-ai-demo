import { writable, Writable } from 'svelte/store';
import {euclidean} from 'ml-distance-euclidean';
import * as VPTreeFactory from 'vptree';

export const questions: Writable<publicQuestion[]> = writable(null);
export const questionId: Writable<number> = writable(null);
export const embeddings: Writable<number[][]> = writable([]);
export const vptreeReady: Writable<boolean> = writable(false);

export let vptree;
let loaded = false;

export const load = async(): Promise<boolean> => {
  if (!loaded) {
    loaded = true;
    await fetch('./data/questions.txt')
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        questions.set(response.split('\n').map((r, ri) => {
          return {
            id: ri, 
            question_de: r,
            description_de: '',
            participantSynonym: '', 
            created: '',
            relation: '',
            tsne_x: 0,
            tsne_y: 0,
            liked: false,
            state: '',
            has_reply: false,
            sentiment_summary: '',
            sonar_all: '',
            profanityfilter: 0,
            taxonomies: [],
            replies: [],
          };
        }));
      });
    await fetch('./data/embeddings.csv')
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const e = response.split('\n').map(r => {
          return r.split(',').map(d => parseFloat(d));
        });
        embeddings.set(e);

        vptree = VPTreeFactory.build(e, euclidean);
        vptreeReady.set(true);
      });
    return true;
  } else {
    return true;
  }
}