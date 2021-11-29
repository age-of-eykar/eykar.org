import { findCell } from "./gridManager";
import { biomeData } from "./biomes";

export class WListener {
  constructor(bottomRight, topLeft, setZoomIn, canvas) {
    this.bottomRight = bottomRight;
    this.topLeft = topLeft;
    this.setZoomIn = setZoomIn;
    this.canvas = canvas;
  }

  handleMouseWheel(event) {
    const mapWidth = this.bottomRight.x - this.topLeft.x;
    const mapHeight = this.bottomRight.y - this.topLeft.y;
    const mousePositionX = (event.offsetX / this.canvas.clientWidth) * mapWidth;
    const mousePositionY =
      (event.offsetY / this.canvas.clientHeight) * mapHeight;
    if (event.deltaY < 0) {
      this.setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: 1 });
    } else {
      this.setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: -1 });
    }
    event.preventDefault();
  }
}

export class KListeners {
  constructor(
    xStep,
    yStep,
    setRepeatStreak,
    repeatStreak,
    xPrefix,
    yPrefix,
    setXPrefix,
    setYPrefix,
    bottomRight,
    setBottomRight,
    topLeft,
    setTopLeft
  ) {
    this.xStep = xStep;
    this.yStep = yStep;
    this.setRepeatStreak = setRepeatStreak;
    this.repeatStreak = repeatStreak;
    this.xPrefix = xPrefix;
    this.yPrefix = yPrefix;
    this.setXPrefix = setXPrefix;
    this.setYPrefix = setYPrefix;
    this.bottomRight = bottomRight;
    this.setBottomRight = setBottomRight;
    this.topLeft = topLeft;
    this.setTopLeft = setTopLeft;
  }

  move(xPixels, yPixels) {
    let x = parseInt((this.xPrefix + xPixels) / this.xStep.current);
    let y = parseInt((this.yPrefix + yPixels) / this.yStep.current);
    let newPrefixX = this.xPrefix + xPixels - x * this.xStep.current;
    let newPrefixY = this.yPrefix + yPixels - y * this.yStep.current;
    if (2 * newPrefixX > this.xStep.current) {
      newPrefixX -= this.xStep.current;
      x++;
    }
    this.setXPrefix(newPrefixX);
    if (2 * newPrefixY > this.yStep.current) {
      newPrefixY -= this.yStep.current;
      y++;
    }
    this.setYPrefix(newPrefixY);
    this.setBottomRight({
      x: this.bottomRight.x - x,
      y: this.bottomRight.y - y,
    });
    this.setTopLeft({ x: this.topLeft.x - x, y: this.topLeft.y - y });
  }

  onKeyPressed(event) {
    let i;
    if (!event.repeat) {
      this.setRepeatStreak(0);
      i = (this.xStep.current + this.yStep.current) / 4;
    } else {
      this.setRepeatStreak(this.repeatStreak + 1);
      i = Math.min(
        this.repeatStreak,
        (this.xStep.current + this.yStep.current) / 4
      );
    }

    switch (event.key) {
      case "ArrowDown":
        this.move(0, -i);
        break;

      case "ArrowUp":
        this.move(0, i);
        break;

      case "ArrowLeft":
        this.move(i, 0);
        break;

      case "ArrowRight":
        this.move(-i, 0);
        break;

      default:
        break;
    }
  }
}

export class CListener {
  constructor(setPlotInfo, voronoi, coordinatesPerId, setPlot, contract) {
    this.voronoi = voronoi;
    this.setPlotInfo = setPlotInfo;
    this.coordinatesPerId = coordinatesPerId;
    this.setPlot = setPlot;
    this.contract = contract;
  }

  handleMouseClick(event) {
    const cell = findCell(event.offsetX, event.offsetY, this.voronoi);
    const [x, y] = this.coordinatesPerId.get(cell);
    let e, t, b;
    if (typeof x !== "undefined")
        [e, t, b] = biomeData(x, y);
    this.setPlotInfo({
      coord: { x: x, y: y },
      elevation: e,
      temperature: t,
      biome: b,
    });
    (async () => {
      this.setPlot(await this.contract.getPlot(x, y));
    })();
  }

}
