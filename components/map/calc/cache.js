import { szudzik } from "../../../utils/deterministic";
import { createBufferInfoFromArrays, setAttribInfoBufferFromArray } from "twgl.js";
import { getColonyColor } from "../../../utils/colors";
import { isInsideConvex } from '../../../utils/polygon';
import { getBiomeColors } from "./biomes";

export class ChunksCache {

    static halfsize = 48;
    static sideSize = 2 * ChunksCache.halfsize + 1;

    constructor(capacity, webgl) {
        this.capacity = capacity;
        this.webgl = webgl;
        this.cached = new Map();
    }

    forEachChunk(center, scale, foo, ratio = 1, margin = 1) {
        const ready = [];
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y + scale / 16 - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale / (2 * ChunksCache.sideSize) + margin;
        const b = ratio * scale / (2 * ChunksCache.sideSize) + margin;
        let finished = true;
        for (let i = Math.trunc(-a); i < a + 1; i++)
            for (let j = Math.trunc(-b); j < b + 1; j++) {
                const chunk = this.cached.get(szudzik(origin.x + i, origin.y + j));
                if (chunk && chunk.ready)
                    ready.push(chunk);
                else if (finished)
                    finished = false;
            }
        ready.forEach(chunk => foo(chunk));
        return finished;
    }

    refresh(center, scale, ratio = 1) {
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y + scale / 16 - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale / (2 * ChunksCache.sideSize) + 2;
        const b = ratio * scale / (2 * ChunksCache.sideSize) + 2;
        for (let i = Math.trunc(-a); i < a; i++)
            for (let j = Math.trunc(-b); j < b; j++)
                this.prepare(origin.x + i, origin.y + j);
    }

    prepare(x, y) {
        let chunk = this.cached.get(szudzik(x, y));
        if (chunk === undefined)
            chunk = new Chunk(x, y, (chunk, vertices, colors) => {
                chunk.bufferInfo = createBufferInfoFromArrays(this.webgl, {
                    position: { numComponents: 2, data: vertices },
                    fillColor: { numComponents: 3, data: colors }
                });
            },
                (chunk) => {
                    setAttribInfoBufferFromArray(this.webgl, chunk.bufferInfo.attribs.fillColor, chunk.colors);
                },
            );
        // should be added to the end of the map
        this.cached.set(szudzik(x, y), chunk);
        while (this.cached.size > this.capacity) {
            const key = this.cached.keys().next().value;
            const chunk = this.cached.get(key);
            this.webgl.deleteBuffer(chunk.vertexBuffer);
            this.webgl.deleteBuffer(chunk.colorBuffer);
            this.cached.delete(key);
        }

        if (chunk.ready)
            return chunk;
    }

    estimatePlot(X, Y, center, scale, ratio) {
        const Cx = center.x
        const Cy = center.y
        const r = ratio
        const s = 2 / scale
        const p = 0.25
        const y = Cy + Y / (s * r * (1 - p * Y))
        const x = Cx + X / s + X * r * p * (y - Cy)
        return [x, y];
    }

    getPlotEdges(plot) {
        let vertices;
        let chunkFound;
        this.forEachChunk(plot, 0, (chunk) => {
            vertices = chunk.getVertices(plot);
            chunkFound = chunk;
        }, 1, 0);
        if (vertices === undefined || vertices[0] === undefined)
            return [undefined, undefined];
        const output = [vertices[0], vertices[1]];
        for (let i = 2; i < vertices.length; i += 3)
            output.push(vertices[i]);
        return [output, chunkFound];
    }

    getPlotAt(X, Y, center, scale, ratio) {
        const [x, y] = this.estimatePlot(X, Y, center, scale, ratio);
        const flooredX = Math.floor(x);
        const flooredY = Math.floor(y);
        return [flooredX, flooredY];
        const [vertices, _] = this.getPlotEdges({ x: flooredX, y: flooredY });
        if (vertices === undefined)
            return undefined;
        if (isInsideConvex([x, y], vertices))
            return [flooredX, flooredY]
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                if (i == j && i == 0)
                    continue;
                const [vertices, _] = this.getPlotEdges({ x: flooredX + i, y: flooredY + j })
                if (vertices === undefined)
                    continue;
                if (isInsideConvex([x, y], vertices))
                    return [flooredX + i, flooredY + j]
            }
    }

    getVerticesAt(X, Y, center, scale, ratio) {
        const coo = this.getPlotAt(X, Y, center, scale, ratio);
        if (!coo)
            return;
        const plot = { x: coo[0], y: coo[1] };
        let stops;
        let finalChunk;
        this.forEachChunk(plot, 0, (chunk) => {
            stops = chunk.getStops(plot);
            finalChunk = chunk;
        }, 1, 0);
        return [stops[0], stops[1], finalChunk.x, finalChunk.y];
    }

}

class Chunk {
    constructor(x, y, loadBuffer, updateColorBuffer) {
        this.x = x;
        this.y = y;
        this.ready = false;
        this.loadBuffer = loadBuffer;
        this.updateColorBuffer = updateColorBuffer;
        (async () => { this.prepare(); })();
    }

    getTopLeft() {
        return {
            x: this.x * ChunksCache.sideSize - ChunksCache.sideSize / 2,
            y: this.y * ChunksCache.sideSize - ChunksCache.sideSize / 2
        }
    }

    getStops(plot) {
        const topLeft = this.getTopLeft();
        const [x, y] = [plot.x - topLeft.x, plot.y - topLeft.y];
        let [start, stop] = [0, this.stops[0]];
        if (x != 0 || y != 0) {
            const index = ChunksCache.halfsize + x + (y - 1) * ChunksCache.sideSize;
            start = this.stops[index - 1];
            stop = this.stops[index];
        }
        return [start, stop];
    }

    getVertices(plot) {
        const [start, stop] = this.getStops(plot);
        const output = [];
        for (let i = start; i < stop; i++)
            output.push([this.vertices[i * 2], this.vertices[i * 2 + 1]]);
        return output;
    }

    updateColors() {
        for (const plot of this.colonies) {
            let [start, stop] = this.getStops(plot)
            const [br, bg, bb] = getBiomeColors(plot.x, plot.y * 2);
            const [r, g, b] = getColonyColor(plot.colony_id);
            for (let i = start; i < stop; i++) {
                this.colors[i * 3] = 0.5 * br + 0.5 * r;
                this.colors[i * 3 + 1] = 0.5 * bg + 0.5 * g;
                this.colors[i * 3 + 2] = 0.5 * bb + 0.5 * b;
            }
        }
    }

    async prepare() {
        let waitingCache = true;

        const worker = new Worker(new URL('./world.worker.js', import.meta.url));
        worker.postMessage({
            chunkX: this.x,
            chunkY: this.y,
            size: ChunksCache.halfsize
        });
        worker.onmessage = ({ data: { vertices, colors, stops } }) => {
            worker.terminate();
            this.vertices = vertices;
            this.colors = colors;
            this.stops = stops;
            if (!waitingCache)
                this.updateColors();
            this.loadBuffer(this, vertices, colors);
            this.ready = true;
        };

        const topLeft = this.getTopLeft();
        this.colonies = await (await fetch("https://cache.eykar.org/colonies",
            {
                method: 'POST', body: JSON.stringify({
                    "xmin": topLeft.x, "ymin": topLeft.y,
                    "xmax": topLeft.x + ChunksCache.sideSize, "ymax": topLeft.y + ChunksCache.sideSize
                })
            })).json();

        waitingCache = false;
        if (this.ready) {
            this.updateColors();
            this.updateColorBuffer(this);
        }
    }

}
