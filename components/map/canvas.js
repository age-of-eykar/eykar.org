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
export let wheelControler;
export let mouseControler;

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
    mouseControler = new PanningControler(center, scale, windowSize,
      canvasRef, onPlotClick, selector);

    const touchDown = mouseControler.handleTouchDown.bind(mouseControler);
    const touchMove = mouseControler.handleTouchMove.bind(mouseControler);
    window.addEventListener("touchstart", touchDown);
    window.addEventListener("touchmove", touchMove);

    const mouseStart = mouseControler.handleMouseDown.bind(mouseControler);
    const mouseMove = mouseControler.handleMouseMove.bind(mouseControler);
    const mouseStop = mouseControler.handleMouseUp.bind(mouseControler);
    window.addEventListener("mousedown", mouseStart);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseStop);

    const listenKeyDown = speedControler.onKeyDown.bind(speedControler);
    const listenKeyUp = speedControler.onKeyUp.bind(speedControler);
    window.addEventListener("keydown", listenKeyDown);
    window.addEventListener("keyup", listenKeyUp);

    wheelControler = new ZoomControler(center, scale, selector, (newScale) => {
      scale.current = newScale;
      getCache().refresh(center.current, newScale, windowSize.current.height / windowSize.current.width);
    });
    const listenMouseWheel = wheelControler.handleMouseWheel.bind(wheelControler);
    window.addEventListener("wheel", listenMouseWheel);

    const handlePinchStart = wheelControler.handleMouseWheel.bind(wheelControler);
    window.addEventListener("ontouchstart", handlePinchStart);

    const handlePinchMove = wheelControler.handleMouseWheel.bind(wheelControler);
    window.addEventListener("ontouchmove", handlePinchMove);

    const handlePinchEnd = wheelControler.handleMouseWheel.bind(wheelControler);
    window.addEventListener("ontouchend", handlePinchEnd);

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
      window.removeEventListener("touchstart", touchDown);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("mousedown", mouseStart);
      window.removeEventListener("mouseup", mouseStop);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", handler);
      window.removeEventListener("keydown", listenKeyDown);
      window.removeEventListener("keyup", listenKeyUp);
      window.removeEventListener("wheel", listenMouseWheel);
      window.removeEventListener("ontouchstart", handlePinchStart);
      window.removeEventListener("ontouchmove", handlePinchMove);
      window.removeEventListener("ontouchend", handlePinchEnd);
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
