import { ChunksCache } from "./calc/cache";

export class WheelListener {
    constructor(scale, setScale) {
        this.scale = scale;
        this.setScale = setScale;
    }

    handleMouseWheel(event) {
        const change = event.deltaY / 1000;
        this.setScale({
            width: Math.min(Math.max(this.scale.current.width + change * this.scale.current.width, 1), 256),
            height: Math.min(Math.max(this.scale.current.height + change * this.scale.current.height, 1), 256)
        })
        event.preventDefault();
    }
}

export class KeyListeners {
    constructor(
        center, scale
    ) {
        this.center = center;
        this.scale = scale;
        this.lastUpdate = performance.now();

        this.upLast = false;
        this.up = false;
        this.down = false;

        this.leftLast = false;
        this.left = false;
        this.right = false;
    }

    setCache(cache) {
        this.cache = cache;
    }

    // plots per second
    getSpeed() {
        let x;
        let y;
        if (this.up && this.upLast)
            y = 1;
        else if (this.down)
            y = -1;
        else
            y = 0;

        if (this.left && this.leftLast)
            x = -1;
        else if (this.right)
            x = 1;
        else
            x = 0;

        const norm = this.scale.current.width / 2;
        const size = Math.sqrt(norm * norm / 2);
        if (x !== 0 && y !== 0)
            return { x: x * size, y: y * size };
        else
            return { x: x * norm, y: y * norm };
    }

    refresh(expectedCenter) {
        this.cache.refresh(expectedCenter, this.scale.current);
        this.lastUpdate = performance.now();
    }

    onKeyDown(event) {

        switch (event.key) {
            case "ArrowDown":
                this.down = true;
                this.upLast = false;
                break;

            case "ArrowUp":
                this.up = true;
                this.upLast = true;
                break;

            case "ArrowLeft":
                this.left = true;
                this.leftLast = true;
                break;

            case "ArrowRight":
                this.right = true;
                this.leftLast = false;
                break;

            default:
                break;
        }

        const speed = this.getSpeed(this.center, this.scale);
        this.refresh({
            x: this.center.current.x + speed.x / 2,
            y: this.center.current.y + speed.y / 2
        });
    }

    onKeyUp(event) {

        switch (event.key) {
            case "ArrowDown":
                this.down = false;
                break;

            case "ArrowUp":
                this.up = false;
                break;

            case "ArrowLeft":
                this.left = false;
                break;

            case "ArrowRight":
                this.right = false;
                break;

            default:
                break;
        }
    }
}