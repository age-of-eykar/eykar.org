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
        center, setCenter, scale
    ) {
        this.center = center;
        this.setCenter = setCenter;
        this.scale = scale;
    }

    move(x, y) {
        this.setCenter({ x: this.center.current.x + x, y: this.center.current.y + y });
    }

    onKeyPressed(event) {
        switch (event.key) {
            case "ArrowDown":
                this.move(0, -this.scale.current.height / 50);
                break;

            case "ArrowUp":
                this.move(0, this.scale.current.height / 50);
                break;

            case "ArrowLeft":
                this.move(-this.scale.current.width / 50, 0);
                break;

            case "ArrowRight":
                this.move(this.scale.current.width / 50, 0);
                break;

            default:
                break;
        }
    }
}