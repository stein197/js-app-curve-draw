import * as canvas from "canvas";
import * as context from "context";

(function main(window: Window): void {
	const c = window.document.body.querySelector("canvas");
	if (!c)
		throw new Error("Page does not have canvas element");
	canvas.init(c);
	canvas.set_size(window.innerWidth, window.innerHeight);
	window.addEventListener("resize", window_handler_resize);
	const ctx = c.getContext("2d");
	if (!ctx)
		throw new Error("Cannot retrieve context for canvas");
	context.init(ctx);
	context.set_style();
})(window);

function window_handler_resize(e: UIEvent): void {
	if (!(e.target instanceof Window))
		return;
	canvas.set_size(e.target.window.innerWidth, e.target.window.innerHeight);
	context.set_style();
	context.repaint();
}
