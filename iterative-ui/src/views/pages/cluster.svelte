<script lang="ts">
  import {
    detailId,
    limit,
    cache,
    clusterQuestions,
    newClusterIds,
    ignoredQuestions,
    ignoredIds,
    relatedQuestions,
    relatedIds} from '../../stores/cluster';
  import {taxonomies, load as loadTaxonomies} from '../../stores/taxonomies';
  import {questions, load as loadQuestions} from '../../stores/questions';
  import Scatterplot from '../components/vis/canvas/Scatterplot.svelte';
  import Select from '../components/forms/select.svelte';
  import { onMount } from 'svelte';
  import {_} from 'svelte-i18n';
  import {link} from 'svelte-spa-router';
  
  export let params: {id?: string} = {};

  onMount(() => {
    loadQuestions();
    loadTaxonomies();
  });

  $: {
    if ('id' in params && !isNaN(parseInt(params.id))){
      newClusterIds.set([]);
      ignoredIds.set([]);
      detailId.set(parseInt(params.id));
      $detailId = parseInt(params.id);
    }
  }
  $: selectTaxonomies = [{id: -1, name: $_('admin_cluster--new')}, ...(($taxonomies) ? $taxonomies.map((t) => {
      return { id: t.id, name: t.name };
    }) : [])];

  const removeFromCluster = (id: number) => {
    if (id === $detailId) {
      // TODO: message: cannot remove starting point
    } else {
      const tCluster = $newClusterIds;
      const index = tCluster.indexOf(id);
      if (index >= 0) {
        tCluster.splice(index, 1);
        newClusterIds.set(tCluster);
      }
    }
  }

  let clusterGroup: number[] = [];
  let clusterPaintGroup: number[] = [];
  let ignoreGroup: number[] = [];
  $: selection = [...$clusterQuestions.map((q) => q.id), $detailId, ...paintSelection];
  let paintSelection = [];
  $: paintQuestions = [...(($questions || []).filter(q => paintSelection.includes(q.id)))];

  const selectAll = () => {
    clusterGroup = $relatedQuestions.map(r => r.id);
  };
  const selectAllPaint = () => {
    clusterPaintGroup = paintSelection;
  };

  let newTaxonomy = '';
  let selectedTaxonomy = -1;

  const add = (group: number[], ignoreRest: boolean = true) => {
    const tCluster = $newClusterIds;
    const ignored = $ignoredIds;
    group.forEach((q) => {
      if (!tCluster.includes(q)) {
        tCluster.push(q);
      }
      if (ignored.includes(q)) {
        ignored.splice(ignored.indexOf(q), 1);
      }
    });
    if (ignoreRest) {
      $relatedIds.forEach((id) => {
        if (!group.includes(id)) {
          ignored.push(id);
        }
      });
      ignoredIds.set(ignored);
    }
    newClusterIds.set(tCluster);
    ignoreGroup = [];
    clusterGroup = [];
  };

  const addPaint = (group: number[], ignoreRest: boolean = true) => {
    const tCluster = $newClusterIds;
    const ignored = $ignoredIds;
    group.forEach((q) => {
      if (!tCluster.includes(q)) {
        tCluster.push(q);
      }
      if (ignored.includes(q)) {
        ignored.splice(ignored.indexOf(q), 1);
      }
    });
    if (ignoreRest) {
      paintSelection.forEach((id) => {
        if (!group.includes(id)) {
          ignored.push(id);
        }
      });
      ignoredIds.set(ignored);
    }
    newClusterIds.set(tCluster);
    ignoreGroup = [];
    clusterPaintGroup = [];
  };

  let message = null;
  let messageType = '';

  const applyCluster = async () => {
    let taxId = null;
    const token = 'DEMO'
    if (selectedTaxonomy === -1) {
      if (newTaxonomy.length > 2) {
        taxId = $taxonomies[$taxonomies.length - 1].id + 1;
        const tTax = $taxonomies;
        tTax.push({ id: taxId, parent: null, name: newTaxonomy });
        taxonomies.set(tTax);
      }
    } else {
      taxId = selectedTaxonomy;
    }
    if (taxId) {
      // await fetch(
      //     "http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/assign?taxonomies=" +
      //       encodeURIComponent(taxId) + "&questions=" + encodeURIComponent(selection.join(',')),
      //     {
      //       headers: { Authorization:  `Bearer ${token}`},
      //       method: "GET",
      //     }
      //   );

      messageType = '';
      message = $_('admin_cluster--applied');
    } else {
      messageType = 'error';
      message = $_('admin_cluster--missing');
    }
  };
</script>

{#if message}
<p class="message" class:error={messageType === 'error'} class:warning={messageType === 'warning'}>
  {message}
</p>
{/if}

<a href="/" class="link" use:link>&laquo;&nbsp;{$_('admin_cluster--back')}</a>

<Scatterplot bind:selected={selection} bind:paintSelected={paintSelection} />

<h1>Cluster</h1>
<div class="cluster-container">
<h2>{$_('admin_cluster--start')}</h2>
{#if $cache}
<p class="starting"><strong>{$cache.question_de}</strong></p>
{/if}

<h2>{$_('admin_cluster--member')}</h2>
<ul>
  {#each $clusterQuestions as q}
  <li on:click={() => removeFromCluster(q.id)}>{q.question_de}</li>
  {/each}
</ul>
<Select options={selectTaxonomies} bind:value={selectedTaxonomy} errorMessage='' />
{#if selectedTaxonomy === -1}
<input type="text" placeholder={$_('admin_cluster--name')} bind:value={newTaxonomy} />
{/if}
<button disabled={true} on:click={applyCluster}>{$_('admin_cluster--apply')}</button>



<h2>{$_('admin_cluster--candidates')}</h2>
{$_('admin_cluster--number')}
<select bind:value={$limit}>
  <option value="10">10</option>
  <option value="20">20</option>
  <option value="40">40</option>
</select>
<button on:click={() => selectAll()}>{$_('admin_cluster--select_all')}</button>
<ul>
  {#each $relatedQuestions as q}
  <li>
    <input type=checkbox bind:group={clusterGroup} value={q.id}>
    {q.question_de}</li>
  {/each}
</ul>

<button on:click={() => add(clusterGroup)}>{$_('admin_cluster--add')}</button>


<h2>{$_('admin_cluster--draw')}</h2>
<button on:click={() => selectAllPaint()}>{$_('admin_cluster--select_all')}</button>
<ul>
  {#each paintQuestions as q}
  <li>
    <input type=checkbox bind:group={clusterPaintGroup} value={q.id}>
    {q.question_de}</li>
  {/each}
</ul>
<button on:click={() => {addPaint(clusterPaintGroup); paintSelection = [];}}>{$_('admin_cluster--add')}</button>


<h2>{$_('admin_cluster--ignore')}</h2>
<ul>
  {#each $ignoredQuestions as q}
  <li>
    <input type=checkbox bind:group={ignoreGroup} value={q.id}>
    {q.question_de}
  </li>
  {/each}
</ul>

<button on:click={() => add(ignoreGroup, false)}>{$_('admin_cluster--ignore_add')}</button>
</div>