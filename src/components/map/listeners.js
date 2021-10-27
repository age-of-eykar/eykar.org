import { findCell, drawCell } from "./voronoiBis";


export default class Listeners {
    constructor(context, voronoi, drew, canvas, bottomRight, topLeft, setZoomIn) {
        this.context = context;
        this.voronoi = voronoi;
        this.drew = drew;
        this.canvas = canvas;
        this.bottomRight = bottomRight;
        this.topLeft = topLeft;
        this.setZoomIn = setZoomIn;
    }

    handleMouseMove(event) {
        let cell = findCell(event.offsetX, event.offsetY, this.voronoi);
        if (this.drew[0] !== cell) {
            this.drew.push(cell);
            drawCell(this.context, cell, '#ff0000', this.voronoi);
        }
        if (this.drew.length > 1) {
            drawCell(this.context, this.drew[0], '#1C1709', this.voronoi);
            this.drew.shift();
        }
    }
    
    handleMouseOut() {
        drawCell(this.context, this.drew[0], '#1C1709', this.voronoi);
    }
    
    handleMouseWheel(event) {
        console.log("youpi");
        const mapWidth = this.bottomRight.x - this.topLeft.x;
        const mapHeight = this.bottomRight.y - this.topLeft.y;
        const mousePositionX = event.offsetX / this.canvas.clientWidth * mapWidth;
        const mousePositionY = event.offsetY / this.canvas.clientHeight * mapHeight;
        if (event.deltaY < 0) {
          this.setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: 1 });
        }
        else {
          this.setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: -1 });
        }
        event.preventDefault();
    }
}