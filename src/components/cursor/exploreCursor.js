import { useEffect, useRef, useState } from "react";
import { MListeners, WListener, KListeners } from "../map/grid/listeners";
import "./exploreCursor.css";

function Cursor({
  xStep,
  yStep,
  xPrefix,
  setXPrefix,
  yPrefix,
  setYPrefix,
  setCell,
  setCoord,
  coordinatesPerId,
  setBiome,
  bottomRight,
  setBottomRight,
  voronoi,
  topLeft,
  setTopLeft,
}) {
  const canvasRef = useRef(null);
  const [zoomIn, setZoomIn] = useState({ x: 0, y: 0, zoom: 0 });

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext("2d");
    context.scale(scale, scale);

    let drew;
    const listeners = new MListeners(
      context,
      voronoi,
      drew,
      canvas,
      topLeft,
      setCell,
      setCoord,
      setBiome
    );
    const wlisterner = new WListener(bottomRight, topLeft, setZoomIn, canvas);

    const listenMouseOut = listeners.handleMouseOut.bind(listeners);
    const listenMouseMove = listeners.handleMouseMove.bind(listeners);
    const listenMouseWheel = wlisterner.handleMouseWheel.bind(wlisterner);

    canvas.addEventListener("mousewheel", listenMouseWheel);
    canvas.addEventListener("mousemove", listenMouseMove);
    canvas.addEventListener("mouseout", listenMouseOut);

    return () => {
      canvas.removeEventListener("mousemove", listenMouseMove);
      canvas.removeEventListener("mouseout", listenMouseOut);
      canvas.removeEventListener("mousewheel", listenMouseWheel);
    };
  }, [coordinatesPerId, setCell, setCoord, setBiome, voronoi, topLeft, bottomRight]);

  useEffect(() => {
    if (zoomIn.zoom !== 0) {
      const mapWidth = bottomRight.x - topLeft.x;
      const mapHeight = bottomRight.y - topLeft.y;
      setZoomIn({ x: zoomIn.x, y: zoomIn.y, zoom: 0 });
      if (zoomIn.zoom === 1) {
        const newTopLeft = {
          x: topLeft.x + 0.05 * zoomIn.x,
          y: topLeft.y + 0.05 * zoomIn.y,
        };
        const newBottomRight = {
          x: 0.95 * mapWidth + newTopLeft.x,
          y: 0.95 * mapHeight + newTopLeft.y,
        };
        setXPrefix(newTopLeft.x - Math.trunc(newTopLeft.x));
        setYPrefix(newTopLeft.y - Math.trunc(newTopLeft.y));
        setTopLeft(newTopLeft);
        setBottomRight(newBottomRight);
      } else {
        const newTopLeft = {
          x: topLeft.x - 0.05 * zoomIn.x,
          y: topLeft.y - 0.05 * zoomIn.y,
        };
        const newBottomRight = {
          x: 1.05 * mapWidth + newTopLeft.x,
          y: 1.05 * mapHeight + newTopLeft.y,
        };
        setTopLeft(newTopLeft);
        setBottomRight(newBottomRight);
      }
    }
  }, [
    zoomIn.zoom,
    zoomIn.x,
    zoomIn.y,
    bottomRight.x,
    bottomRight.y,
    topLeft.x,
    topLeft.y,
    setTopLeft,
    setBottomRight,
    setYPrefix,
    setXPrefix,
  ]);

  const [repeatStreak, setRepeatStreak] = useState(0);

  const kListeners = new KListeners(
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
  );
  return (
    <canvas
      className="cursorCanvas"
      ref={canvasRef}
      onKeyDown={kListeners.onKeyPressed.bind(kListeners)}
      tabIndex={0}
    />
  );
}

export default Cursor;
