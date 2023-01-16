<script lang="ts">
  import Select from "./select.svelte";
  import { createEventDispatcher } from 'svelte'
  import Buttons from "./buttons.svelte";
  import {_} from 'svelte-i18n';

  export let options:{ id: number, name: string }[] = [];
  export let errorMessage: string = $_('please_choose');
  let value = null;

  const dispatch = createEventDispatcher();

  const listSelect = event => {
    if (value !== -1) {
      event.preventDefault();
      dispatch('select', value);
      value = -1;
    }
  };
</script>

<Select
  label=""
  errorMessage={errorMessage}
  options={[{id: -1, name: $_('please_choose')}, ...options]}
  bind:value={value} />
<Buttons cancelButton={false} submitText={$_('select')} on:submit={listSelect} />
