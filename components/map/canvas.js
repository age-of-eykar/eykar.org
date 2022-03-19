import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect, useState } from "react";
import debounce from "debounce";
import { WheelControler, SpeedControler, PanningControler } from "./controlers";
import { startDrawing } from "./draw";

export let cache;
export let speedControler;

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

    speedControler = new SpeedControler(center, scale, windowSize);

    // handle canvas drawing
    cache = startDrawing(canvasRef.current, windowSize, center, scale, speedControler)
    cache.refresh(center.current, scale.current, windowSize.height / windowSize.width);

    // handle listeners creation
    const panningControler = new PanningControler(center, scale, windowSize, canvasRef, cache);
    const panningStart = panningControler.handleMouseDown.bind(panningControler);
    const panningStop = panningControler.handleMouseUp.bind(panningControler);
    const panningMove = panningControler.handleMouseMove.bind(panningControler);
    window.addEventListener("mousedown", panningStart);
    window.addEventListener("mouseup", panningStop);
    window.addEventListener("mousemove", panningMove);

    speedControler.setCache(cache);
    const listenKeyDown = speedControler.onKeyDown.bind(speedControler);
    const listenKeyUp = speedControler.onKeyUp.bind(speedControler);
    window.addEventListener("keydown", listenKeyDown);
    window.addEventListener("keyup", listenKeyUp);

    const wheelControler = new WheelControler(scale, (newScale) => {
      scale.current = newScale;
      cache.refresh(center.current, newScale, windowSize.height / windowSize.width);
    });
    const listenMouseWheel = wheelControler.handleMouseWheel.bind(wheelControler);
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