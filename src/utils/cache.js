import { szudzik } from "./deterministic.js"
import worker from 'workerize-loader!./world.worker'; // eslint-disable-line import/no-webpack-loader-syntax

export default class ChunksCache {

    constructor(capacity) {
        this.capacity = capacity;
        this.cached = new Map();
    }

    run(topLeft, bottomRight, display) {
        const ready = [];
        for (let x = Math.floor(topLeft.x / 16); x <= Math.ceil(bottomRight.x / 16); x++)
            for (let y = Math.floor(topLeft.y / 16); y <= Math.ceil(bottomRight.y / 16); y++) {
                const chunk = this.prepare(x, y);
                if (chunk)
                    ready.push(chunk);
            }
        ready.forEach(chunk => display(chunk));

    }

    prepare(x, y) {
        let chunk = this.cached.get(szudzik(x, y));
        if (chunk === undefined)
            chunk = new Chunk(x, y);
        // should be added to the end of the map
        this.cached.set(szudzik(x, y), chunk);

        while (this.cached.size > this.capacity)
            this.cached.delete(this.cached.keys().next().value);

        if (chunk.ready)
            return chunk;
    }

}

class Chunk {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.plots = new Map();
        this.ready = false;
        (async () => { this.prepare(); })();
    }

    async prepare() {
        let waitingCache = true;
        const workerInstance = worker()
        // Attach an event listener to receive calculations from your worker
        workerInstance.addEventListener('message', (message) => {

            if (message.data.delaunay) {
                console.log('New Message: ', message.data)
                this.shape = message.data;
                if (!waitingCache)
                    this.setReady();
            }
        })
        workerInstance.generateShape(this.x, this.y);
        const newPlots = await (await fetch("https://cache.eykar.org/colonies",
            {
                method: 'POST', body: JSON.stringify({
                    "xmin": this.x, "ymin": this.y,
                    "xmax": this.x + 16, "ymax": this.y + 16
                })
            })).json();
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
    }

}