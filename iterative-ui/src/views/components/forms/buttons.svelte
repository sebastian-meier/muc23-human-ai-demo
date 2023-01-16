<script>
  import { _ } from 'svelte-i18n';

  export let cancelText = $_('cancel');
  export let cancelButton = true
  export let submitText = $_('submit');
  export let id = ''
  export let isLoading = false
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const cancelAction = event => {
    event.preventDefault()
    dispatch('cancel')
  }

  const submitAction = event => {
    event.preventDefault()
    dispatch('submit')
  }
</script>

<div class="field form-buttons">
  {#if cancelButton}
    <button type="button" {id} on:click={cancelAction} class="btn cancel">{cancelText}</button>
  {/if}
  {#if isLoading}
    <div class="preloader">
      {$_('loading')}
    </div>
  {:else}
    <button type="button" on:click={submitAction} {id} class="btn">{submitText} </button>
  {/if}
</div>
