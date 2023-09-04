<script lang="ts">
  import Button from "./forms/Button.svelte";
  import {Eye} from 'svelte-bootstrap-icons';
  import { createEventDispatcher } from 'svelte';
  import { v4 as uuid } from "uuid";
  const id = uuid();

  const dispatch = createEventDispatcher();

  export const onHover = () => {};

  export let data: {
    label: string;
    value: number | string;
  }[] = [];
  export let selection: (number | string)[] = [];

  let lastIndex = null;
  const click = (event, index: number, d: { label: string; value: number | string; }) => {
    const tempSelection = selection;
    console.log(lastIndex, event.shiftKey);
    if (lastIndex !== null && lastIndex !== index && event.shiftKey) {
      let action = "add";
      if (tempSelection.includes(d.value)) {
        action = "remove";
      }
      const indices = [index, lastIndex].sort((a, b) => a - b);
      console.log(action, indices, tempSelection);
      for (let i = indices[0]; i <= indices[1]; i += 1) {
        if (action === "add") {
          if (!tempSelection.includes(data[i].value)) {
            tempSelection.push(data[i].value);
          }
        } else {
          if (tempSelection.includes(data[i].value)) {
            tempSelection.splice(tempSelection.indexOf(data[i].value), 1);
          }
        }
      }
    } else {
      if (tempSelection.includes(d.value)) {
        tempSelection.splice(tempSelection.indexOf(d.value), 1);
      } else {
        tempSelection.push(d.value);
      }
    }
    selection = tempSelection;
    lastIndex = index;
  };

  const resetSelection = () => {
    selection = [];
  };

  const selectAll = () => {
    const allSelection = [];
    for (let i = 0; i < data.length; i += 1) {
      allSelection.push(data[i].value);
    }
    selection = allSelection;
  };
</script>

<ul>
  {#each data as d, index}
    <li
      on:click={(e) => click(e, index, d)}
      on:mouseover={() => {dispatch('over', d)}}
      on:mouseout={() => {dispatch('out')}}
      class:active={selection.includes(d.value)}
    >
      <input
        type="checkbox"
        checked={selection.includes(d.value)}
        value={d.value}
        disabled
        name="selection-{id}"
        id="selection-{id}-{index}"
      />
      <label for="selection-{id}-{index}">{@html d.label}</label>
      <Eye on:click={(e) => {dispatch('setActivePosition', d.value); e.stopPropagation();}} />
    </li>
  {/each}
</ul>
<Button label="Select all" on:click={() => selectAll()} />
<Button label="Remove selection" on:click={() => resetSelection()} />

<style lang="scss">
  @import "../../styles/globals/colors";
  @import "../../styles/globals/layout";

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
    width: 100%;
    min-width: 0;
  }
  li {
    * {
      pointer-events: none;
    }
    cursor: pointer;
    padding: 5px;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
    &:nth-child(even) {
      background: transparent;
    }
    &:nth-child(odd) {
      background: $color__accent-brightest;
    }
    &.active {
      color: white;
      background: $color__accent;
    }
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
