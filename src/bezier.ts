import * as config from "config";
import * as point from "point";
import * as util from "util";

export function draw(c: CanvasRenderingContext2D, points: point.point[]): void {
	if (points.length <= 1)
		return;
	c.beginPath();
	c.moveTo(points[0][0], points[0][1]);
	const step = 1 / (config.BEZIER_SEGMENT_QUALITY * (points.length - 1));
	for (let t = 0; t <= 1; t += step) {
		const p_at = point_at(t, points);
		c.lineTo(p_at[0], p_at[1]);
	}
	c.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
	c.stroke();
}

function point_at(t: number, points: point.point[]): point.point {
	let result: point.point = [0, 0];
	const n = points.length - 1;
	for (let k = 0; k <= n; k++) {
		const Pk = points[k];
		for (let j = 0; j < Pk.length; j++)
			result[j] += Pk[j] * (util.factorial(n) / (util.factorial(k) * util.factorial(n - k))) * (t ** k) * ((1 - t) ** (n - k))
	}
	return result;
}
