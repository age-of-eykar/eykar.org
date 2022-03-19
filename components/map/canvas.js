import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { WheelListener, KeyListeners, PanningListener } from "./listeners";
import { startDrawing } from "./draw";

export let cache;

export function MapCanvas({ setClickedPlotCallback }) {

  // center of the map (normal coordinates)
  const center = useRef({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const scale = useRef(32.0);

  const canvasRef = useRef(null);
  const pixelRatio = (typeof window === 'undefined') ? 1 : window.devicePixelRatio;
  const [windowSize, setWindowSize] = useState((typeof window === 'undefined') ? null : {
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  });

  useEffect(() => {

    const keyListeners = new KeyListeners(center, scale, windowSize);

    // handle canvas drawing
    cache = startDrawing(canvasRef.current, windowSize, center, scale, keyListeners)
    cache.refresh(center.current, scale.current, windowSize.height / windowSize.width);

    // handle listeners creation
    const panningListener = new PanningListener(center, scale, windowSize, cache);
    const panningStart = panningListener.handleMouseDown.bind(panningListener);
    const panningStop = panningListener.handleMouseUp.bind(panningListener);
    const panningMove = panningListener.handleMouseMove.bind(panningListener);
    window.addEventListener("mousedown", panningStart);
    window.addEventListener("mouseup", panningStop);
    window.addEventListener("mousemove", panningMove);

    keyListeners.setCache(cache);
    const listenKeyDown = keyListeners.onKeyDown.bind(keyListeners);
    const listenKeyUp = keyListeners.onKeyUp.bind(keyListeners);
    window.addEventListener("keydown", listenKeyDown);
    window.addEventListener("keyup", listenKeyUp);

    const wheelListener = new WheelListener(scale, (newScale) => {
      scale.current = newScale;
      cache.refresh(center.current, newScale, windowSize.height / windowSize.width);
    });
    const listenMouseWheel = wheelListener.handleMouseWheel.bind(wheelListener);
    window.addEventListener("mousewheel", listenMouseWheel);
    window.addEventListener("onwheel", listenMouseWheel);

    // screen resize
    const handler = debounce(() => setWindowSize({
      width: window.innerWidth * pixelRatio,
      height: window.innerHeight * pixelRatio
    }), 20);

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("mousedown", panningStart);
      window.removeEventListener("mouseup", panningStop);
      window.removeEventListener("mousemove", panningMove);
      window.removeEventListener("resize", handler);
      window.removeEventListener("keydown", listenKeyDown);
      window.removeEventListener("keyup", listenKeyUp);
      window.removeEventListener("mousewheel", listenMouseWheel);
      window.removeEventListener("onwheel", listenMouseWheel);
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