<script lang="ts">
  type Row = {
    [key: string]: string | Date | number | string[] | Date[];
  };

  export let values: Row[] = [];

  export let click: null | ((row: Row) => void) = null;

  export let sortColumn = "name";
  export let sortDirection: "asc" | "desc" = "asc";
  export let columns: {
    name: string;
    key: string;
    sort?: boolean;
    info?: string;
    hideLable?: boolean;
    formatter?: (value: string | Date | number | string[] | Date[]) => string;
  }[] = [];
  export let selectable = false;
  export let selection = [];

  export const resetSelection = () => {
    selectedIndices = [];
  };
  
  let selectedIndices = [];
  $: selection = values.filter((v, vi) => selectedIndices.includes(vi));

  $: tableColumns =
    columns.length > 0
      ? columns
      : Object.keys(values[0]).map((key) => {
          return {
            name: key,
            key,
            formatter: (val) => val.toString(),
          };
        });

  $: sortedValues = values.sort((a, b) => {
    if (sortColumn in a && sortColumn in b) {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA instanceof Date && valB instanceof Date) {
        return (
          (valA.getTime() - valB.getTime()) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      return (
        valA.toString().localeCompare(valB.toString()) *
        (sortDirection === "asc" ? 1 : -1)
      );
    }
    return 0;
  });
</script>

<table>
  <thead>
    <tr>
      {#if selectable}
        <th></th>
      {/if}
      {#each tableColumns as column}
        <th
          class:sorting={column["key"] === sortColumn}
          class:desc={column["key"] === sortColumn && sortDirection === "desc"}
          class:sort={"sort" in column && column["sort"]}
          on:click={() => {
            if ("sort" in column && column["sort"]) {
              if (sortColumn === column["key"] && sortDirection === "asc") {
                sortDirection = "desc";
              } else {
                sortColumn = column["key"];
                sortDirection = "asc";
              }
            }
          }}
        >
          {#if !("hideLable" in column) || !column["hideLable"]}
            {column.name}
          {/if}
          {#if "info" in column && column["info"]}
            <span />
          {/if}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sortedValues as row, index}
      <tr class:even={index % 2}>
        {#if selectable}
        <td><input type="checkbox" value="{index}" bind:group={selectedIndices} name="selection" /></td>
        {/if}
        {#each tableColumns as column}
          <td class:clickable={click} on:click={() => { click ? click(row) : () => {}}}>
            {#if "formatter" in column && column["formatter"] && typeof column["formatter"] === "function"}
              {@html column["formatter"](row[column["key"]])}
            {:else}
              {@html row[column["key"]]}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
