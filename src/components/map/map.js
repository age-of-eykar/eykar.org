
import "./map.css";
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { drawMap } from "./grid/biomes";
import { KeyListeners } from "./listeners";
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

  // center of the map (normal coordinates)
  const [center, setCenter] = useState({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const [scale, setScale] = useState({ width: 32.0, height: 32.0 });

  const keyListeners = new KeyListeners(center, setCenter);

  const canvasRef = useRef(null);
  const cache = new ChunksCache(1024);
  const pixelRatio = window.devicePixelRatio;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  });

  const handleResize = () => setWindowSize({
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  })

  useEffect(() => {
    // canvas fixes
    const canvas = canvasRef.current;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const context = canvas.getContext("2d");
    context.scale(windowSize.width, windowSize.height);
    // move to the center of the screen
    context.translate(1 / 2, 1 / 2);
    // make y axis proportional to x axis
    const screenRatio = windowSize.width / windowSize.height;
    context.scale(1, screenRatio);
    // make x axis of size
    context.scale(1 / scale.width,
      1 / scale.height);

    cache.run(center, scale, (chunk) => {
      const topLeft = chunk.getTopLeft();
      context.translate(topLeft.x, topLeft.y)
      context.scale(ChunksCache.sideSize, ChunksCache.sideSize);
      for (const [_, points] of chunk.shape)
        drawPolygon(points, context);
      context.scale(1 / ChunksCache.sideSize, 1 / ChunksCache.sideSize);
      context.translate(-topLeft.x, -topLeft.y)
    });

    // screen resize
    const handler = debounce(() => handleResize(), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [
    windowSize, center, scale
  ]);

  return (
    <canvas
      className="map"
      ref={canvasRef}
      onKeyDown={keyListeners.onKeyPressed.bind(keyListeners)}
      tabIndex={1}
    />
  );
}

export default MapCanvas;