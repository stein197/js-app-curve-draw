import * as config from "config";
import * as point from "point";

export function draw(c: CanvasRenderingContext2D, points: point.point[]): void {
	if (points.length <= 1)
		return;
	let point_prev = points[0];
	c.setLineDash(config.STYLE_LINE_DASH);
	c.beginPath();
	c.moveTo(point_prev[0], point_prev[1]);
	for (let i = 1; i < points.length; i++)
		c.lineTo(points[i][0], points[i][1]);
	c.stroke();
	c.closePath();
	c.setLineDash(config.STYLE_LINE_DASH_DEFAULT);
}