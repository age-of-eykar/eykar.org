import { precalculate } from "modular-voronoi";
import { getBiomeColors } from "./biomes";
import { szudzik, lcg } from "../../../utils/deterministic.js"

self.onmessage = ({ data: { chunkX, chunkY, size } }) => {
    const sideLength = (2 * size + 1);
    const prefixX = -size + chunkX * sideLength;
    const prefixY = -size + chunkY * sideLength;
    const points = new Array(Math.pow((sideLength + 2), 2));
    const colors = new Array(Math.pow(sideLength, 2));
    for (let i = 0; i <= sideLength + 1; i++) {
        for (let j = 0; j <= sideLength + 1; j++) {
            const x = prefixX + i - 1;
            const y = prefixY + j - 1;
            const id = szudzik(x, y);
            const output = lcg(id, 2);
            const positionedX = (i - 1 + (10 + (output % 81)) / 100) / sideLength;
            const positionedY = (j - 1 + (10 + (lcg(output, 2) % 81)) / 100) / sideLength;
            points[i + j * (sideLength + 2)] = [positionedX, positionedY];
        }
    }

    for (let i = 0; i < sideLength; i++)
        for (let j = 0; j < sideLength; j++) {
            const x = prefixX + i - 1;
            const y = prefixY + j - 1;
            [0.1, 0.7, 0.8, 1.0]
            colors[i + j * sideLength] = getBiomeColors(x, 2 * y);
        }

    const voronoi = precalculate(points, 2 * size + 3, 2 * size + 3);
    const shiftedPoints = voronoi.points.map((x, i) => sideLength * ((i % 2 == 0)
        ? chunkX + x - 0.5
        : chunkY + x - 0.5));
    const pointColors = new Float32Array(3 * shiftedPoints.length / 2);
    let lastStop = 0;
    for (let i = 0; i < voronoi.stops.length; i++) {
        for (let j = lastStop; j < voronoi.stops[i]; j++) {
            pointColors[3 * j] = colors[i][0];
            pointColors[3 * j + 1] = colors[i][1];
            pointColors[3 * j + 2] = colors[i][2];
        }
        lastStop = voronoi.stops[i];
    }

    self.postMessage({
        vertices: shiftedPoints, colors: pointColors
    }, null, [shiftedPoints, pointColors]);
};
