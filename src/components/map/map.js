import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect, useState } from "react"
import { KListeners, WListener } from "./grid/listeners"
import { getTileCenter } from "./grid/gridManager"
import { drawMap } from "./grid/biomes"

function MapCanvas({ xStep, yStep, xPrefix, yPrefix, topLeft, setTopLeft, bottomRight, setBottomRight, coordinatesPerId, voronoi }) {

  const canvasRef = useRef(null);

  useEffect(() => {

    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext('2d')
    context.scale(scale, scale);
    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    xStep.current = context.canvas.width / (scale * (mapWidth + 1));
    yStep.current = context.canvas.height / (scale * (mapHeight + 1));

    let Iterator = {
      _i: -1,
      _j: -1,
      id: 0,

      [Symbol.iterator]() {
        return this;
      },

      next() {
        let center = getTileCenter(topLeft.x, this._i, topLeft.y, this._j, xStep.current, yStep.current,
          xPrefix, yPrefix);
        coordinatesPerId.set(this.id++, [this._i + Math.floor(topLeft.x), this._j + Math.floor(topLeft.y)]);
        if (this._j >= mapHeight + 1) {
          this._i++;
          this._j = -1;
          return { done: false, value: [center.x, center.y] };
        } else {
          this._j++;
          return { done: this._i > mapWidth + 2, value: [center.x, center.y] };
        }
      }
    };
    voronoi.setVoronoi = Delaunay.from(Iterator).voronoi([0, 0, canvas.width, canvas.height]);
    
    context.beginPath();
    drawMap(coordinatesPerId, context, voronoi);
    context.fill();
    context.stroke();
    context.closePath();

  }, [bottomRight, topLeft, xPrefix, yPrefix, coordinatesPerId, voronoi, xStep, yStep]);

  return <canvas className="map" ref={canvasRef} />
}

export default MapCanvas;