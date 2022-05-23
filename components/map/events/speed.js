export default class SpeedControler {
    constructor(
        center, scale, windowSize
    ) {
        this.center = center;
        this.scale = scale;
        this.windowSize = windowSize;

        this.upLast = false;
        this.up = false;
        this.down = false;

        this.leftLast = false;
        this.left = false;
        this.right = false;

        this.controledSpeed = false;
    }

    takeControl() {
        if (this.controledSpeed)
        return;
        const angle = Math.random() * 2 * Math.PI;
        const multiplier = this.scale.current / 16;
        this.controledSpeed = { x: Math.cos(angle) * multiplier, y: Math.sin(angle) * multiplier };
    }

    releaseControl() {
        this.controledSpeed = false;
    }

    setCache(cache) {
        this.cache = cache;
    }

    // plots per second
    getSpeed() {
        let speed;
        if (this.controledSpeed)
            speed = this.controledSpeed;
        else {
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

            const norm = this.scale.current / 2;
            const size = Math.sqrt(norm * norm / 2);
            if (x !== 0 && y !== 0)
                speed = { x: x * size, y: y * size };
            else
                speed = { x: x * norm, y: y * norm };
        }
        this.refresh({
            x: this.center.current.x + speed.x / 2,
            y: this.center.current.y + speed.y / 2
        });
        return speed;
    }

    refresh(expectedCenter) {
        this.cache.refresh(expectedCenter, this.scale.current,
            this.windowSize.current.height / this.windowSize.current.width);
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

        this.getSpeed(this.center, this.scale);
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