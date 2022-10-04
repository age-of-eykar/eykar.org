
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

        let cursor = this.selector.cursor;
        let nextScale = this.scale.current + change * this.scale.current;
        if (nextScale < 1)
            nextScale = 1;
        else if (nextScale > 256)
            nextScale = 256;

        if (cursor[0] == NaN || cursor[1] === NaN)
            return;

        this.center.current = {
            x: cursor[0] + nextScale * (this.center.current.x - cursor[0]) / this.scale.current,
            y: cursor[1] + nextScale * (this.center.current.y - cursor[1]) / this.scale.current
        }
        this.setScale(nextScale)
        this.selector.updateSelect()
    }

    takeControl() {
        this.disabled = true;
    }

    releaseControl() {
        this.disabled = false;
    }
}