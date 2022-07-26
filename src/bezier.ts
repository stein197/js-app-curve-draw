import * as config from "config";
import * as point from "point";

let cache: point.point[] | null = null;

export function cache_reset(): void {
	cache = null;
}

export function draw(c: CanvasRenderingContext2D, points: point.point[]): void {
	if (points.length <= 1)
		return;
	cache = cache ?? create(points);
	c.beginPath();
	c.moveTo(cache[0][0], cache[0][1]);
	for (const p of cache)
		c.lineTo(p[0], p[1]);
	c.stroke();
}

function create(points: point.point[]): point.point[] {
	if (points.length <= 2)
		return points.map(p => [...p]);
	const segment_count = config.BEZIER_SEGMENT_QUALITY * (points.length - 1);
	const result: point.point[] = new Array(segment_count + 1);
	const step = 1 / segment_count;
	for (let i = 0; i < segment_count; i++)
		result[i] = point_at(i * step, points);
	result[result.length - 1] = points[points.length - 1];
	return result;
}

function point_at(t: number, points: point.point[]): point.point {
	points = points.slice();
	while (points.length > 1) {
		const n = points.length - 1;
		for (let i = 0; i < n; i++) {
			points[i] = point.interpolate(points[i], points[i + 1], t);
		}
		points.pop();
	}
	return points[0];
}
