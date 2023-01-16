<script lang="ts">
  import Loader from '../components/Loader.svelte';
  import {Datatable} from 'svelte-simple-datatables';
  import {questions, load} from '../../stores/questions';
  import {link} from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import {_} from 'svelte-i18n';

  onMount(() => {
    load();
  });

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
    labels: {
        search: $_('search'),    // search input placeholer
        filter: $_('filter'),       // filter inputs placeholder
        noRows: $_('no_entries'),
        info: $_('datatable_meta'),
        previous: $_('previous'),
        next: $_('next'),       
    }
  };


  let rows;

</script>
{#if $questions && $questions.length > 0}
<div class="datatable-question">
  <Datatable bind:dataRows={rows} settings={tableSettings} data={$questions} id="questions-table">
    <thead>
      <th class="sortable asc desc" data-key="id">ID</th>
      <th class="sortable asc desc" data-key="question">{$_('question')}</th>
      <th></th>
    </thead>
    <tbody>
    {#if rows}
      {#each $rows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.question_de}</td>
              <td>
                <ul class="action-list">
                  <li><a href="/cluster/{row.id}" use:link><span class="icon cluster">Cluster</span></a></li>
                </ul>
              </td>
          </tr>
      {/each}
    {/if}
    </tbody>
  </Datatable>
</div>
{:else}
<Loader />
{/if}