
import "./map.css";
import React, { useRef, useEffect, useState } from "react";
import { drawMap } from "./grid/biomes";
import { CListener, KListeners, WListener } from "../map/grid/listeners";
import ChunksCache from "../../utils/cache";
import { getDimensions, drawCell } from "../../utils/gridManager";

export function drawPolygon(points, context) {
  context.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
  context.beginPath();
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];
    context.lineTo(x, y);
  }
  context.lineTo(points[0][0], points[0][1]);
  context.fill();
  context.closePath();
}

function MapCanvas({ setClickedPlotCallback }) {

  const initialDimensions = getDimensions({ x: 0, y: 0 }, 48);

  const [topLeft, setTopLeft] = useState(initialDimensions.topLeft);
  const [bottomRight, setBottomRight] = useState(initialDimensions.bottomRight);
  const [zoomIn, setZoomIn] = useState({ x: 0, y: 0, zoom: 0 });

  const canvasRef = useRef(null);
  const cache = new ChunksCache(1024);

  const scale = window.devicePixelRatio;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth * scale,
    height: window.innerHeight * scale
  });

  const handleResize = () => setWindowSize({
    width: window.innerWidth * scale,
    height: window.innerHeight * scale
  })

  useEffect(() => {
    // canvas fixes
    const canvas = canvasRef.current;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const context = canvas.getContext("2d");
    context.scale(scale, scale);

    // cache and draw
    cache.run(topLeft, bottomRight, (chunk) => {
      const sideSize = Math.sqrt(chunk.shape.size)
      context.scale(500, 500);
      for (const [i, points] of chunk.shape) {
        if (points.length <= 2
          || i % sideSize === 0
          || i % sideSize === sideSize - 1
          || Math.floor(i / sideSize) === 0
          || Math.floor(i / sideSize) === sideSize - 1)
          continue;
        drawPolygon(points, context);
      }
      context.translate(0.9, 0.1);
      context.scale(1 / 500, 1 / 500);
    });
    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    context.fillRect(25, 25, 100, 100);

    // screen resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [
    windowSize,
    bottomRight,
    topLeft
  ]);

  return (
    <canvas
      className="map"
      ref={canvasRef}
      //onKeyDown={kListeners.onKeyPressed.bind(kListeners)}
      tabIndex={1}
    />
  );
}

export default MapCanvas;