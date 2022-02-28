export class WheelListener {
    constructor(scale, setScale) {
        this.scale = scale;
        this.setScale = setScale;
    }

    handleMouseWheel(event) {
        const change = event.deltaY / 1000;
        this.setScale({
            width: Math.min(Math.max(this.scale.width + change * this.scale.width, 1), 250),
            height: Math.min(Math.max(this.scale.height + change * this.scale.height, 1), 250)
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

        switch (event.key) {
            case "ArrowDown":
                this.move(0, this.scale.height / 50);
                break;

            case "ArrowUp":
                this.move(0, -this.scale.height / 50);
                break;

            case "ArrowLeft":
                this.move(-this.scale.width / 50, 0);
                break;

            case "ArrowRight":
                this.move(this.scale.width / 50, 0);
                break;

            default:
                break;
        }
    }
}