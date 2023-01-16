<script>
	import { Layer } from 'svelte-canvas'
	
	export let x = 0, 
					 	 y = 0, 
						 r = 1, 
						 fill = "black", 
						 stroke = null, 
						 strokeWidth = 1;
	
	$: render = ({ context }) => {
		context.fillStyle = fill;
		context.beginPath();
		context.arc(x, y, r, 0, 2 * Math.PI);
		context.fill();

		if (stroke) {
			context.strokeStyle = stroke;
			context.lineWidth = strokeWidth;
			context.beginPath();
			context.arc(x, y, r + strokeWidth / 2, 0, 2 * Math.PI);
			context.stroke();
		} 
	}
</script>

<Layer {render} priority={stroke && 1} />