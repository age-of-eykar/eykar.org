import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect, useState } from "react"
import { MListeners, KListeners } from "./listeners.js"
import { getTileCenter } from "./voronoiBis.js"
import { perlin1 } from "../../utils/perlinNoise.js"
import { drawCell } from "./voronoiBis.js"

function MapCanvas({ initialBottomRight, initialTopLeft, setCell, setCoord, coordinatesPerId, setCoordinatesPerId }) {
  
  const canvasRef = useRef(null)
  const [bottomRight, setBottomRight] = useState(initialBottomRight);
  const [topLeft, setTopLeft] = useState(initialTopLeft);
  const [xPrefix, setXPrefix] = useState(0);
  const [yPrefix, setYPrefix] = useState(0);
  const [zoomIn, setZoomIn] = useState({ x: 0, y: 0, zoom: 0 });
  const xStep = useRef(1);
  const yStep = useRef(1);

  useEffect(() => {
    
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext('2d')
    context.scale(scale, scale);

    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    xStep.current = context.canvas.width / (scale * (mapWidth + 1));
    yStep.current = context.canvas.height / (scale * (mapHeight + 1));

    let Iterator = {
      _i: -1,
      _j: -1,
      id: 0,

      [Symbol.iterator]() {
        return this;
      },

      next() {
        let center = getTileCenter(topLeft.x, this._i, topLeft.y, this._j, xStep.current, yStep.current,
          xPrefix, yPrefix);
          coordinatesPerId.set(this.id++, [Math.floor(this._i + topLeft.x), Math.floor(this._j + topLeft.y)]);
        if (this._j >= mapHeight + 1) {
          this._i++;
          this._j = -1;
          return { done: false, value: [center.x, center.y] };
        } else {
          this._j++;
          return { done: this._i > mapWidth + 2, value: [center.x, center.y] };
        }
      }
    };

    const voronoi = Delaunay.from(Iterator).voronoi([0, 0, canvas.width, canvas.height]);
    let drew;
    const listeners = new MListeners(context, voronoi, drew, canvas,
      bottomRight, topLeft, setZoomIn, setCell, setCoord);

    const listenMouseOut = listeners.handleMouseOut.bind(listeners);
    const listenMouseWheel = listeners.handleMouseWheel.bind(listeners);
    const listenMouseMove = listeners.handleMouseMove.bind(listeners);

    canvas.addEventListener('mousewheel', listenMouseWheel);
    canvas.addEventListener('mousemove', listenMouseMove);
    canvas.addEventListener('mouseout', listenMouseOut);

    context.beginPath();
    let r, g, b;

    for (let i = 0; i < voronoi._circumcenters.length; i++) {
      r = (perlin1(10, 1, 0.5, i, i)+1)*127.5;
      drawCell(context, i, "rgb("+r+","+r+","+r+")", voronoi, "#ffffff")
    }
    context.closePath();

    return () => {
      canvas.removeEventListener('mousewheel', listenMouseWheel)
      canvas.removeEventListener('mousemove', listenMouseMove)
      canvas.removeEventListener('mouseout', listenMouseOut)
    }
  }, [bottomRight, topLeft, xPrefix, yPrefix])

  if (zoomIn.zoom !== 0) {
    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    setZoomIn({ x: zoomIn.x, y: zoomIn.y, zoom: 0 });
    if (zoomIn.zoom === 1) {
      const newTopLeft = { x: topLeft.x + 0.05 * zoomIn.x, y: topLeft.y + 0.05 * zoomIn.y };
      const newBottomRight = { x: 0.95 * mapWidth + newTopLeft.x, y: 0.95 * mapHeight + newTopLeft.y };
      setXPrefix(newTopLeft.x - Math.trunc(newTopLeft.x));
      setYPrefix(newTopLeft.y - Math.trunc(newTopLeft.y));
      setTopLeft(newTopLeft);
      setBottomRight(newBottomRight);
    } else {
      const newTopLeft = { x: topLeft.x - 0.05 * zoomIn.x, y: topLeft.y - 0.05 * zoomIn.y };
      const newBottomRight = { x: 1.05 * mapWidth + newTopLeft.x, y: 1.05 * mapHeight + newTopLeft.y };
      setTopLeft(newTopLeft);
      setBottomRight(newBottomRight);
    }
  }

  const [repeatStreak, setRepeatStreak] = useState(0);

  const kListeners = new KListeners(
    xStep, yStep, setRepeatStreak, repeatStreak, xPrefix, yPrefix, setXPrefix, setYPrefix,
    bottomRight, setBottomRight, topLeft, setTopLeft
  );

  return <canvas className="map" onKeyDown={kListeners.onKeyPressed.bind(kListeners)}
    tabIndex={0} ref={canvasRef} />
}

export default MapCanvas