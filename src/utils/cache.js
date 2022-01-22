import { szudzik } from "./deterministic.js"
import worker from 'workerize-loader!./world.worker'; // eslint-disable-line import/no-webpack-loader-syntax

export default class ChunksCache {

    constructor(capacity) {
        this.capacity = capacity;
        this.cached = new Map();
    }

    run(topLeft, bottomRight, display) {
        const ready = [];
        for (let x = Math.floor(topLeft.x / 8); x <= Math.ceil(bottomRight.x / 8); x++)
            for (let y = Math.floor(topLeft.y / 8); y <= Math.ceil(bottomRight.y / 8); y++) {
                const chunk = this.prepare(x, y, display);
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

    async prepare() {
        let waitingCache = true;
        const workerInstance = worker()
        // Attach an event listener to receive calculations from your worker
        workerInstance.addEventListener('message', (message) => {
            if (message.data.delaunay) {
                this.shape = message.data;
                if (!waitingCache)
                    this.setReady();
            }
        })
        workerInstance.generateShape(this.x, this.y, 8);
        const newPlots = await (await fetch("https://cache.eykar.org/colonies",
            {
                method: 'POST', body: JSON.stringify({
                    "xmin": this.x, "ymin": this.y,
                    "xmax": this.x + 17, "ymax": this.y + 17
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

    render(context) {

    }

    _clip(i) {
        // degenerate case (1 valid point: return the box)
        if (i === 0 && this.delaunay.hull.length === 1) {
          return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        const points = this._cell(i);
        if (points === null) return null;
        const {vectors: V} = this;
        const v = i * 4;
        return V[v] || V[v + 1]
            ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
            : this._clipFinite(i, points);
      }

    setReady() {
        this.ready = true;
        this.display(this);
    }

}