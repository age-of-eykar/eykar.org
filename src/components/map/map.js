import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect, useState } from "react"
import { szudzik, lcg } from "../../utils/deterministic"


function MapCanvas({ initialBottomRight, initialTopLeft }) {

  const canvasRef = useRef(null)
  const [bottomRight, setBottomRight] = useState(initialBottomRight);
  const [topLeft, setTopLeft] = useState(initialTopLeft);
  const [xPrefix, setXPrefix] = useState(0);
  const [yPrefix, setYPrefix] = useState(0);
  const [zoomIn, setZoomIn] = useState({ x: 0, y: 0, zoom: 0 });
  const xStep = useRef(1);
  const yStep = useRef(1);

  useEffect(() => {

    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext('2d')
    context.scale(scale, scale);

    // Variables for cells drawing when mouse on them
    let drew = [0];
    let cell;
    // function for mouse drawing
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
    }
    // function when mouse out of the screen
    function handleMouseOut(e) {
      drawCell(context, drew[0], '#1C1709');
    }


    function handleMouseWheel(event) {
      const mapWidth = bottomRight.x - topLeft.x;
      const mapHeight = bottomRight.y - topLeft.y;
      const mousePositionX = event.offsetX / canvas.clientWidth * mapWidth;
      const mousePositionY = event.offsetY / canvas.clientHeight * mapHeight;
      if (event.deltaY < 0) {
        setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: 1 });
      }
      else {
        setZoomIn({ x: mousePositionX, y: mousePositionY, zoom: -1 });
      }
      event.preventDefault();
    }

    canvas.addEventListener('mousewheel', handleMouseWheel);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    // sub fonctions for cell drawing
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


    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    xStep.current = context.canvas.width / (scale * (mapWidth + 1));
    yStep.current = context.canvas.height / (scale * (mapHeight + 1));

    let Iterator = {
      _i: -1,

      [Symbol.iterator]() {
        this.current = -1;
        return this;
      },

      next() {
        let center = getTileCenter(topLeft.x, this._i, topLeft.y, this.current, xStep.current, yStep.current,
          xPrefix, yPrefix);

        if (this.current >= mapHeight + 8) {
          this._i++;
          this.current = -1;
          return { done: false, value: [center.x, center.y] };
        } else {
          this.current++;
          return { done: this._i > mapWidth + 8, value: [center.x, center.y] };
        }
      }
    };



    const voronoi = Delaunay.from(Iterator).voronoi([0, 0, canvas.width, canvas.height]);
    context.beginPath();
    context.strokeStyle = "#ffffff";
    voronoi.render(context);
    context.fill();
    context.stroke();
    context.closePath();

    return () => {
      canvas.removeEventListener('mousewheel', handleMouseWheel)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseout', handleMouseOut)
    }
  }, [bottomRight, topLeft, xPrefix, yPrefix])


  function move(xPixels, yPixels) {
    let x = parseInt((xPrefix + xPixels) / xStep.current);
    let y = parseInt((yPrefix + yPixels) / yStep.current);
    let newPrefixX = xPrefix + xPixels - x * xStep.current;
    let newPrefixY = yPrefix + yPixels - y * yStep.current;
    if (2 * newPrefixX > xStep.current) {
      newPrefixX -= xStep.current;
      x++;
    }
    setXPrefix(newPrefixX);
    if (2 * newPrefixY > yStep.current) {
      newPrefixY -= yStep.current;
      y++;
    }
    setYPrefix(newPrefixY);
    setBottomRight({ x: bottomRight.x - x, y: bottomRight.y - y });
    setTopLeft({ x: topLeft.x - x, y: topLeft.y - y });
  }

  if (zoomIn.zoom !== 0) {
    const mapWidth = bottomRight.x - topLeft.x;
    const mapHeight = bottomRight.y - topLeft.y;
    setZoomIn({ x: zoomIn.x, y: zoomIn.y, zoom: 0 });
    if (zoomIn.zoom === 1) {
      const newTopLeft = { x: topLeft.x + 0.05 * zoomIn.x, y: topLeft.y + 0.05 * zoomIn.y };
      const newBottomRight = { x: 0.95 * mapWidth + newTopLeft.x, y: 0.95 * mapHeight + newTopLeft.y };
      setXPrefix(newTopLeft.x - Math.trunc(newTopLeft.x));
      setYPrefix(newTopLeft.y - Math.trunc(newTopLeft.y));
      setTopLeft(newTopLeft);
      setBottomRight(newBottomRight);
    } else {
      const newTopLeft = { x: topLeft.x - 0.05 * zoomIn.x, y: topLeft.y - 0.05 * zoomIn.y };
      const newBottomRight = { x: 1.05 * mapWidth + newTopLeft.x, y: 1.05 * mapHeight + newTopLeft.y };
      setTopLeft(newTopLeft);
      setBottomRight(newBottomRight);
    }
  }

  const [repeatStreak, setRepeatStreak] = useState(0);
  function onKeyPressed(event) {
    let i;
    if (!event.repeat) {
      setRepeatStreak(0);
      i = (xStep.current + yStep.current) / 4;
    } else {
      setRepeatStreak(repeatStreak + 1);
      console.log(repeatStreak);
      i = Math.min(repeatStreak, (xStep.current + yStep.current) / 4);
      console.log(i);
    }

    switch (event.key) {
      case "ArrowDown":
        move(0, -i);
        break;

      case "ArrowUp":
        move(0, i);
        break;

      case "ArrowLeft":
        move(i, 0);
        break;

      case "ArrowRight":
        move(-i, 0);
        break;

      default:
        break;
    }
  }

  return <canvas className="map" onKeyDown={onKeyPressed}
    tabIndex={0} ref={canvasRef} />
}

function getTileCenter(i_prefix, i, j_prefix, j, tile_width, tile_height, x_shift, y_shift) {
  const output = lcg(szudzik(Math.trunc(i + i_prefix), Math.trunc(j + j_prefix)), 2);
  let alpha = ((output % 4897) * tile_width) / 4897;
  let beta = ((lcg(output) % 4897) * tile_height) / 4897;
  return { x: i * tile_width + alpha + x_shift, y: j * tile_height + beta + y_shift };
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