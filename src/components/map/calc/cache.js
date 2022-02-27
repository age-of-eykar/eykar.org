import { szudzik } from "../../../utils/deterministic.js"
import worker from 'workerize-loader!./world.worker'; // eslint-disable-line import/no-webpack-loader-syntax

export class ChunksCache {

    static halfsize = 8;
    static sideSize = 2 * ChunksCache.halfsize + 1;

    constructor(capacity) {
        this.capacity = capacity;
        this.cached = new Map();
    }

    run(center, scale, display) {
        const ready = [];
        const origin = {
            x: Math.trunc((center.x - ChunksCache.sideSize / 2) / ChunksCache.sideSize),
            y: Math.trunc((center.y - ChunksCache.sideSize / 2) / ChunksCache.sideSize)
        };
        const a = scale.width / (2 * ChunksCache.sideSize) + 2;
        const b = scale.height / (2 * ChunksCache.sideSize) + 2;
        for (let i = Math.trunc(-a); i < a + 1; i++)
            for (let j = Math.trunc(-b); j < b + 1; j++) {
                const chunk = this.prepare(origin.x + i, origin.y + j, display);
                if (chunk)
                    ready.push(chunk);
            }
        ready.forEach(chunk => display(chunk));
    }

    prepare(x, y, display) {

        let chunk = this.cached.get(szudzik(x, y));
        if (chunk === undefined)
            chunk = new Chunk(x, y, display);
        // should be added to the end of the map
        this.cached.set(szudzik(x, y), chunk);

        while (this.cached.size > this.capacity)
            this.cached.delete(this.cached.keys().next().value);

        if (chunk.ready)
            return chunk;
    }

}

class Chunk {
    constructor(x, y, display) {
        this.x = x;
        this.y = y;
        this.display = display;
        this.plots = new Map();
        this.ready = false;
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
        const workerInstance = worker()
        // Attach an event listener to receive calculations from your worker
        workerInstance.addEventListener('message', (message) => {
            if (message.data.shape !== undefined) {
                this.shape = message.data.shape;
                this.colors = message.data.colors;
                workerInstance.terminate();
                if (!waitingCache)
                    this.setReady();
            }
        })
        workerInstance.generateShape(this.x, this.y, ChunksCache.halfsize);
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

        if (this.shape)
            this.setReady();
    }

    setReady() {
        this.ready = true;
        this.display(this); // todo: fix visual bugs
    }

}

export const cache = new ChunksCache(1024);