
import "./map.css"
import React, { useRef, useEffect } from 'react'

function MapCanvas(props) {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const map_width = props.bottom_right.x - props.top_left.x;
    const map_height = props.bottom_right.y - props.top_left.y;
    var x_step = context.canvas.width / (map_width + 1);
    var y_step = context.canvas.height / (map_height + 1);

    for (var i = 0; i <= map_width; i++) {
      for (var j = 0; j <= map_height; j++) {
        context.fillStyle = (i + j & 1) ? "#2ecc71" : "#2c3e50";
        context.fillRect(i * x_step, j * y_step,
          x_step + 1, y_step + 1);
        context.fillStyle = "#e74c3c";
        var center = getTileCenter(i, j, x_step, y_step);
        context.fillRect(center.x - 4, center.y - 4, 8, 8);
      }
    }

  }, [props.bottom_right, props.top_left])

  return <canvas width={window.innerWidth} height={window.innerHeight}
    className="map" ref={canvasRef} {...props} />
}

function getTileCenter(i, j, tile_width, tile_height) {
  var alpha = (((i + j) & 1) * 149 + (i + 53) * 16807 + j * j * 37 + 509 ^ i) % tile_width;
  var beta = ((j & 1) * j * 127 + (i & 1) * (j + 71) * 389 + j * 601) % tile_height;
  return { x: i * tile_width + alpha % tile_width, y: j * tile_height + beta % tile_height + 0 };
}

export default MapCanvas