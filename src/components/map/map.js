import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect } from 'react'



function MapCanvas({ blurry, bottom_right, top_left }) {

  const canvasRef = useRef(null)

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    const context = canvas.getContext('2d')
    context.scale(scale, scale);

    let drew = [0];
    let cell;

    canvas.addEventListener('mousemove', e => {
      cell = findCell(context, e.offsetX, e.offsetY);
      if (drew[0] !== cell) {
        drew.push(cell);
        drawCell(context,cell, '#ff0000');
      }
      if (drew.length > 1) {
        drawCell(context, drew[0], '#1C1709');
        drew.shift();
      }
      console.log(drew);
    });

    /*
    canvas.addEventListener('mouseout', e => {
      drawCell(context, e.offsetX, e.offsetY, '#1C1709');
    });
    */

    function findCell(context, x, y) {
      let cell = 0;
      while (!voronoi.contains(cell, x, y)) {
        cell++;
      }
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


    const map_width = bottom_right.x - top_left.x;
    const map_height = bottom_right.y - top_left.y;
    let x_step = context.canvas.width / (scale * (map_width + 1));
    let y_step = context.canvas.height / (scale * (map_height + 1));

    let points = [];

    for (let i = -1; i <= map_width+1; i++) {
      for (let j = -1; j <= map_height+1; j++) {
        context.fillStyle = "#e74c3c";
        let center = getTileCenter(top_left.x, i, top_left.y, j, x_step, y_step);

        points.push([Math.round(center.x), Math.round(center.y)]);

        context.beginPath();
        //context.arc(center.x, center.y, 2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
      }
    }

    const voronoi = Delaunay.from(points).voronoi([0, 0, canvas.width, canvas.height]);
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#000000";
    voronoi.render(context);
    context.fill();
    context.stroke();

    context.closePath();

  }, [bottom_right, top_left])

  return <canvas className="map" ref={canvasRef} />
}

function getTileCenter(i_prefix, i, j_prefix, j, tile_width, tile_height) {
  const x = i + i_prefix;
  const y = j + j_prefix;
  let alpha = ((x * 16807 + y * y * 37 + 509 ^ x + 71 ^ (y - 27)) % tile_width + 881) % tile_width;
  let beta = (((x & 1) * (y + 71) * 389 + y * 601 + 127 ^ (x - 27)) % tile_height + 439) % tile_height;
  return { x: i * tile_width + alpha % tile_width, y: j * tile_height + beta % tile_height };
}

export function getDimensions(center, plot_width) {
  const width_plots_amount = window.innerWidth / plot_width;
  const height_plots_amount = window.innerHeight / (plot_width / 2);
  return {
    bottom_right: { x: center.x - width_plots_amount / 2, y: center.y - height_plots_amount / 2 },
    top_left: { x: center.x + width_plots_amount / 2, y: center.y + height_plots_amount / 2 }
  };
}

export default MapCanvas