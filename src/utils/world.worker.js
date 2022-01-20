import { Delaunay } from "d3-delaunay";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {
        const nbr = message.data;
        let Iterator = {
            _i: -1,
            _j: -1,
            id: 0,

            [Symbol.iterator]() {
                return this;
            },

            next() {
                console.log(this._i, this._j);
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
        console.log("yolo");
        const voronoi = Delaunay.from(Iterator).voronoi([0, 0, 1, 1]);
        console.log(voronoi)
        postMessage(voronoi);
    };
};