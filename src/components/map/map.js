import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect, useState } from "react"
import { szudzik, lcg } from "../../utils/deterministic"


function MapCanvas({ initialBottomRight, initialTopLeft }) {

  const canvasRef = useRef(null)
  const [bottomRight, setBottomRight] = useState(initialBottomRight);
  const [topLeft, setTopLeft] = useState(initialTopLeft);

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext('2d')
    context.scale(scale, scale);

    let drew = [0];
    let cell;

    function handleMouseMove(event) {
      cell = findCell(event.offsetX, event.offsetY);
      if (drew[0] !== cell) {
        drew.push(cell);
        drawCell(context, cell, '#ff0000');
      }
      if (drew.length > 1) {
        drawCell(context, drew[0], '#1C1709');
        drew.shift();
      }
      console.log(drew);
    }

    function handleMouseOut(e) {
      drawCell(context, drew[0], '#1C1709');
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);


    function findCell(x, y) {
      let cell = 0;
      while (!voronoi.contains(cell, x, y))
        cell++;
      return cell;
    }

    function drawCell(context, cell, color) {
      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = "#ffffff";
      voronoi.renderCell(cell, context);
      context.fill();
      context.stroke();
      context.closePath();
    }

    const map_width = bottomRight.x - topLeft.x;
    const map_height = bottomRight.y - topLeft.y;
    let x_step = context.canvas.width / (scale * (map_width + 1));
    let y_step = context.canvas.height / (scale * (map_height + 1));

    let Iterator = {
      _i: -1,

      [Symbol.iterator]() {
        this.current = -1;
        return this;
      },

      next() {
        let center = getTileCenter(topLeft.x, this._i, topLeft.y, this.current, x_step, y_step);

        if (this.current >= map_height + 1) {
          this._i++;
          this.current = -1;
          return { done: false, value: [center.x, center.y] };
        } else {
          this.current++;
          return { done: this._i > map_width + 1, value: [center.x, center.y] };
        }
      }
    };

    const voronoi = Delaunay.from(Iterator).voronoi([0, 0, canvas.width, canvas.height]);
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#000000";
    voronoi.render(context);
    context.fill();
    context.stroke();

    context.closePath();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseout', handleMouseOut)
    }
  }, [bottomRight, topLeft])

  function onKeyPressed(event) {
    switch (event.key) {

      case "ArrowDown":
        setBottomRight({ x: bottomRight.x, y: bottomRight.y + 1 });
        setTopLeft({ x: topLeft.x, y: topLeft.y + 1 });
        break;

      case "ArrowUp":
        setBottomRight({ x: bottomRight.x, y: bottomRight.y - 1 });
        setTopLeft({ x: topLeft.x, y: topLeft.y - 1 });
        break;

      case "ArrowLeft":
        setBottomRight({ x: bottomRight.x - 1, y: bottomRight.y });
        setTopLeft({ x: topLeft.x - 1, y: topLeft.y });
        break;

      case "ArrowRight":
        setBottomRight({ x: bottomRight.x + 1, y: bottomRight.y });
        setTopLeft({ x: topLeft.x + 1, y: topLeft.y });
        break;

      default:
        break;
    }
  }

  return <canvas className="map" onKeyDown={onKeyPressed}
    tabIndex={0} ref={canvasRef} />
}

function getTileCenter(i_prefix, i, j_prefix, j, tile_width, tile_height) {
  const x = i + i_prefix;
  const y = j + j_prefix;
  const output = lcg(szudzik(x, y), 2);
  let alpha = output % tile_width;
  let beta = lcg(output) % tile_height;
  return { x: i * tile_width + alpha % tile_width, y: j * tile_height + beta % tile_height };
}

export function getDimensions(center, plot_width) {
  const width_plots_amount = window.innerWidth / plot_width;
  const height_plots_amount = window.innerHeight / (plot_width / 2);
  return {
    topLeft: { x: center.x - width_plots_amount / 2, y: center.y - height_plots_amount / 2 },
    bottomRight: { x: center.x + width_plots_amount / 2, y: center.y + height_plots_amount / 2 }
  };
}

export default MapCanvas