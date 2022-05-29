import { convertCoordinates } from "../../utils/map/utils";
import { isConquerMode } from "../../utils/models/game";
import { getCache } from "../../utils/models/game";

export class Selector {

    constructor(windowSize, center, scale) {
        this.windowSize = windowSize;
        this.center = center;
        this.scale = scale;
        this.lastMove = performance.now();
        this.selectedColor = [0.15, 0.15, 0.15];
        this.selected = undefined;
    }

    select(px, py) {
        const X = 2 * px * window.devicePixelRatio / this.windowSize.current.width - 1;
        const Y = - (2 * py * window.devicePixelRatio / this.windowSize.current.height - 1);
        this.X = X;
        this.Y = Y;
        this.updateSelect();
    }

    updateSelect() {
        const ratio = this.windowSize.current.width / this.windowSize.current.height;
        this.cursor = convertCoordinates(this.X, this.Y, this.center.current, this.scale.current, ratio);

        const now = performance.now();
        if (now - this.lastMove < 10)
            return;
        this.lastMove = now;
        const coo = getCache().getPlotAt(this.cursor[0], this.cursor[1]);

        if (isConquerMode())
            this.selectedColor = getCache().getNearColonyColor(coo);

        const output = getCache().getVerticesStopsAt(coo);
        this.selected = output;
    }

}