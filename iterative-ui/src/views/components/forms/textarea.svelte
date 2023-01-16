<script>
  export let inputName = 'textarea'
  export let id = 'textarea'
  export let label = ''
  export let value = ''
  export let error = false
  export let errorMessage = ''
</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <span class="error-text">{errorMessage}</span>
  <textarea
    bind:value
    on:input={() => (error = false)}
    name={inputName}
    {id}
    class:invalid={error}
    on:blur />
</div>