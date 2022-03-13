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
        cache, speed, center, scale
    ) {
        this.cache = cache;
        this.speed = speed; // plots per second
        this.center = center;
        this.scale = scale;
        this.lastUpdate = performance.now();

        this.down = false;
        this.up = false;
        this.left = false;
        this.right = false;
    }

    refresh(expectedCenter) {
        const deltaTime = performance.now() - this.lastUpdate;
        const timePerChunk = 1000 * ChunksCache.sideSize / (this.scale.current.height / 5);
        if (deltaTime < timePerChunk / 2)
            return;
        this.cache.refresh(expectedCenter, this.scale.current);
        this.lastUpdate = performance.now();
    }

    onKeyDown(event) {

        switch (event.key) {
            case "ArrowDown":
                this.speed.current.y = -this.scale.current.height / 2;
                this.down = true;
                break;

            case "ArrowUp":
                this.speed.current.y = this.scale.current.height / 2;
                this.up = true;
                break;

            case "ArrowLeft":
                this.speed.current.x = -this.scale.current.height / 2;
                this.left = true;
                break;

            case "ArrowRight":
                this.speed.current.x = this.scale.current.height / 2;
                this.right = true;
                break;

            default:
                break;
        }

        this.refresh({
            x: this.center.current.x + this.speed.current.x / 2,
            y: this.center.current.y + this.speed.current.y / 2
        });
    }

    onKeyUp(event) {

        switch (event.key) {
            case "ArrowDown":
                this.speed.current.y = 0;
                this.down = false;
                if (this.up)
                    this.speed.current.y = -this.scale.current.height / 2;
                break;

            case "ArrowUp":
                this.speed.current.y = 0;
                this.up = false;
                if (this.down)
                    this.speed.current.y = this.scale.current.height / 2;
                break;

            case "ArrowLeft":
                this.speed.current.x = 0;
                this.left = false;
                if (this.right)
                    this.speed.current.x = this.scale.current.height / 2;
                break;

            case "ArrowRight":
                this.speed.current.x = 0;
                this.right = false;
                if (this.left)
                    this.speed.current.x = -this.scale.current.height / 2;
                break;

            default:
                break;
        }
    }
}