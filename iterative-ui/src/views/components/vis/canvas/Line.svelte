<script>
	import { Layer } from 'svelte-canvas'
	
	export let points = [], 
						 stroke = 'blue', 
						 strokeWidth = 1;
	
	$: render = ({ context }) => {
		context.fillStyle = 'transparent';
    context.strokeStyle = stroke;
    context.strokeWidth = strokeWidth;
		context.beginPath();
    if (points.length > 0) {
      points.forEach((p, i) => {
        if (i === 0) {
          context.moveTo(p.x, p.y);
        } else {
          context.lineTo(p.x, p.y);
        }
      });
      context.lineTo(points[0].x, points[0].y);
    }  
		context.stroke();
	}
</script>

<Layer {render} priority={2} />