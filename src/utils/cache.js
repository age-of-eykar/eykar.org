import { szudzik } from "./deterministic.js"

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
        this.ready = false;
        (async () => { this.prepare(); })();
    }

    prepare() {
        this.ready = true;
    }

}