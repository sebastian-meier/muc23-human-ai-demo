<script lang="typescript">
  import mapbox from 'mapbox-gl';
  import { v4 as uuid } from 'uuid';
  import {onMount} from 'svelte';
  const id = uuid();
  
  export let map: mapbox.Map;
  export let cssClass = '';
  export let center: [number, number] = [0, 0];
  export let zoom: number = 4;
  export let mapReady: boolean = false;
  
  mapbox.accessToken = __global.env.MAPBOXKEY;
  
  onMount(() => {
    map = new mapbox.Map({
      container: `map-${id}`,
      style: "mapbox://styles/mapbox/light-v10",
      center,
      zoom,
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    map.on('load', () => { mapReady = true; });
  });
</script>

<svelte:head>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
</svelte:head>

<div class="map {cssClass}" id="map-{id}">
</div>

<style lang="scss">
  .map{
    min-width:400px;
    width:100%;
  }
</style>