export default class PanningControler {
    constructor(
        center, scale, windowSize, canvasRef, selected, onPlotClick, cache
    ) {
        this.center = center;
        this.scale = scale;
        this.windowSize = windowSize;
        this.canvasRef = canvasRef;
        this.selected = selected;
        this.onPlotClick = onPlotClick;
        this.cache = cache;
        this.isDown = false;
        this.lastMove = performance.now();
    }

    select(x, y) {
        const X = 2 * x / this.windowSize.current.width - 1;
        const Y = - (2 * y / this.windowSize.current.height - 1);
        const now = performance.now();
        if (now - this.lastMove < 10)
            return;
        this.lastMove = now;

        const ratio = this.windowSize.current.width / this.windowSize.current.height;
        const output = this.cache.getVerticesStopsAt(X, Y,
            this.center.current, this.scale.current, ratio);
        if (output)
            this.selected.current = output;
    }

    startPanning(x, y) {
        this.isDown = true;
        this.last = [x, y];
        this.start = [x, y];
    }

    movePanning(x, y) {
        this.select(x, y);

        // don't pan if mouse is not pressed
        if (!this.isDown) return;
        const norm = this.scale.current / this.windowSize.current.width;
        const xMap = (x - this.last[0]) * norm;
        const yMap = (y - this.last[1]) * norm;

        this.last = [x, y];
        this.center.current = { x: this.center.current.x - xMap, y: this.center.current.y + yMap };
    }

    stopPanning(x, y) {
        if (!this.isDown)
            return;
        this.isDown = false;
        const stop = [
            (this.scale.current / this.windowSize.current.width) * (x - this.start[0]),
            (this.scale.current / this.windowSize.current.height) * (y - this.start[1])
        ];

        const ratio = this.windowSize.current.width / this.windowSize.current.height;
        this.cache.refresh({
            x: this.center.current.x - stop[0] / 2,
            y: this.center.current.y + stop[1] / 2
        }, this.scale.current * 2,
            1 / ratio);

        if (stop[0] ** 2 + stop[1] ** 2 < 1.0) {
            let X = 2 * x / this.windowSize.current.width - 1;
            let Y = - (2 * y / this.windowSize.current.height - 1);
            const result = this.cache.getPlotAt(X, Y,
                this.center.current, this.scale.current, ratio);
            if (result)
                this.onPlotClick(result[0], result[1]);
        }
    }

    handleTouchDown(event) {
        const touches = event.changedTouches;
        if (touches.length === 0)
            return;
        const touch = touches[0];
        this.startPanning(touch.clientX, touch.clientY);
    }

    handleMouseDown(event) {
        if (event.target !== this.canvasRef.current)
            return;
        this.startPanning(event.clientX, event.clientY);
    }

    handleTouchMove(event) {
        const touches = event.changedTouches;
        if (touches.length === 0)
            return;
        const touch = touches[0];
        this.movePanning(touch.clientX, touch.clientY);
    }

    handleMouseMove(event) {
        if (event.target !== this.canvasRef.current &&
            event.target.tagName !== "HTML") {
            return;
        }
        this.movePanning(event.clientX, event.clientY);
    }

    handleTouchEnd(event) {
        const touches = event.changedTouches;
        if (touches.length === 0)
            return;
        const touch = touches[0];
        this.stopPanning(touch.clientX, touch.clientY);
    }

    handleMouseUp(event) {
        this.stopPanning(event.clientX, event.clientY);
    }

}