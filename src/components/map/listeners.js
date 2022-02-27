
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