import { createBufferInfoFromArrays, setAttribInfoBufferFromArray } from "twgl.js";
import { szudzik, reversedSzudzik } from "../deterministic";
import { getColonyColor } from "../colors";
import { isInsideConvex } from '../polygon';
import { getBiomeColors } from "./biomes";
import { ownsColony } from "../models/game";

export class ChunksCache {

    static halfsize = 48;
    static sideSize = 2 * ChunksCache.halfsize + 1;

    constructor(capacity, webgl) {
        this.capacity = capacity;
        this.webgl = webgl;
        this.cached = new Map();
    }

    /**
     * Returns the coordinates of a chunk from plot coordinates
     * @param {number} x coordinate of the plot
     * @param {number} y coordinate of the plot
     * @returns {x:number, y:number} the chunk coordinates
     **/
    getChunkCoordinates(x, y) {
        let x_origin = x / ChunksCache.sideSize
        x_origin = (Math.abs(x_origin) < 0.5) ? 0 : Math.trunc(x_origin + (x_origin > 0 ? 0.5 : -0.5))
        let y_origin = y / ChunksCache.sideSize
        y_origin = (Math.abs(y_origin) < 0.5) ? 0 : Math.trunc(y_origin + (y_origin > 0 ? 0.5 : -0.5))
        return { x: x_origin, y: y_origin }
    }

    getChunk(x, y) {
        return this.cached.get(szudzik(x, y));
    }

    forEachChunk(center, scale, foo, ratio = 1, margin = 1) {
        const ready = [];
        const origin = this.getChunkCoordinates(center.x, center.y + scale / 16);
        const a = scale / (2 * ChunksCache.sideSize) + margin;
        const b = ratio * scale / (2 * ChunksCache.sideSize) + margin;
        let finished = true;
        for (let i = Math.trunc(-a); i < a + 1; i++)
            for (let j = Math.trunc(-b); j < b + 1; j++) {
                const chunk = this.getChunk(origin.x + i, origin.y + j);
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
        let chunk = this.getChunk(x, y);
        if (chunk === undefined) {
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
        }
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

    getPlotEdges(plot) {
        const coo = this.getChunkCoordinates(plot.x, plot.y);
        const chunk = this.getChunk(coo.x, coo.y);
        if (!chunk || !chunk.ready)
            return [undefined, undefined];
        const vertices = chunk.getVertices(plot);
        if (vertices === undefined || vertices[0] === undefined)
            return [undefined, undefined];
        const output = [vertices[0], vertices[1]];
        for (let i = 2; i < vertices.length; i += 3)
            output.push(vertices[i]);
        return [output, chunk];
    }

    getPlotAt(x, y) {
        const flooredX = Math.floor(x);
        const flooredY = Math.floor(y);

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

    getVerticesStopsAt(coo) {
        if (!coo)
            return;
        const plot = { x: coo[0], y: coo[1] };

        const chunkCoo = this.getChunkCoordinates(plot.x, plot.y);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        if (!chunk || !chunk.ready)
            return;
        const stops = chunk.getStops(plot);

        if (stops)
            return [stops[0], stops[1], chunk.x, chunk.y];
    }

    isColonized(coo) {
        // returns true if coo is adjacent to a colony plot
        if (!coo)
            return;
        const chunkCoo = this.getChunkCoordinates(coo[0], coo[1]);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        if (chunk) {
            const colonyId = chunk.colonized.get(szudzik(coo[0], coo[1]));
            if (colonyId)
                return true;
        }
        return false;
    }

    isOwnedColony(coo) {
        // returns true if coo is adjacent to a colony plot
        if (!coo)
            return;
        const chunkCoo = this.getChunkCoordinates(coo[0], coo[1]);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        if (chunk) {
            const colonyId = chunk.colonized.get(szudzik(coo[0], coo[1]));
            if (ownsColony(colonyId))
                return true;
        }
        return false;
    }

    getExtendOfColony(coo) {
        // returns true if coo is adjacent to a colony plot
        if (!coo)
            return;
        const chunkCoo = this.getChunkCoordinates(coo[0], coo[1]);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        if (chunk)
            for (let i = -1; i <= 1; i++)
                for (let j = -1; j <= 1; j++) {
                    if (i == j && i == 0)
                        continue;
                    const colonyId = chunk.colonized.get(szudzik(coo[0] + i, coo[1] + j));
                    if (ownsColony(colonyId))
                        return colonyId;
                }
        return false;
    }

    getNearColonyColor(coo) {
        const colonyId = this.getExtendOfColony(coo);
        if (colonyId) {
            const [r, g, b] = getColonyColor(colonyId);
            const norm = 2 * Math.sqrt(r * r + g * g + b * b);
            return [r / norm, g / norm, b / norm];
        }
        return [0.15, 0.15, 0.15];
    }

    updateCachedColonyId(x, y, colonyId) {
        const chunkCoo = this.getChunkCoordinates(x, y);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        const key = szudzik(x, y);
        if (chunk) {
            chunk.colonized.set(key, colonyId);
            chunk.updateColors();
            chunk.updateColorBuffer(chunk);
        }
    }

    getCachedColonyId(x, y) {
        const chunkCoo = this.getChunkCoordinates(x, y);
        const chunk = this.getChunk(chunkCoo.x, chunkCoo.y);
        const key = szudzik(x, y);
        if (chunk)
            return chunk.colonized.get(key) || 0;
        return 0;
    }

}

class Chunk {
    constructor(x, y, loadBuffer, updateColorBuffer) {
        this.x = x;
        this.y = y;
        this.ready = false;
        this.loadBuffer = loadBuffer;
        this.updateColorBuffer = updateColorBuffer;
        this.colonized = new Map();
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
        const [x, y] = [plot.x - topLeft.x + 1, plot.y - topLeft.y + 1];
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
        for (const [szudziked, colony_id] of this.colonized) {
            const [x, y] = reversedSzudzik(szudziked)
            let [start, stop] = this.getStops({ x, y })
            const [br, bg, bb] = getBiomeColors(x, y);
            const [r, g, b] = getColonyColor(colony_id);
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
        worker.onmessage = ({ data: { vertices, colors, stops, assets } }) => {
            worker.terminate();
            this.vertices = vertices;
            this.colors = colors;
            this.stops = stops;
            this.assets = assets;
            if (!waitingCache)
                this.updateColors();
            this.loadBuffer(this, vertices, colors);

            this.ready = true;
        };

        const topLeft = this.getTopLeft();
        const coloniesResp = await (await fetch("https://cache.eykar.org/colonies",
            {
                method: 'POST', body: JSON.stringify({
                    "xmin": topLeft.x, "ymin": topLeft.y,
                    "xmax": topLeft.x + ChunksCache.sideSize, "ymax": topLeft.y + ChunksCache.sideSize
                })
            })).json();

        for (const colony of coloniesResp)
            this.colonized.set(szudzik(colony.x, colony.y), colony.colony_id);

        waitingCache = false;
        if (this.ready) {
            this.updateColors();
            this.updateColorBuffer(this);
        }
    }

}
