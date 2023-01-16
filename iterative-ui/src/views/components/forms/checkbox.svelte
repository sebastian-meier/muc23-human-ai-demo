<script>
  export let id = 'checkbox'
  export let label = ''
  export let checked = false
</script>

<div class="radio-field">
  <label for={id}>
    <span>{label}</span><br />
    <input type="checkbox" {id} bind:checked />
  </label>
</div>