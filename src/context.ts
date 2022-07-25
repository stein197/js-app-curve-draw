import * as bezier from "bezier";
import * as canvas from "canvas";
import * as config from "config";
import * as circle from "circle";
import * as polyline from "polyline";

let context: CanvasRenderingContext2D;

export function init(ctx: CanvasRenderingContext2D): void {
	if (context) {
		console.warn("Context has been already initialized");
		return;
	}
	context = context ?? ctx;
}

export function get(): CanvasRenderingContext2D {
	return context;
}

export function repaint(): void {
	clear();
	const points = canvas.get_points();
	bezier.draw(context, points);
	polyline.draw(context, points);
	circle.draw_array(context, points);
}

export function set_style(): void {
	context.fillStyle = config.STYLE_FILL;
	context.strokeStyle = config.STYLE_STROKE;
	context.lineWidth = config.STYLE_STROKE_WIDTH;
}

function clear(): void {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
