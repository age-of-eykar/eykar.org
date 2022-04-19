export class WheelControler {
    constructor(scale, setScale) {
        this.scale = scale;
        this.setScale = setScale;
        this.disabled = false;
    }

    handleMouseWheel(event) {
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;
        this.setScale(Math.min(Math.max(this.scale.current + change * this.scale.current, 1), 256))
    }

    takeControl() {
        this.disabled = true;
    }

    releaseControl() {
        this.disabled = false;
    }
}

export class MouseControler {
    constructor(
        center, scale, windowSize, canvasRef, onPlotClick, cache
    ) {
        this.center = center;
        this.scale = scale;
        this.windowSize = windowSize;
        this.canvasRef = canvasRef;
        this.onPlotClick = onPlotClick;
        this.cache = cache;
        this.isDown = false;
    }

    handleMouseDown(event) {
        if (event.target !== this.canvasRef.current)
            return;
        this.isDown = true;
        this.last = [
            event.offsetX,
            event.offsetY
        ];
        this.start = [
            event.offsetX,
            event.offsetY
        ];
    }

    handleMouseUp(event) {
        if (!this.isDown)
            return;
        this.isDown = false;
        const stop = [
            (this.scale.current / this.windowSize.current.width) * (event.offsetX - this.start[0]),
            (this.scale.current / this.windowSize.current.height) * (event.offsetY - this.start[1])
        ];

        const ratio = this.windowSize.current.width / this.windowSize.current.height;
        this.cache.refresh({
            x: this.center.current.x - stop[0] / 2,
            y: this.center.current.y + stop[1] / 2
        }, this.scale.current * 2,
            1 / ratio);

        if (stop[0] ** 2 + stop[1] ** 2 < 1.0) {
            let X = 2 * event.clientX / this.windowSize.current.width - 1;
            let Y = - (2 * event.clientY / this.windowSize.current.height - 1);
            const Cx = this.center.current.x
            const Cy = this.center.current.y
            const r = ratio
            const s = 2 / this.scale.current
            const p = 0.25
            const y = Cy + Y / (s * r * (1 - p * Y))
            const x = Cx + X / s + X * r * p * (y - Cy)
            this.onPlotClick(Math.floor(x), Math.floor(y))
        }
    }

    handleMouseMove(event) {
        if (event.target !== this.canvasRef.current &&
            event.target.tagName !== "HTML") {
            return;
        }

        // don't pan if mouse is not pressed
        if (!this.isDown) return;
        const norm = this.scale.current / this.windowSize.current.width;
        const x = (event.offsetX - this.last[0]) * norm;
        const y = (event.offsetY - this.last[1]) * norm;

        this.last = [event.offsetX, event.offsetY];
        this.center.current = { x: this.center.current.x - x, y: this.center.current.y + y };
    }

}

export class SpeedControler {
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