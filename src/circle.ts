import * as config from "config";
import * as point from "point";

export function draw_array(c: CanvasRenderingContext2D, points: point.point[]): void {
	for (const point of points) {
		c.beginPath();
		c.arc(point[0], point[1], config.CIRCLE_RADIUS, 0, config.STYLE_ARC_ANGLE);
		c.fill();
		c.stroke();
		c.closePath();
	}
}
