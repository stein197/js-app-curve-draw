export type point = [
	x: number,
	y: number
];

export function create_from_event(e: MouseEvent): point {
	return [
		e.clientX,
		e.clientY
	];
}

export function find_around(p: point, r: number, points: point[]): point | null {
	for (let i = points.length - 1; i >= 0; i--) {
		const point = points[i];
		if (get_distance(point, p) <= r)
			return point;
	}
	return null;
}

export function get_distance(p1: point, p2: point): number {
	return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}
