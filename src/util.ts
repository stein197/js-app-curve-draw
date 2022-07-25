export function is_canvas(element: any): element is HTMLCanvasElement {
	return element instanceof HTMLCanvasElement;
}

export const factorial: (n: number) => number = n => (n > 0 ? n : 1) * (n > 1 ? factorial(n - 1) : 1);
