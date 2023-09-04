import { Writable, writable, derived } from "svelte/store";

export const types: string[] = [
  // 'nnlm_de_norm',
  // 'nnlm_de',
  // 'nnlm_norm',
  // 'nnlm',
  // 'use_large',
  // 'use_multi',
  "use",
];

export const files: string[] = [
  "cosine-cluster",

  "cosine-tsne-5",
  "cosine-tsne-cluster-5",
  "cosine-tsne-20",
  "cosine-tsne-cluster-20",
  "cosine-tsne-50",
  "cosine-tsne-cluster-50",

  "euclidean-cluster",

  "euclidean-tsne-5",
  "euclidean-tsne-cluster-5",
  "euclidean-tsne-20",
  "euclidean-tsne-cluster-20",
  "euclidean-tsne-50",
  "euclidean-tsne-cluster-50",

  "matrix-cosine-mini",
  "matrix-euclidean-mini",
];

export const pcaVersions: { [key: string]: (number | null)[] } = {
  'nnlm': [32, 64, null],
  'use': [null], // [32, 64, 128, 256, null],
};

export const positionIds: number[] = [1, 3, 5, 8, 10, 12];
export const clusterIds: { [key: number]: number[] } = {
  1: [0, 2],
  3: [0, 4],
  5: [0, 6],
  8: [7, 9],
  10: [7, 11],
  12: [7, 13],
};

export const matrixIds = [14, 15];

export const labels: Writable<string[]> = writable([]);
export const clusterLabels: Writable<ClusterLabels> = writable({});
export const ready: Writable<boolean> = writable(false);
export const positions: Writable<Positions> = writable([]);
// Cluster for vis in small multiples
export const selectedCluster: Writable<number> = writable(1);
export const selection: Writable<number[]> = writable([]);
export const selectedPosition: Writable<number> = writable(1);
// Individual cluster within selected Cluster
export const selectedClusterDetails: Writable<number> = writable(null);
export const selectedCustomClusterDetails: Writable<number> = writable(null);
export const selectedMatrix: Writable<number> = writable(0);
export const matrices: Writable<Matrices> = writable([]);
export const neighbors: Writable<number[]> = writable([]);
export const neighborId = derived(selectedPosition, ($selectedPosition) =>
  Math.floor($selectedPosition / positionIds.length)
);

export type Matrices = number[][][][];

export type Positions = {
  type: string;
  pca: number;
  clusterLabels: {
    [key: number]: string
  },
  key: string;
  positions: [number, number][];
  clusters: number[][];
  clusterList: {
    [key: number]: {
      key: number;
      count: number;
    }[];
  };
}[];

export type ClusterLabels = {
  [key: string]: {
    [key: string]: string
  }
}

const tsvLoader = (file: string): Promise<string[][]> => {
  return fetch(file)
    .then((response) => response.text())
    .then((tsv) => {
      // remove empty last line
      if (tsv.length - tsv.lastIndexOf("\n") === 1) {
        tsv = tsv.substr(0, tsv.length - 1);
      }
      const lines = tsv.split("\n");
      return lines.map((line) => line.split("\t"));
    });
};

const jsonLoader = (file: string): Promise<{}> => {
  return fetch(file)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
};

export const load: () => Promise<void> = async () => {
  const metas: {
    pca: number;
    type: string;
  }[] = [];
  const data = [];
  for (let ti = 0; ti < types.length; ti += 1) {
    let pcas: (number | null)[] = [];
    Object.keys(pcaVersions).forEach((key) => {
      if (types[ti].indexOf(key) > -1) {
        pcas = pcaVersions[key];
      }
    });
    for (let pi = 0; pi < pcas.length; pi += 1) {
      metas.push({
        pca: pcas[pi],
        type: types[ti],
      });
      data.push([]);
      for (let fi = 0; fi < files.length; fi += 1) {
        data[data.length - 1].push(
          await tsvLoader(
            __global.env.SITE_URL + `data/${pcas[pi] ? pcas[pi] + "_" : ""}${types[ti]}-${
              files[fi]
            }.tsv`
          )
        );
      }
    }
  }

  const labelData = await tsvLoader(__global.env.SITE_URL + `data/use-metadata.tsv`);
  labels.set(labelData.map((lines) => lines[0]));

  const tempClusterLabels = await jsonLoader(__global.env.SITE_URL + `data/clusterLabels.json`);
  clusterLabels.set(tempClusterLabels);

  const tempPositions: Positions = [];
  const tempMatrices: Matrices = [];
  data.forEach((d, di) => {
    const tempMatricesGroup: number[][][] = [];
    matrixIds.forEach((id) => {
      tempMatricesGroup.push(d[id]);
    });
    tempMatrices.push(tempMatricesGroup);

    positionIds.forEach((id) => {
      const tempCoordinates: [number, number][] = [];
      const tempClusters: number[][] = [];
      const tempClusterLists: {
        [key: number]: { key: number; count: number }[];
      } = {};
      d[id].forEach((line) => {
        tempCoordinates.push([parseFloat(line[0]), parseFloat(line[1])]);
      });
      clusterIds[id].forEach((cid, cii) => {
        const tempClusterList: { key: number; count: number }[] = [];
        const tempClusterMap: { [key: number]: number } = {};
        d[cid].forEach((cluster, ci) => {
          if (tempClusters.length < ci + 1) {
            tempClusters.push([]);
          }
          tempClusters[ci].push(parseInt(cluster[0]));
          if (!(cluster[0] in tempClusterMap)) {
            tempClusterList.push({
              key: parseInt(cluster[0]),
              count: 0,
            });
            tempClusterMap[cluster[0]] = tempClusterList.length - 1;
          }
          tempClusterList[tempClusterMap[cluster[0]]].count += 1;
        });
        tempClusterLists[cii] = tempClusterList;
      });
      tempPositions.push({
        pca: metas[di].pca,
        type: metas[di].type,
        key: files[id],
        positions: tempCoordinates,
        clusters: tempClusters,
        clusterLabels: tempClusterLabels[id],
        clusterList: tempClusterLists,
      });
    });
  });

  positions.set(tempPositions);
  matrices.set(tempMatrices);
  ready.set(true);
};
