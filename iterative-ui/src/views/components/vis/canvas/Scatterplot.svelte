<script lang="typescript">
	import { onMount } from 'svelte'
	import { Canvas } from 'svelte-canvas'
	import { scaleLinear } from 'd3-scale'
	
	import Point from './Point.svelte'
	import Line from './Line.svelte'
	
	const margin = { top: 10, right: 10, bottom: 25, left: 25 }
	
	let points = []
	let width, height 
	
	onMount(() => {
    fetch("/data/tsne.csv")
      .then((data) => data.text())
      .then((data) => {
        points = data.split('\n').map((d) => {
          const cols = d.split(',');
          return {
						id: parseInt(cols[0]) - 1,
            x: parseFloat(cols[1]),
            y: parseFloat(cols[2])
          };
        }).filter((d) => !isNaN(d.x));
      });
  });
	
	$: x = scaleLinear()
				 	.domain([0,1])
					.range([margin.left, width - margin.right])
					.nice();

	$: y = scaleLinear()
					.domain([0,1])
					.range([height - margin.bottom, margin.top])
					.nice();
	
	let paintPoints: {x: number, y: number}[] = [];

	const inside = (point: {x: number, y: number}, polygon: {x: number, y: number}[]): boolean => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    const x = point.x;
		const y = point.y;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
	};

	let mouseActive = false;

	const onMouseMove = (event) => {
		if (mouseActive) {
			paintPoints = [...paintPoints, {
				x: event.offsetX,
				y: event.offsetY
			}];
		}
	};

	const onMouseUp = (event) => {
		mouseActive = false;
		removeEventListener('mouseup', onMouseUp);
		const tPaintSelected = [];
		points.forEach(p => {
			if (inside({
				x: x(p.x),
				y: y(p.y)
			}, paintPoints)) {
				tPaintSelected.push(p.id);
			}
		});
		paintSelected = tPaintSelected;
	};

	const onMouseDown = (event) => {
		paintPoints = [];
		mouseActive = true;
		addEventListener('mouseup', onMouseUp);
	};

  export let selected: number[] = [];
	export let paintSelected: number[] = [];

</script>

<style>
	div {
		width: 100%;
		height: 400px;
	}
</style>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas 
		on:mousedown={onMouseDown}
		on:mousemove={onMouseMove}
		{width} {height}>
		<Line points={paintPoints} />
		{#each points as p}
			<Point 
				x={x(p.x)} 
				y={y(p.y)}
				r={selected.includes(p.id) ? 3 : 1} 
        fill={selected.includes(p.id) ? 'red' : 'black'} 
			/>
		{/each}
	</Canvas>
</div>