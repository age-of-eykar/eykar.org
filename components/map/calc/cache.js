import { szudzik } from "../../../utils/deterministic";
import { createBufferInfoFromArrays, setAttribInfoBufferFromArray } from "twgl.js";
import { getColonyColor } from "../../../utils/colors";
import { getBiomeColors } from "./biomes";

export class ChunksCache {

    static halfsize = 48;
    static sideSize = 2 * ChunksCache.halfsize + 1;

    constructor(capacity, webgl) {
        this.capacity = capacity;
        this.webgl = webgl;
        this.cached = new Map();
    }

    forEachChunk(center, scale, display, ratio = 1) {
        const ready = [];
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale / (2 * ChunksCache.sideSize) + 1;
        const b = ratio * scale / (2 * ChunksCache.sideSize) + 1;
        let finished = true;
        for (let i = Math.trunc(-a); i < a + 1; i++)
            for (let j = Math.trunc(-b); j < b + 1; j++) {
                const chunk = this.cached.get(szudzik(origin.x + i, origin.y + j));
                if (chunk && chunk.ready)
                    ready.push(chunk);
                else if (finished)
                    finished = false;
            }
        ready.forEach(chunk => display(chunk));
        return finished;
    }

    refresh(center, scale, ratio = 1) {
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
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

    updateColors() {
        const topLeft = this.getTopLeft();
        for (const plot of this.colonies) {
            const [x, y] = [plot.x - topLeft.x, plot.y - topLeft.y];
            let [start, stop] = [0, this.stops[0]];
            if (x != 0 || y != 0) {
                const index = ChunksCache.halfsize + x + (y - 1) * ChunksCache.sideSize;
                start = this.stops[index - 1];
                stop = this.stops[index];
            }
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
