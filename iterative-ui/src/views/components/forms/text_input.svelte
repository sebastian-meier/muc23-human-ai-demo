<script>
  export let inputName = 'text'
  export let id = 'text'
  export let label = ''
  export let value = ''
  export let error = false
  export let errorMessage = ''

</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <span class="error-text">{errorMessage}</span>
  <input
    bind:value
    on:input={() => (error = false)}
    type="text"
    name={inputName}
    {id}
    class:invalid={error}
    on:blur />
</div>
