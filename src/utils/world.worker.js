import { precalculate } from "modular-voronoi";
import { szudzik, lcg } from "./deterministic.js"

export const generateShape = (chunkX, chunkY, size) => {

    const sideLength = (2 * size + 1); 
    const prefixX = -size + chunkX * sideLength;
    const prefixY = -size + chunkY * sideLength;

    const points = new Array(sideLength*sideLength);
    for (let i = 0; i < sideLength; i++) {
        for (let j = 0; j < sideLength; j++) {
            const x = prefixX + i;
            const y = prefixY + j;
            const output = lcg(szudzik(x, y), 2);
            const positionedX = (i + (10 + (output % 81)) / 100)/sideLength;
            const positionedY = (j +  (10 + (lcg(output, 2) % 81)) / 100)/sideLength;
            points[i + j*sideLength] = [positionedX, positionedY];
        }
    }

    const voronoi = precalculate(points);
    postMessage(voronoi);
}