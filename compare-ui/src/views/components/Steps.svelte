<script lang="ts">
  export let steps: {
    label: string;
    active: boolean;
  }[] = [];

  $: stepsFormatted = steps.map((step, index) => {
    let beforeActive = false;
    for (let i = index + 1; i < steps.length; i += 1) {
      if (steps[i].active) {
        beforeActive = true;
      }
    }
    return {
      ...step,
      beforeActive,
    };
  });
</script>

{#if steps.length > 0}
  <ul class="steps">
    {#each stepsFormatted as step}
      <li class:visited={step.beforeActive} class:active={step.active}>
        {step.label}
      </li>
    {/each}
  </ul>
{/if}
