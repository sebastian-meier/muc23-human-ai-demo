<script lang="ts">
  import { _ } from "svelte-i18n";

  export let id = 'selectElement';
  export let label = 'Select';
  export let value: number | string = '';
  export let error = false;
  export let errorMessage: string = $_('please_select');
  export let helpText = '';
  export let options = [];
</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <select bind:value {id} class:invalid={error}>
    {#each options as option (option.id)}
      <option value={option.id}>{option.name}</option>
    {/each}
  </select>
  <span class="helper-text">{helpText}</span>
  <span class="error-text">{errorMessage}</span>
</div>