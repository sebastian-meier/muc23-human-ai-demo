<script lang="ts">
  import { v4 as uuid } from "uuid";
  import { onMount } from "svelte";
  import { color as rgb } from "d3-color";
  import { selectedCluster, selectedClusterDetails, selectedCustomClusterDetails, selectedPosition, positions as rawPositions } from "../../stores/taxonomies";
  import { taxonomies, taxonomyMap } from "../../stores/custom_taxonomies";

  export let index = 0;
  export let setActiveIndex;
  export let active: boolean;

  export let type = "";
  export let key = "";
  $: label = `${type} - ${key}`;

  export let clusterMode: boolean;

  export let positions: [number, number][] = [];
  export let clusters: number[][];
  export let selected: number[] = [];
  export let selectedNeighbors: number[] = [];
  export let color: any;

  let width = 150;
  let height = 150;
  let padding = 5;
  const id = "uuid_" + uuid().split("-").join("_");
  let min = [0, 0];
  let max = [0, 0];

  const x = (p: [number, number]): number => {
    return (
      padding + ((p[0] - min[0]) / (max[0] - min[0])) * (width - padding * 2)
    );
  };

  const y = (p: [number, number]): number => {
    return (
      padding + ((p[1] - min[1]) / (max[1] - min[1])) * (height - padding * 2)
    );
  };

  let ready = false;
  onMount(() => {
    ready = true;
  });

  const colorAlpha = (color: {r:number, g:number, b:number}, transparency: number) => {
    return `rgba(${color.r},${color.g},${color.b},${transparency})`;
  };

  $: {
    if (ready) {
      const canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      min = [positions[0][0], positions[0][1]];
      max = [positions[0][0], positions[0][1]];
      positions.forEach((p) => {
        if (p[0] < min[0]) {
          min[0] = p[0];
        }
        if (p[1] < min[1]) {
          min[1] = p[1];
        }
        if (p[0] > max[0]) {
          max[0] = p[0];
        }
        if (p[1] > max[1]) {
          max[1] = p[1];
        }
      });

      positions.forEach((p, pi) => {
        const pC = pi in $taxonomyMap
          ? $taxonomies[$taxonomyMap[pi]].color
          : [150,150,150,1];
        const pColor = clusterMode
          ? {r: pC[0], g: pC[1], b: pC[2]}
          : pi < clusters.length && clusters[pi][$selectedCluster] >= 0
            ? rgb(color(clusters[pi][$selectedCluster].toString()))
            : {r: 150, g: 150, b: 150};

        ctx.fillStyle =
          clusterMode
            ? $selectedCustomClusterDetails != null
              ? $selectedCustomClusterDetails === $taxonomyMap[pi]
                ? colorAlpha(pColor, 1)
                : colorAlpha(pColor, 0.2)
              : $selectedClusterDetails != null 
                ? $rawPositions[$selectedPosition].clusters[pi][$selectedCluster] === $selectedClusterDetails
                  ? colorAlpha(pColor, 1)
                  : colorAlpha(pColor, 0.2)
                : colorAlpha(pColor, 1)
            : $selectedClusterDetails != null
              ? $selectedClusterDetails === clusters[pi][$selectedCluster] && $selectedPosition === index
                ? colorAlpha(pColor, 1)
                : $rawPositions[$selectedPosition].clusters[pi][$selectedCluster] === $selectedClusterDetails
                  ? colorAlpha(pColor, 1)
                  : colorAlpha(pColor, 0.2)
              : $selectedCustomClusterDetails != null
                ? pi in $taxonomyMap && $selectedCustomClusterDetails === $taxonomyMap[pi]
                  ? colorAlpha(pColor, 1)
                  : colorAlpha(pColor, 0.2)
                : colorAlpha(pColor, 1);
        ctx.beginPath();
        ctx.arc(x(p), y(p), 1, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
</script>

<div
  on:click={() => setActiveIndex(index)}
  class="tsne-container"
  style="--tsne-width: {width}px; --tsne-height: {height}px;"
>
  <div>
    <canvas {id} {width} {height} />
    <svg {width} {height}>
      {#if ready}
        {#each selectedNeighbors as s}
          <circle
            class="selection"
            cx={x(positions[s])}
            cy={y(positions[s])}
            r="3"
          />
        {/each}
        {#each selected as s}
          <circle
            class="selection"
            cx={x(positions[s])}
            cy={y(positions[s])}
            r="7"
          />
        {/each}
      {/if}
    </svg>
  </div>
  <p><span class:active={active}>{label}</span></p>
</div>

<style lang="scss">
  @import "../../styles/globals/colors";

  .tsne-container {
    display: flex;
    flex-direction: column;
    & > div {
      position: relative;
      overflow: hidden;
      width: var(--tsne-width);
      height: var(--tsne-height);
    }
  }

  canvas {
    position: relative;
    top: 0;
    left: 0;
  }

  svg {
    position: relative;
    left: 0;
    top: calc(-1 * var(--tsne-width));
  }

  circle.selection {
    fill: rgba(255, 255, 255, 0.7);
    stroke-width: 2px;
    stroke: #000;
  }

  p {
    padding-top: 0px;
    padding-bottom: 0px;
    margin-top:0px;
    margin-bottom:8px;
    display: block;
    width: 100%;
    text-align: center;
  }

  span {
    font-size: 10px;
    background-color: $color__accent-medium;
    color: white;
    border-radius: 10px;
    padding: 2px 7px;
    font-weight: bold;
    &.active {
      background-color: $color__accent-dark;
    }
  }
</style>
