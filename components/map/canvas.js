import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect } from "react";
import debounce from "debounce";
import { WheelControler, SpeedControler, MouseControler } from "./controlers";
import { startDrawing, stopDrawing } from "./draw";

export let cache;
export let speedControler;
export let wheelControler;

export function MapCanvas({ onPlotClick }) {

  // center of the map (normal coordinates)
  const center = useRef({ x: 0.0, y: 0.0 });
  // scale in cells displayed per width
  const scale = useRef(32.0);

  const canvasRef = useRef(null);
  const pixelRatio = (typeof window === 'undefined') ? 1 : window.devicePixelRatio;
  const windowSize = useRef((typeof window === 'undefined') ? null : {
    width: window.innerWidth * pixelRatio,
    height: window.innerHeight * pixelRatio
  });

  useEffect(() => {
    canvasRef.current.width = windowSize.current.width;
    canvasRef.current.height = windowSize.current.height;
    speedControler = new SpeedControler(center, scale, windowSize);

    // handle canvas drawing
    cache = startDrawing(canvasRef.current, center, scale, speedControler)
    cache.refresh(center.current, scale.current, windowSize.current.height / windowSize.current.width);

    // handle listeners creation
    const mouseControler = new MouseControler(center, scale, windowSize, canvasRef, onPlotClick, cache);
    const mouseStart = mouseControler.handleMouseDown.bind(mouseControler);
    const mouseStop = mouseControler.handleMouseUp.bind(mouseControler);
    const mouseMove = mouseControler.handleMouseMove.bind(mouseControler);
    window.addEventListener("mousedown", mouseStart);
    window.addEventListener("mouseup", mouseStop);
    window.addEventListener("mousemove", mouseMove);

    speedControler.setCache(cache);
    const listenKeyDown = speedControler.onKeyDown.bind(speedControler);
    const listenKeyUp = speedControler.onKeyUp.bind(speedControler);
    window.addEventListener("keydown", listenKeyDown);
    window.addEventListener("keyup", listenKeyUp);

    wheelControler = new WheelControler(scale, (newScale) => {
      scale.current = newScale;
      cache.refresh(center.current, newScale, windowSize.current.height / windowSize.current.width);
    });
    const listenMouseWheel = wheelControler.handleMouseWheel.bind(wheelControler);
    window.addEventListener("wheel", listenMouseWheel);

    // screen resize
    const handler = debounce(() => {
      windowSize.current = {
        width: window.innerWidth * pixelRatio,
        height: window.innerHeight * pixelRatio
      }
      canvasRef.current.width = windowSize.current.width;
      canvasRef.current.height = windowSize.current.height;
    }, 20);

    window.addEventListener("resize", handler);
    return () => {
      stopDrawing();
      window.removeEventListener("mousedown", mouseStart);
      window.removeEventListener("mouseup", mouseStop);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", handler);
      window.removeEventListener("keydown", listenKeyDown);
      window.removeEventListener("keyup", listenKeyUp);
      window.removeEventListener("wheel", listenMouseWheel);
    };
  }, [pixelRatio]);

  return (
    <canvas
      className={styles.map}
      ref={canvasRef}
      tabIndex={1}
    />
  );
}