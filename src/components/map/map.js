
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

  // center of the map (normal coordinates)
  const [ center, setCenter ] = useState({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const [scale, setScale] = useState({ width: 32.0, height: 32.0 });

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
    context.scale(windowSize.width, windowSize.width*0.9);
    
    // cache and draw
    cache.run(center, scale, (chunk) => {
      console.log("oups")
      for (const [_, points] of chunk.shape) {
        // todo : fix scale
        // todo : display at the right position
        // todo : ensure cache generates the right chunks
        drawPolygon(points, context);
        
      }
    });
    context.clearRect(0, 0, canvas.width, canvas.height);


    // screen resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [
    windowSize
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