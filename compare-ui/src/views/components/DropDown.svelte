<script lang="ts">
  export let values: {
    label: string;
    value: string | number;
    badge?: string | number;
  }[] = [];
  export let title = "";
  export let defaultValue = "Please choose";
  export let value: null | string | number | (string | number)[] = null;
  export let multi = false;

  $: label =
    !value || value === null
      ? defaultValue
      : multi && Array.isArray(value)
      ? value.join(", ")
      : value;

  const select = (selectedValue: string | number) => {
    if (!multi) {
      value = selectedValue;
    } else {
      if (!value || value === null || !Array.isArray(value)) {
        value = [];
      }
      if (value.includes(selectedValue)) {
        value = value.splice(value.indexOf(selectedValue), 1);
      } else {
        value.push(selectedValue);
      }
    }
  };
</script>

<div class="dropdown">
  <span>{title}</span>
  <div>
    <span aria-haspopup="true">{label}</span>
  </div>
  <ul class="dropdown" aria-label="submenu">
    {#each values as item}
      <li
        class:selected={(!multi && value === item.value) ||
          (multi && Array.isArray(value) && value.includes(item.value))}
        on:click={() => select(item.value)}
      >
        <span>{item.label}</span>
        {#if item.badge || item.badge === 0}
          <span class="badge">{item.badge}</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
