export class WheelListener {
    constructor(scale, setScale) {
        this.scale = scale;
        this.setScale = setScale;
    }

    handleMouseWheel(event) {
        const change = event.deltaY / 1000;
        this.setScale({
            width: Math.min(Math.max(this.scale.width + change * this.scale.width, 1), 200),
            height: Math.min(Math.max(this.scale.height + change * this.scale.height, 1), 200)
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
        this.setCenter({ x: this.center.x + x, y: this.center.y + y });
    }

    onKeyPressed(event) {
        let i = 1;

        switch (event.key) {
            case "ArrowDown":
                this.move(0, i);
                break;

            case "ArrowUp":
                this.move(0, -i);
                break;

            case "ArrowLeft":
                this.move(-i, 0);
                break;

            case "ArrowRight":
                this.move(i, 0);
                break;

            default:
                break;
        }
    }
}