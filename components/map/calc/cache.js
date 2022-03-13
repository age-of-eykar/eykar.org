import { szudzik } from "../../../utils/deterministic";

export class ChunksCache {

    static halfsize = 8;
    static sideSize = 2 * ChunksCache.halfsize + 1;

    constructor(capacity, webgl) {
        this.capacity = capacity;
        this.webgl = webgl;
        this.cached = new Map();
    }

    forEachChunk(center, scale, display) {
        const ready = [];
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale.width / (2 * ChunksCache.sideSize) + 1;
        const b = scale.height / (2 * ChunksCache.sideSize) + 1;
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

    refresh(center, scale) {
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale.width / (2 * ChunksCache.sideSize) + 2;
        const b = scale.height / (2 * ChunksCache.sideSize) + 2;
        for (let i = Math.trunc(-a); i < a; i++)
            for (let j = Math.trunc(-b); j < b; j++)
                this.prepare(origin.x + i, origin.y + j);
    }

    prepare(x, y) {
        let chunk = this.cached.get(szudzik(x, y));
        if (chunk === undefined)
            chunk = new Chunk(x, y, this.webgl.createBuffer(), this.webgl.createBuffer(), (chunk) => {
                this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, chunk.vertexBuffer);
                this.webgl.bufferData(this.webgl.ARRAY_BUFFER, chunk.vertexes, this.webgl.STATIC_DRAW);
                this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, chunk.colorBuffer);
                this.webgl.bufferData(this.webgl.ARRAY_BUFFER, chunk.colors, this.webgl.STATIC_DRAW);
            });
        // should be added to the end of the map
        this.cached.set(szudzik(x, y), chunk);

        while (this.cached.size > this.capacity)
            this.cached.delete(this.cached.keys().next().value);

        if (chunk.ready)
            return chunk;
    }

}

class Chunk {
    constructor(x, y, vertexBuffer, colorBuffer, refresh) {
        this.x = x;
        this.y = y;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
        this.plots = new Map();
        this.ready = false;
        this.refresh = refresh;
        (async () => { this.prepare(); })();
    }

    getTopLeft() {
        return {
            x: this.x * ChunksCache.sideSize - ChunksCache.sideSize / 2,
            y: this.y * ChunksCache.sideSize - ChunksCache.sideSize / 2
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
        worker.onmessage = ({ data: { vertexes, colors } }) => {
            this.vertexes = vertexes;
            this.colors = colors;
            worker.terminate();
            if (!waitingCache)
                this.setReady();
        };

        /*
        const newPlots = await (await fetch("https://cache.eykar.org/colonies",
            {
                method: 'POST', body: JSON.stringify({
                    "xmin": this.x, "ymin": this.y,
                    "xmax": this.x + ChunksCache.sideSize, "ymax": this.y + ChunksCache.sideSize
                })
            })).json();
            */
        const newPlots = [];
        waitingCache = false;

        for (const plotKey in newPlots) {
            const plot = newPlots[plotKey];
            this.plots.set(szudzik(plot.x, plot.y), plot.colony_id);
        }

        if (this.points)
            this.setReady();
    }

    setReady() {
        this.ready = true;
        this.refresh(this);
    }

}
