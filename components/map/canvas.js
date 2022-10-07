import styles from '../../styles/Map.module.css'
import React, { useRef, useEffect } from "react";
import debounce from "debounce";
import { startDrawing, stopDrawing } from "./draw";
import ZoomControler from './events/zoom';
import PanningControler from './events/panning';
import SpeedControler from "./events/speed";
import { Selector } from "./selector";
import { setConquerMode } from "../../utils/models/game";
import { getCache } from "../../utils/models/game";
export let speedControler;
export let zoomControler;
export let panningControler;

export function MapCanvas({ center, onPlotClick }) {

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
    setConquerMode(false);
    const selector = new Selector(windowSize, center, scale);
    speedControler = new SpeedControler(center, scale, windowSize);

    // handle canvas drawing
    startDrawing(canvasRef.current, center, scale, selector, speedControler)
    getCache().refresh(center.current, scale.current, windowSize.current.height / windowSize.current.width);

    // handle listeners creation
    panningControler = new PanningControler(center, scale, windowSize,
      canvasRef, onPlotClick, selector);

    const onTouchStartPanning = panningControler.handleTouchDown.bind(panningControler);
    const onTouchMovePanning = panningControler.handleTouchMove.bind(panningControler);
    const onMouseStartPanning = panningControler.handleMouseDown.bind(panningControler);
    const onMouseMovePanning = panningControler.handleMouseMove.bind(panningControler);
    const onMouseStopPanning = panningControler.handleMouseUp.bind(panningControler);
    const listenKeyDown = speedControler.onKeyDown.bind(speedControler);
    const listenKeyUp = speedControler.onKeyUp.bind(speedControler);

    zoomControler = new ZoomControler(center, scale, selector, (newScale) => {
      scale.current = newScale;
      getCache().refresh(center.current, newScale, windowSize.current.height / windowSize.current.width);
    });

    const zoomPinchStart = zoomControler.handlePinchStart.bind(zoomControler);
    const zoomPinchMove = zoomControler.handlePinchMove.bind(zoomControler);
    const zoomPinchEnd = zoomControler.handlePinchEnd.bind(zoomControler);

    // screen resize
    const handler = debounce(() => {
      windowSize.current = {
        width: window.innerWidth * pixelRatio,
        height: window.innerHeight * pixelRatio
      }
      canvasRef.current.width = windowSize.current.width;
      canvasRef.current.height = windowSize.current.height;
    }, 20);

    const onTouchStart = (event) => { onTouchStartPanning(event); zoomPinchStart(event); };
    window.addEventListener("touchstart", onTouchStart);
    const onTouchMove = (event) => { onTouchMovePanning(event); zoomPinchMove(event); };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", zoomPinchEnd);
    window.addEventListener("mousedown", onMouseStartPanning);
    window.addEventListener("mousemove", onMouseMovePanning);
    window.addEventListener("mouseup", onMouseStopPanning);
    window.addEventListener("keydown", listenKeyDown);
    window.addEventListener("keyup", listenKeyUp);
    const listenMouseWheel = zoomControler.handleMouseWheel.bind(zoomControler);
    window.addEventListener("wheel", listenMouseWheel);
    window.addEventListener("resize", handler);
    return () => {
      stopDrawing();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", zoomPinchEnd);
      window.removeEventListener("mousedown", onMouseStartPanning);
      window.removeEventListener("mousemove", onMouseMovePanning);
      window.removeEventListener("mouseup", onMouseStopPanning);
      window.removeEventListener("keydown", listenKeyDown);
      window.removeEventListener("keyup", listenKeyUp);
      window.removeEventListener("wheel", listenMouseWheel);
      window.removeEventListener("resize", handler);
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
