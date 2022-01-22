import { Delaunay } from "d3-delaunay";
import { szudzik, lcg } from "./deterministic.js"

export const generateShape = (chunkX, chunkY, size) => {

    const prefixX = -size + chunkX * (2 * size + 1);
    const prefixY = -size + chunkY * (2 * size + 1);

    let Iterator = {
        _i: -1,
        _j: -1,
        id: 0,

        [Symbol.iterator]() {
            return this;
        },

        next() {
            const coordinateX = prefixX + this._i;
            const coordinateY = prefixY + this._j;
            const output = lcg(szudzik(coordinateX, coordinateY), 2);
            // get a deterministic shift between 0.1 and 0.9
            const x = coordinateX + (10 + (output % 81)) / 100;
            const y = coordinateY + (10 + (lcg(output, 2) % 81)) / 100;
            if (this._j === 2 * size) {
                this._i++;
                this._j = -1;
                return { done: false, value: [x, y] };
            } else {
                this._j++;
                return { done: this._i >= 16, value: [x, y] };
            }
        },
    };
    const voronoi = Delaunay.from(Iterator).voronoi([0, 0, 1, 1]);
    console.log("inside worker:", voronoi);
    postMessage(voronoi);
}