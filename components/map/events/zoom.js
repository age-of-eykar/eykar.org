export default class ZoomControler {
    constructor(scale, setScale) {
        this.scale = scale;
        this.setScale = setScale;
        this.disabled = false;
    }

    handleMouseWheel(event) {
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;
        this.setScale(Math.min(Math.max(this.scale.current + change * this.scale.current, 1), 256))
    }

    takeControl() {
        this.disabled = true;
    }

    releaseControl() {
        this.disabled = false;
    }
}