import { Delaunay } from "d3-delaunay"
import "./map.css"
import React, { useRef, useEffect } from 'react'



function MapCanvas(props) {

  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    let isInteracting = true;


    canvas.addEventListener('mousemove', e => {
      if (isInteracting === true) {
        drawCell(context, e.offsetX, e.offsetY);
      }
    });

    function drawCell(context, x, y) {
      context.beginPath();
      context.fillStyle = '#ff0000';
      var cell = 0;
      while (!voronoi.contains(cell, x, y)) {
        cell++;
      }
      voronoi.renderCell(cell, context);
      context.fill();
      context.closePath();
    }


    const map_width = props.bottom_right.x - props.top_left.x;
    const map_height = props.bottom_right.y - props.top_left.y;
    var x_step = context.canvas.width / (map_width + 1);
    var y_step = context.canvas.height / (map_height + 1);

    var points = [];

    for (var i = 0; i <= map_width; i++) {
      for (var j = 0; j <= map_height; j++) {
        context.fillStyle = "#e74c3c";
        var center = getTileCenter(props.top_left.x, i, props.top_left.y, j, x_step, y_step);

        points.push([Math.round(center.x), Math.round(center.y)]);

        context.beginPath();
        //context.arc(center.x, center.y, 2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
      }
    }

    const voronoi = Delaunay.from(points).voronoi([0, 0, canvas.width, canvas.height]);
    console.log(voronoi);
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#e74c3c";
    for (var cell = 0; cell < points.length; cell++) {
      voronoi.renderCell(cell, context);
    }
    context.fill();
    context.stroke();
    
    context.closePath();

  }, [props.bottom_right, props.top_left])

  return <canvas width={window.innerWidth} height={window.innerHeight}
    className="map" ref={canvasRef} {...props} />
}

function getTileCenter(i_prefix, i, j_prefix, j, tile_width, tile_height) {
  const x = i + i_prefix;
  const y = j + j_prefix;
  var alpha = ((x * 16807 + y * y * 37 + 509 ^ x + 71 ^ (y - 27)) % tile_width + 881) % tile_width;
  var beta = (((x & 1) * (y + 71) * 389 + y * 601 + 127 ^ (x - 27)) % tile_height + 439) % tile_height;
  return { x: i * tile_width + alpha % tile_width, y: j * tile_height + beta % tile_height };
}

export default MapCanvas