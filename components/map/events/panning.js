import { convertCoordinates } from "../../../utils/map/utils";
import { getCache } from "../../../utils/models/game";

export default class PanningControler {
    constructor(
        center, scale, windowSize, canvasRef, onPlotClick, selector, zoomControler
    ) {
        this.center = center;
        this.scale = scale;
        this.windowSize = windowSize;
        this.canvasRef = canvasRef;
        this.onPlotClick = onPlotClick;
        this.selector = selector;
        this.isDown = false;
        this.disabled = false;
        this.zoomControler = zoomControler;
        this.touch_id = 0;
    }

    startPanning(x, y) {
        this.isDown = true;
        this.last = [x, y];
        this.start = [x, y];
    }

    movePanning(px, py, selector = true) {
        if (this.disabled)
            return;
        if (selector)
            this.selector.select(px, py);

        // don't pan if mouse is not pressed
        if (!this.isDown) return;
        const norm = this.scale.current * window.devicePixelRatio / this.windowSize.current.width;
        const xMap = (px - this.last[0]) * norm;
        const yMap = (py - this.last[1]) * norm;

        this.last = [px, py];
        this.center.current = { x: this.center.current.x - xMap, y: this.center.current.y + yMap };
    }

    stopPanning(px, py) {
        if (!this.isDown)
            return;
        this.isDown = false;
        const stop = [
            (this.scale.current / this.windowSize.current.width) * (px - this.start[0]) * window.devicePixelRatio,
            (this.scale.current / this.windowSize.current.height) * (py - this.start[1]) * window.devicePixelRatio
        ];

        const ratio = this.windowSize.current.width / this.windowSize.current.height;
        getCache().refresh({
            x: this.center.current.x,
            y: this.center.current.y
        }, this.scale.current * 2,
            1 / ratio);

        if (stop[0] ** 2 + stop[1] ** 2 < 1.0) {

            let X = 2 * px * window.devicePixelRatio / this.windowSize.current.width - 1;
            let Y = - (2 * py * window.devicePixelRatio / this.windowSize.current.height - 1);
            const [x, y] = convertCoordinates(X, Y, this.center.current, this.scale.current, ratio);
            const result = getCache().getPlotAt(x, y);
            if (result)
                this.onPlotClick(result[0], result[1]);
        }
    }

    handleTouchDown(event) {
        const touches = event.changedTouches;
        if (this.zoomControler.scaling || touches.length !== 1)
            return;
        const touch = touches[0];
        this.touch_id = touch.identifier;
        this.startPanning(touch.clientX, touch.clientY);
    }

    handleMouseDown(event) {
        if (event.target !== this.canvasRef.current)
            return;
        this.startPanning(event.clientX, event.clientY);
    }

    handleTouchMove(event) {
        const touches = event.changedTouches;
        if (this.zoomControler.scaling || touches.length !== 1)
            return;
        const touch = touches[0];
        if (touch.identifier !== this.touch_id)
            return;
        this.movePanning(touch.clientX, touch.clientY);
    }

    handleMouseMove(event) {
        this.movePanning(event.clientX, event.clientY);
    }

    // also called on mobile
    handleMouseUp(event) {
        this.stopPanning(event.clientX, event.clientY);
    }

    releaseControl() {
        this.disabled = false;
    }

    takeControl() {
        this.disabled = true;
    }

}