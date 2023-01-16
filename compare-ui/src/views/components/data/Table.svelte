<script lang="ts">
  import { isArray } from "util";
  import Table from "../Table.svelte";

  export let values: {
    name: string;
    resolution: string;
    category: string[];
    time: Date[];
    spatialType: string[];
    lastUpdated: Date;
  }[] = [];
</script>

<h3 class="tablehead">{values.length} Ergebnisse</h3>
<Table
  {values}
  columns={[
    {
      name: "Icon",
      key: "spatialType",
      formatter: (type) =>
        `<span class="icon medium icon-type-${type}"></span>`,
      hideLable: true,
    },
    {
      name: "Name",
      key: "name",
      sort: true,
      formatter: (name) => `<strong>${name}</strong>`,
    },
    {
      name: "Kategorie",
      key: "category",
      info: "Kurzer Information zu dieser Spalte",
      formatter: (categories) => {
        return Array.isArray(categories)
          ? categories
              .map((category) => `<span class="tag">${category}</span>`)
              .join("")
          : `<span class="tag">${categories.toString()}</span>`;
      },
    },
    {
      name: "Zeit",
      key: "time",
      formatter: (times) => {
        return Array.isArray(times)
          ? times.map((time) => time.toLocaleDateString()).join(" - ")
          : times.toLocaleString();
      },
    },
    { name: "Raumtyp", key: "spatialType", sort: true },
    {
      name: "Zuletzt bearbeitet",
      key: "lastUpdated",
      sort: true,
      formatter: (date) => {
        return !date ? "" : new Date(date.toString()).toLocaleDateString();
      },
    },
  ]}
/>
