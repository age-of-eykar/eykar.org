import { convertCoordinates } from "../../../utils/map/utils";

export default class ZoomControler {
    constructor(center, scale, windowSize, selector, setScale, setDist) {
        this.center = center;
        this.scale = scale;
        this.windowSize = windowSize;
        this.selector = selector;
        this.setScale = setScale;
        this.disabled = false;
        this.scaling = false;
        this.pinch_data = undefined;
        this.screen_ratio = this.windowSize.current.width / this.windowSize.current.height;
        this.setDist = setDist;
    }

    setPanningControler(panningControler) {
        this.panningControler = panningControler;
    }

    handlePinchStart(event) {
        if (event.touches.length === 2) {
            event.preventDefault();
            this.pinch_data = {
                touches: event.touches,
                dist: Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY),
                center: this.center.current,
                scale: this.scale.current
            };
            this.scaling = true;
        }
    }

    handlePinchMove(event) {
        event.preventDefault();
        if (this.scaling) {

            const center_shift = {
                x: this.pinch_data.center.x - this.pinch_data.touches[1].clientX,
                y: this.pinch_data.center.y - this.pinch_data.touches[1].clientY
            };

            const ratio = this.pinch_data.dist / Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY);
            this.setDist(this.pinch_data.touches[0].clientX)

            let nextScale = this.pinch_data.scale * ratio;
            if (nextScale < 1)
                nextScale = 1;
            else if (nextScale > 256)
                nextScale = 256;

            this.panningControler.movePanning(event.touches[1].clientX - center_shift.x / nextScale,
                event.touches[1].clientY - center_shift.y / nextScale);

            this.setScale(nextScale);

        }
    }

    handlePinchEnd(event) {
        if (this.scaling) {
            this.pinch_data = undefined;
            this.scaling = false;
        }
    }

    handleMouseWheel(event) {
        //event.preventDefault();
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;

        const cursor = this.selector.cursor;
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