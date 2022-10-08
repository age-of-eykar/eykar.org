
export default class ZoomControler {
    constructor(center, scale, selector, setScale) {
        this.center = center;
        this.scale = scale;
        this.selector = selector;
        this.setScale = setScale;
        this.disabled = false;
        this.scaling = false;
        this.dist = undefined;
    }

    handlePinchStart(event) {
        if (event.touches.length === 2) {
            event.preventDefault();
            this.scaling = true;
        }
    }

    handlePinchMove(event) {
        event.preventDefault();
        if (this.scaling) {
            const newDist = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY);
            if (this.dist !== undefined) {
                const ratio = (this.dist / newDist);
                let nextScale = this.scale.current * ratio ** 2;
                if (nextScale < 1)
                    nextScale = 1;
                else if (nextScale > 256)
                    nextScale = 256;
                this.setScale(nextScale);
            }
            this.dist = newDist;
        }
    }

    handlePinchEnd(event) {
        if (this.scaling) {
            this.scaling = false;
            this.dist = undefined;
        }
    }

    handleMouseWheel(event) {
        //event.preventDefault();
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;

        let cursor = this.selector.cursor;
        let nextScale = this.scale.current + change * this.scale.current;
        if (nextScale < 1)
            nextScale = 1;
        else if (nextScale > 256)
            nextScale = 256;

        if (!cursor || cursor[0] == NaN || cursor[1] === NaN)
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