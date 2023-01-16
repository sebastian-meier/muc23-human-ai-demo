<script lang="ts">
  import {
    load,
    ready,
    neighborId,
    matrices,
    selectedMatrix,
    neighbors,
    positions,
    labels,
    selection,
    selectedPosition,
    selectedCluster,
    selectedClusterDetails,
  } from "../../stores/taxonomies";
  import { taxonomies, taxonomyMap } from "../../stores/custom_taxonomies";
  import TSNE from "../components/TSNE.svelte";
  import SelectList from "../components/SelectList.svelte";
  import { onMount } from "svelte";
  import { scaleOrdinal } from "d3-scale";
  import { schemeCategory10 } from "d3-scale-chromatic";
  import Loading from "../components/Loading.svelte";
  import Select from "../components/forms/Select.svelte";
  import Toggle from "../components/forms/Toggle.svelte";
  import Text from "../components/forms/Text.svelte";
  import Button from "../components/forms/Button.svelte";
  import ColorPicker from "../components/forms/ColorPicker.svelte";
  import type {Taxonomy} from "../../stores/custom_taxonomies";
  import {Pencil, Trash} from 'svelte-bootstrap-icons';

  onMount(() => {
    if (!$ready) {
      load();
    }
  });

  $: localReady = $ready;

  $: clusters = $ready
    ? $positions[$selectedPosition].clusterList[$selectedCluster].sort(
        (a, b) => b.count - a.count
      )
    : [];
  $: clusterLabels =
    $ready && $selectedClusterDetails != null
      ? $labels.map((l, li) => {
        return {
          label: l,
          value: li
        };
      }).filter((l, li) => {
          return (
            $positions[$selectedPosition].clusters[li][$selectedCluster] ===
            $selectedClusterDetails
          );
        })
      : [];
  let clusterSelection = [];
  let neighborSelection = [];

  const setActiveIndex = (index) => {
    selectedPosition.set(index);
  };

  const setSelectedClusterDetails = (index) => {
    clusterSelection = [];
    selectedClusterDetails.set(index);
  };

  let hoverPosition: number = null;
  const setHoverPosition = (index) => {
    hoverPosition = index;
  };

  let activePosition: number = null;
  const setActivePosition = (index) => {
    if (index) {
      activePosition = index;
      selection.set([index]);
      neighbors.set($matrices[$neighborId][$selectedMatrix][index]);
    } else {
      activePosition = null;
      selection.set([]);
      neighbors.set([]);
    }
  };

  const color = scaleOrdinal(schemeCategory10);
  let min = [0, 0];
  let max = [0, 0];
  const width = 800;
  const height = 800;
  const padding = 20;

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

  $: {
    if ($ready) {
      min = [
        $positions[$selectedPosition].positions[0][0],
        $positions[$selectedPosition].positions[0][1],
      ];
      max = [
        $positions[$selectedPosition].positions[0][0],
        $positions[$selectedPosition].positions[0][1],
      ];
      $positions[$selectedPosition].positions.forEach((p) => {
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
    }
  }

  let assign = false;
  let newClusterName = "";
  let existingCluster = "";
  let assignId: number[] = null;
  let editMode: boolean = false;
  let editId: number = null;
  let newClusterColor: [number, number, number, number] = [0,0,0,1];

  $: if (!assign) {
    newClusterName = "";
    existingCluster = null;
  }

  const colorFunc = (
    pi: number,
    _selectedPosition: number,
    _selectedCluster: number,
    clusterMode: boolean,
    _taxonomies,
    _taxonomyMap
  ): string => {
    if (!clusterMode) {
      return $positions[_selectedPosition].clusters[pi][_selectedCluster] >= 0
        ? color(
            $positions[_selectedPosition].clusters[pi][
              _selectedCluster
            ].toString()
          )
        : "#000";
    } else {
      return pi in _taxonomyMap ? `rgba(${_taxonomies[_taxonomyMap[pi]].color.join(',')})` : 'rgba(255,0,0,1)';
    }
  };

  const removeIdsFromTax = (ids: number[]) => {
    const refreshTax = {};
    ids.forEach(id => {
      $taxonomies.forEach((t, ti) => {
        if (t.ids.includes(id)) {
          if (!(ti in refreshTax)) {
            refreshTax[ti] = t.ids;
          }
          refreshTax[ti].splice(refreshTax[ti].indexOf(id, 1));
        }
      });
    });
    Object.keys(refreshTax).forEach(key => {
      $taxonomies[key].ids = refreshTax[key];
    });
  };

  const saveTaxonomy = () => {
    if (editMode) {
      const tempTaxonomy = $taxonomies[editId];
      tempTaxonomy.name = newClusterName;
      tempTaxonomy.color = newClusterColor;
      $taxonomies[editId] = tempTaxonomy;
    } else {
      if (assignId.length > 0) {
        removeIdsFromTax(assignId);
        if (existingCluster !== null && existingCluster !== '') {
          const clusterIds = $taxonomies[existingCluster].ids;
          assignId.forEach(id => {
            if (!clusterIds.includes(id)) {
              clusterIds.push(id);
            }
          });
          $taxonomies[existingCluster].ids = clusterIds;
        } else {
          const newTaxonomy: Taxonomy = {
            name: newClusterName,
            color: newClusterColor,
            ids: assignId
          };
          const tempTaxonomies = $taxonomies;
          tempTaxonomies.push(newTaxonomy);
          $taxonomies = tempTaxonomies;
        }
      }
    }
    assign = false;
  };

  let clusterMode = false;

  const deleteTaxonomy = (id: number) => {
    const tempTaxonomies = $taxonomies;
    tempTaxonomies.splice(id, 1);
    $taxonomies = tempTaxonomies;
  };

  const editTaxonomy = (id: number) => {
    editMode = true;
    newClusterName = $taxonomies[id].name;
    newClusterColor = $taxonomies[id].color;
    existingCluster = "";
    editId = id;
    assign = true;
  };
</script>

{#if localReady}
  <div id="taxonomyViews">
    {#each $positions as position, index}
      <TSNE
        selected={$selection}
        selectedNeighbors={$neighbors}
        positions={position.positions}
        clusters={position.clusters}
        type={position.type}
        key={position.key}
        pca={position.pca}
        {setActiveIndex}
        {index}
      />
    {/each}
  </div>
  <div id="editor">
    <div id="clusterView">
      <div>
        <h2>Clusters</h2>
        <Button
          label="Reset cluster selection"
          on:click={() => setSelectedClusterDetails(null)}
        />
        <ul>
          {#each clusters as cluster, index}
            <li
              class:active={$selectedClusterDetails === cluster.key}
              on:click={() => setSelectedClusterDetails(cluster.key)}
              id="cluster-item-{index}"
            >
              <span
                class="cluster-indicator"
                style="background-color:{color(cluster.key.toString())}"
              />
              {cluster.key}&nbsp;<span>{cluster.count}</span>
            </li>
          {/each}
        </ul>
      </div>
      {#if $selectedClusterDetails != null}
        <div>
          <h2>Labels in Cluster (<span class="cluster-indicator large" style="background-color:{color($selectedClusterDetails.toString())}"></span>{$selectedClusterDetails})</h2>
          <SelectList
            data={clusterLabels}
            bind:selection={clusterSelection}
          />
          <Button
            label="Assign to cluster"
            on:click={() => {
              assignId = clusterSelection;
              editMode = false;
              assign = true;
            }}
          />
        </div>
      {/if}
    </div>
    <div id="dataView">
      <div>
        <Toggle
            id="distanceToggle"
            labelLeft="ML Cluster"
            labelRight="Custom Cluster"
            bind:checked={clusterMode} />
        <Button
          label="Reset selection"
          on:click={() => setActivePosition(null)}
        />
      </div>
      <svg {width} {height} viewBox="0 0 {width} {height}">
        {#each $positions[$selectedPosition].positions as p, pi}
          <circle
            on:mouseover={() => setHoverPosition(pi)}
            on:mouseout={() => setHoverPosition(null)}
            on:click={() => setActivePosition(pi)}
            cx={x(p)}
            cy={y(p)}
            r="2"
            fill={colorFunc(pi, $selectedPosition, $selectedCluster, clusterMode, $taxonomies, $taxonomyMap)}
            class:inactive={$selectedClusterDetails != null &&
              $positions[$selectedPosition].clusters[pi][$selectedCluster] !==
                $selectedClusterDetails}
            class:active={$selectedClusterDetails != null &&
              $positions[$selectedPosition].clusters[pi][$selectedCluster] ===
                $selectedClusterDetails}
          />
        {/each}
        {#if hoverPosition != null}
          <text
            transform="translate({x(
              $positions[$selectedPosition].positions[hoverPosition]
            )},{y($positions[$selectedPosition].positions[hoverPosition])})"
            text-anchor="start">{$labels[hoverPosition]}</text
          >
        {/if}
        {#if $selection.length > 0}
          {#each $selection as s}
            <circle
              class="highlighter"
              cx={x($positions[$selectedPosition].positions[s])}
              cy={y($positions[$selectedPosition].positions[s])}
              r="5"
            />
          {/each}
        {/if}
        {#if $selection.length > 0}
          {#each $neighbors as s}
            <circle
              class="small-highlighter"
              cx={x($positions[$selectedPosition].positions[s])}
              cy={y($positions[$selectedPosition].positions[s])}
              r="3"
            />
          {/each}
        {/if}
      </svg>
    </div>
    <div id="neighborView">
      {#if $selection.length > 0}
        <div>
          <h2>Selection</h2>
          <table>
            <tr>
              <th>ID</th>
              <td>{$selection[0]}</td>
            </tr>
            <tr>
              <th>Label</th>
              <td>{$labels[$selection[0]]}</td>
            </tr>
            {#if $positions[$selectedPosition].clusters[$selection[0]][$selectedCluster] >= 0}
              <tr>
                <th>Cluster</th>
                <td
                  on:click={() =>
                    setSelectedClusterDetails(
                      $positions[$selectedPosition].clusters[$selection[0]][
                        $selectedCluster
                      ]
                    )}
                  >{$positions[$selectedPosition].clusters[$selection[0]][
                    $selectedCluster
                  ]}</td>
              </tr>
            {/if}
            {#if $selection[0] in $taxonomyMap}
              <tr>
                <th>Custom Cluster</th>
                <td>{$taxonomies[$taxonomyMap[$selection[0]]].name}</td>
              </tr>
            {/if}
          </table>
        </div>
      {/if}
      {#if $selection.length > 0}
        <div>
          <h2>Neighbors</h2>
          <SelectList
            data={$neighbors.map(n => {
              return {
                label: `<span
                  class="cluster-indicator"
                  style="background-color:${colorFunc(
                    n,
                    $selectedPosition,
                    $selectedCluster,
                    clusterMode,
                    $taxonomies,
                    $taxonomyMap
                  )}"
                ></span>&nbsp;${$labels[n]}`,
                value: n
              };
            })}
            bind:selection={neighborSelection}
          />
          <Button
            label="Assign to cluster"
            on:click={() => {
              assignId = neighborSelection;
              editMode = false;
              assign = true;
            }}
          />
        </div>
      {/if}
      <div id="custom-clusters">
        <h2>Custom Cluster</h2>
        <ul>
          {#each $taxonomies as t, ti}
            <li>
              <span>
                <span
                  class="cluster-indicator"
                  style="background-color:rgba({t.color.join(',')})"
                />{t.name}
              </span>
              <span class="edit-links">
                <Pencil on:click={() => editTaxonomy(ti)} />
                <Trash on:click={() => deleteTaxonomy(ti)} />
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  {#if assign}
    <div id="assignment" class="view">
      {#if !editMode}
      <Select
        label="Choose existing cluster"
        bind:value={existingCluster}
        values={[{
          label: 'Create new cluster',
          value: null,
        }].concat($taxonomies.map((t, ti) => {
          return {
            label: t.name,
            value: ti,
          };
        }))}
      />
      {/if}
      <Text
        label="New cluster name"
        placeholder="Name"
        bind:value={newClusterName}
      />
      <ColorPicker bind:color={newClusterColor} />
      <Button
        label="Cancel"
        on:click={() => {
          assign = false;
        }}
        invert={true}
      />
      <Button
        label="Save"
        bold={true}
        on:click={saveTaxonomy}
      />
    </div>
  {/if}
{:else}
  <Loading text="Loading data..." />
{/if}

<style lang="scss">
  @import "../../styles/globals/colors";
  @import "../../styles/globals/layout";

  #assignment {
    position: fixed;
    left: 50%;
    top: 100px;
    max-height: calc(100vh - 200px);
    margin-left: -200px;
    width: 400px;
    overflow-y: scroll;
  }

  #taxonomyViews {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  #editor {
    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    flex-direction: row;
    & > div {
      display: flex;
      flex-direction: column;
    }
  }

  #clusterView {
    flex-basis: 25%;
    flex-grow: 1;
    align-items: stretch;
    align-content: stretch;
    min-width: 0;
    ul,
    li {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 12px;
      width: 100%;
      min-width: 0;
    }
    li {
      padding: 5px;
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
      &:nth-child(even) {
        background: transparent;
      }
      &:nth-child(odd) {
        background: $color__accent-brightest;
      }
      span {
        background-color: $color__accent-bright;
        border-radius: 10px;
        padding: 1px 5px;
        font-weight: normal;
        &.cluster-indicator{
          padding:4px;
        }
      }
      &.active {
        color: white;
        background: $color__accent;
        span {
          color: black;
        }
      }
    }
    & > div {
      @include view;
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 50%;
      overflow-y: scroll;
    }
  }

  #dataView {
    flex-grow: 2;
    flex-basis: 50%;
    svg {
      width: 100%;
      height: 100%;
      text {
        pointer-events: none;
      }
    }
    circle.highlighter {
      pointer-events: none;
      fill: transparent;
      stroke: black;
    }
    circle.small-highlighter {
      pointer-events: none;
      fill: transparent;
      stroke: rgba(0, 0, 0, 0.5);
    }
    circle.inactive {
      opacity: 0.2;
    }
  }

  #custom-clusters {
    ul,
    li {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 12px;
      width: 100%;
      min-width: 0;
    }
    li {
      padding: 5px;
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      align-items:center;
      &:nth-child(even) {
        background: transparent;
      }
      &:nth-child(odd) {
        background: $color__accent-brightest;
      }
      span span{
        margin-right:5px;
        margin-left:3px;
      }
    }
  }

  #neighborView {
    flex-basis: 25%;
    flex-grow: 1;
    align-items: stretch;
    align-content: stretch;
    min-width: 0;
    & > div {
      @include view;
      overflow-y: scroll;
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 50%;
    }
  }

  h2 {
    padding-bottom: 10px;
  }

  .cluster-indicator{
    border-radius: 10px;
    padding: 4px;
    width: 1px;
    height: 1px;
    display: inline-block;
    line-height:0;
    &.large {
      padding:8px;
    }
  }
</style>
