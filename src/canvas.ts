import * as bezier from "bezier";
import * as config from "config";
import * as context from "context";
import * as point from "point";
import * as util from "util";

let canvas: HTMLCanvasElement;
let ptr_position_start: point.point | null = null;
let ptr_moving: boolean = false;
let p_captured: point.point | null = null;
const points: point.point[] = [];

export function init(c: HTMLCanvasElement): void {
	if (canvas) {
		console.warn("Canvas has been already initialized");
		return;
	}
	canvas = c;
	canvas.addEventListener("pointerdown", handler_pointerdown);
	canvas.addEventListener("pointerup", handler_pointerup);
}

export function get(): HTMLCanvasElement {
	return canvas;
}

export function get_points(): point.point[] {
	return points;
}

export function set_size(width: number, height: number): void {
	canvas.setAttribute("width", width.toString());
	canvas.setAttribute("height", height.toString());
}

function handler_pointerdown(e: PointerEvent): void {
	if (!util.is_canvas(e.target))
		return;
	ptr_position_start = point.create_from_event(e);
	p_captured = point.find_around(ptr_position_start, config.CIRCLE_RADIUS, points);
	e.target.addEventListener("pointermove", handler_pointermove);
}

function handler_pointerup(e: PointerEvent): void {
	if (!util.is_canvas(e.target))
		return;
	e.target.removeEventListener("pointermove", handler_pointermove);
	if (!ptr_moving)
		handler_click(e);
	ptr_position_start = null;
	ptr_moving = false;
	p_captured = null;
}

function handler_pointermove(e: PointerEvent): void {
	if (!ptr_position_start)
		return;
	const p_event = point.create_from_event(e);
	if (point.get_distance(p_event, ptr_position_start) <= config.POINTER_IDLE_RADIUS)
		return;
	ptr_moving = true;
	if (!p_captured || !util.is_canvas(e.target))
		return;
	p_captured[0] = p_event[0];
	p_captured[1] = p_event[1];
	bezier.cache_reset();
	context.repaint();
}

function handler_click(e: MouseEvent): void {
	if (!util.is_canvas(e.target))
		return;
	const p_event = point.create_from_event(e);
	const p_existing = point.find_around(p_event, config.CIRCLE_RADIUS, points);
	if (p_existing) {
		remove_point(p_existing);
		context.repaint();
		return;
	}
	if (ptr_moving)
		return;
	add_point(p_event);
	bezier.cache_reset();
	context.repaint();
}

function remove_point(p: point.point): void {
	const i = points.indexOf(p);
	if (i >= 0)
		points.splice(i, 1);
}

function add_point(p: point.point): void {
	points.push(p);
}
