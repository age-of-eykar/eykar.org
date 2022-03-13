import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { WheelListener, KeyListeners } from "./listeners";
import { startDrawing } from "./draw";

function MapCanvas({ setClickedPlotCallback }) {

  // center of the map (normal coordinates)
  const center = useRef({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const scale = useRef({ width: 32.0, height: 32.0 });

  const canvasRef = useRef(null);
  const pixelRatio = (typeof window === 'undefined') ? 1 : window.devicePixelRatio;
  const [windowSize, setWindowSize] = useState((typeof window === 'undefined') ? null : {
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  });

  useEffect(() => {

    const keyListeners = new KeyListeners(center, scale);

    // handle canvas drawing
    const cache = startDrawing(canvasRef.current, windowSize, center, scale, keyListeners)
    cache.refresh(center.current, scale.current);

    // handle listeners creation
    const canvas = canvasRef.current;
    keyListeners.setCache(cache);
    const listenKeyDown = keyListeners.onKeyDown.bind(keyListeners);
    const listenKeyUp = keyListeners.onKeyUp.bind(keyListeners);
    canvas.addEventListener("keydown", listenKeyDown);
    canvas.addEventListener("keyup", listenKeyUp);

    const wheelListener = new WheelListener(scale, (newScale) => {
      scale.current = newScale;
      cache.refresh(center.current, newScale);
    });
    const listenMouseWheel = wheelListener.handleMouseWheel.bind(wheelListener);
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
      window.removeEventListener("keydown", listenKeyDown);
      window.removeEventListener("keyup", listenKeyUp);
      canvas.removeEventListener("mousewheel", listenMouseWheel);
      canvas.removeEventListener("onwheel", listenMouseWheel);
    };
  }, [windowSize, pixelRatio]);

  return (
    <canvas
      className={styles.map}
      ref={canvasRef}
      tabIndex={1}
    />
  );
}

export default MapCanvas;