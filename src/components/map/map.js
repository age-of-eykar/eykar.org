
import "./map.css";
import React, { useRef, useEffect, useState } from "react";
import { drawMap } from "./grid/biomes";
import { CListener, KListeners, WListener } from "../map/grid/listeners";
import ChunksCache from "../../utils/cache";
import { getDimensions } from "../../utils/gridManager";


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
    cache.run(topLeft, bottomRight, () => console.log("prout"));
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