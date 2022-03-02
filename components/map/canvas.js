
import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { WheelListener, KeyListeners } from "./listeners";
import { cache, ChunksCache } from "./calc/cache";

export function drawPolygon(points, context, colors, fast) {
  context.beginPath();
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];
    context.lineTo(x, y);
  }
  context.lineTo(points[0][0], points[0][1]);
  context.fillStyle = colors[0];
  context.fill();
  if (!fast) {
    context.strokeStyle = colors[1];
    context.stroke();
  }
  context.closePath();

}
let averageDelay = 1000 / 60;
let lastDrawTime = 0;
const redraw = (canvas, cache, center, scale, windowSize) => {
  if (Date.now() < lastDrawTime + averageDelay)
    return;
  const startTime = Date.now();
  // canvas fixes
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
  cache.forEachChunk(center, scale, (chunk) => {
    const topLeft = chunk.getTopLeft();
    context.translate(topLeft.x - center.x, topLeft.y - center.y)
    context.scale(ChunksCache.sideSize, ChunksCache.sideSize);
    let i = 0;
    context.lineWidth = 1 / (50 * ChunksCache.sideSize);
    // fast display (no polygons)
    if (scale.width > 128) {
      const sideSize = 1 / ChunksCache.sideSize;
      for (let j = 0; j < ChunksCache.sideSize; j++)
        for (let i = 0; i < ChunksCache.sideSize; i++) {
          context.fillStyle = chunk.colors[i + j * ChunksCache.sideSize][0];
          context.fillRect(i / ChunksCache.sideSize - 0.05 * sideSize, j / ChunksCache.sideSize - 0.05 * sideSize,
            sideSize + 0.1 * sideSize, sideSize + 0.1 * sideSize);
        }
    } else for (const points of chunk.shape)
      drawPolygon(points, context, chunk.colors[i++], scale.width > 48);
    context.scale(1 / ChunksCache.sideSize, 1 / ChunksCache.sideSize);
    context.translate(center.x - topLeft.x, center.y - topLeft.y)
  });
  averageDelay = (averageDelay / 2 + Date.now() - startTime / 2);
}

function MapCanvas({ setClickedPlotCallback }) {

  // center of the map (normal coordinates)
  const [center, setCenter] = useState({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const [scale, setScale] = useState({ width: 32.0, height: 32.0 });

  const keyListeners = new KeyListeners(center, setCenter, scale);

  const canvasRef = useRef(null);

  const pixelRatio = (typeof window === 'undefined') ? 1 : window.devicePixelRatio;
  const [windowSize, setWindowSize] = useState((typeof window === 'undefined') ? null : {
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  });

  useEffect(() => {
    cache.refresh(center, scale);
    const wheelListener = new WheelListener(scale, setScale);
    const listenMouseWheel = wheelListener.handleMouseWheel.bind(wheelListener);
    const canvas = canvasRef.current;
    canvas.addEventListener("mousewheel", listenMouseWheel);
    canvas.addEventListener("onwheel", listenMouseWheel);

    // screen resize
    const handler = debounce(() => setWindowSize({
      width: window.innerWidth * pixelRatio,
      height: window.innerHeight * pixelRatio
    }), 20);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      canvas.removeEventListener("mousewheel", listenMouseWheel);
      canvas.removeEventListener("onwheel", listenMouseWheel);
    };
  }, [
    windowSize, center, scale, pixelRatio
  ]);

  const interacted = useRef(false);

  useEffect(() => {
    redraw(canvasRef.current, cache, center, scale, windowSize)
    interacted.current = true;
  }, [
    windowSize, center, scale
  ]);

  useEffect(() => {
    const id = setInterval(
      () => {
        redraw(canvasRef.current, cache, center, scale, windowSize)
      },
      1000 / 8);
    return () => clearInterval(id);
  }, [
    windowSize, center, scale
  ]);

  return (
    <canvas
      className={styles.map}
      ref={canvasRef}
      onKeyDown={keyListeners.onKeyPressed.bind(keyListeners)}
      tabIndex={1}
    />
  );
}

export default MapCanvas;