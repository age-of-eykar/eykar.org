
import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { WheelListener, KeyListeners } from "./listeners";
import { cache } from "./calc/cache";
import { redraw } from "./draw";

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
      1000 / 16);
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