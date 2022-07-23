const CIRCLE_RADIUS = 5;
const BEZIER_SEGMENT_QUALITY = 10;
const STYLE_FILL = "white";
const STYLE_STROKE = "black";
const STYLE_STROKE_WIDTH = 2;
const STYLE_LINE_DASH_DEFAULT: number[] = [];
const STYLE_LINE_DASH = [5, 5];
const STYLE_ARC_ANGLE = Math.PI * 2;

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let pointer_moving: boolean = false;
let point_captured: point | null = null;
const points: point[] = [];

type point = [
	x: number,
	y: number
];

(function main(window: Window): void {
	const c = window.document.body.querySelector("canvas");
	if (!c)
		throw new Error("Page does not have canvas element");
	canvas = c;
	c.setAttribute("width", document.documentElement.clientWidth.toString());
	c.setAttribute("height", document.documentElement.clientHeight.toString());
	c.addEventListener("pointerdown", canvas_handler_pointerdown);
	c.addEventListener("pointerup", canvas_handler_pointerup);
	const ctx = c.getContext("2d");
	if (!ctx)
		throw new Error("Cannot retrieve context for canvas");
	context = ctx;
	ctx.fillStyle = STYLE_FILL;
	ctx.strokeStyle = STYLE_STROKE;
	ctx.lineWidth = STYLE_STROKE_WIDTH;
})(window);

function canvas_handler_pointerdown(e: PointerEvent): void {
	if (!is_canvas(e.target))
		return;
	const p_event = point_create_from_event(e);
	const p_existing = point_find_around(p_event, CIRCLE_RADIUS);
	point_captured = p_existing;
	e.target.addEventListener("pointermove", canvas_handler_pointermove);
}

function canvas_handler_pointerup(e: PointerEvent): void {
	if (!is_canvas(e.target))
		return;
	e.target.removeEventListener("pointermove", canvas_handler_pointermove);
	point_captured = null;
	if (!pointer_moving)
		canvas_handler_click(e);
	pointer_moving = false;
}

function canvas_handler_pointermove(e: PointerEvent): void {
	pointer_moving = true;
	if (!point_captured || !is_canvas(e.target))
		return;
	const p_event = point_create_from_event(e);
	point_captured[0] = p_event[0];
	point_captured[1] = p_event[1];
	context_repaint();
}

function canvas_handler_click(e: MouseEvent): void {
	if (!is_canvas(e.target))
		return;
	const p_event = point_create_from_event(e);
	const p_existing = point_find_around(p_event, CIRCLE_RADIUS);
	if (p_existing) {
		point_remove(p_existing);
		context_repaint();
		return;
	}
	if (pointer_moving)
		return;
	point_add(p_event);
	context_repaint();
}

function is_canvas(element: EventTarget | null): element is HTMLCanvasElement {
	return element instanceof HTMLCanvasElement
}

function context_repaint(): void {
	context_clear();
	bezier_draw(context, points);
	polyline_draw(context, points);
	circle_draw_array(context, points);
}

function context_clear(): void {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function point_add(p: point): void {
	points.push(p);
}

function point_remove(p: point): void {
	const i = points.indexOf(p);
	if (i >= 0)
		points.splice(i, 1);
}

function point_create_from_event(e: MouseEvent): point {
	return [
		e.clientX,
		e.clientY
	];
}

function point_find_around(p: point, r: number): point | null {
	for (let i = points.length - 1; i >= 0; i--) {
		const point = points[i];
		if (point_get_distance(point, p) <= r)
			return point;
	}
	return null;
}

function point_get_last(): point | null {
	return points.length ? points[points.length - 1] : null;
}

function point_get_distance(p1: point, p2: point): number {
	return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}

function circle_draw_array(c: CanvasRenderingContext2D, points: point[]): void {
	for (const point of points) {
		c.beginPath();
		c.arc(point[0], point[1], CIRCLE_RADIUS, 0, STYLE_ARC_ANGLE);
		c.fill();
		c.stroke();
		c.closePath();
	}
}

function polyline_draw(c: CanvasRenderingContext2D, points: point[]): void {
	if (points.length <= 1)
		return;
	let point_prev = points[0];
	c.setLineDash(STYLE_LINE_DASH);
	c.beginPath();
	c.moveTo(point_prev[0], point_prev[1]);
	for (let i = 1; i < points.length; i++)
		c.lineTo(points[i][0], points[i][1]);
	c.stroke();
	c.closePath();
	c.setLineDash(STYLE_LINE_DASH_DEFAULT);
}

function bezier_draw(c: CanvasRenderingContext2D, points: point[]): void {
	if (points.length <= 1)
		return;
	c.beginPath();
	c.moveTo(points[0][0], points[0][1]);
	const step = 1 / (BEZIER_SEGMENT_QUALITY * (points.length - 1));
	for (let t = 0; t <= 1; t += step) {
		const p_at = bezier_point_at(t, points);
		c.lineTo(p_at[0], p_at[1]);
	}
	c.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
	c.stroke();
}

function bezier_point_at(t: number, points: point[]): point {
	let result: point = [0, 0];
	const n = points.length - 1;
	for (let k = 0; k <= n; k++) {
		const Pk = points[k];
		for (let j = 0; j < Pk.length; j++)
			result[j] += Pk[j] * (f(n) / (f(k) * f(n - k))) * (t ** k) * ((1 - t) ** (n - k))
	}
	return result;
}

const f: (n: number) => number = n => (n > 0 ? n : 1) * (n > 1 ? f(n - 1) : 1);
