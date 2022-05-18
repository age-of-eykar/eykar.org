
export default class ZoomControler {
    constructor(center, scale, selector, setScale) {
        this.center = center;
        this.scale = scale;
        this.selector = selector;
        this.setScale = setScale;
        this.disabled = false;
    }




    handleMouseWheel(event) {
        if (this.disabled)
            return;
        const change = event.deltaY / 1000;
        this.scale.current / 256;

        /*
                const side1 = this.selector.cursor[0] - this.center.current.x;
                const side2 = this.selector.cursor[1] - this.center.current.y;
                const dist = Math.sqrt(side1*side1 + side2*side2)/181;
        
                this.center.current = { x: this.center.current.x + side1/100,
                y: this.center.current.y + side2/100 };
                console.log(this.center.current)
        */
        this.setScale(Math.min(Math.max(this.scale.current + change * this.scale.current, 1), 256))
        this.selector.updateSelect();
    }

    takeControl() {
        this.disabled = true;
    }

    releaseControl() {
        this.disabled = false;
    }
}