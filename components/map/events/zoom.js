
export default class ZoomControler {
    constructor(center, scale, selector, setScale) {
        this.center = center;
        this.scale = scale;
        this.selector = selector;
        this.setScale = setScale;
        this.disabled = false;
    }

    handleMouseWheel(event) {
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;
        this.scale.current / 256;

        const vx = this.selector.cursor[0] - this.center.current.x;
        const vy = this.selector.cursor[1] - this.center.current.y;
        const norm = Math.sqrt(vx * vx + vy * vy);
        const factor = (change < 0 ? 1 : -1) * norm / 13.3;

        const nextScale = this.scale.current + change * this.scale.current;
        if (nextScale < 1) {
            this.setScale(1);
        } else if (nextScale > 256) {
            this.setScale(256);
        } else {
            this.setScale(nextScale)
            this.center.current = {
                x: this.center.current.x + factor * vx / norm,
                y: this.center.current.y + factor * vy / norm
            }
        }

        this.selector.updateSelect();
    }

    takeControl() {
        this.disabled = true;
    }

    releaseControl() {
        this.disabled = false;
    }
}