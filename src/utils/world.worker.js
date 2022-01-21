import { Delaunay } from "d3-delaunay";

export const generateShape = (x, y) => {

    let Iterator = {
        _i: -1,
        _j: -1,
        id: 0,

        [Symbol.iterator]() {
            return this;
        },

        next() {
            if (this._j >= 16) {
                this._i++;
                this._j = -1;
                return { done: false, value: [0, 0] };
            } else {
                this._j++;
                return { done: this._i >= 16, value: [0, 1] };
            }
        },
    };
    const voronoi = Delaunay.from(Iterator).voronoi([0, 0, 1, 1]);
    postMessage(voronoi);
}