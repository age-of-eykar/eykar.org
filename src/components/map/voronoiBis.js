import { lcg, szudzik } from "../../utils/deterministic.js"

export function findCell(x, y, voronoi) {
  let cell = 0;
  while (!voronoi.contains(cell, x, y))
    cell++;
  return cell;
}

export function drawCell(context, cell, color, voronoi) {
  context.beginPath();
  context.fillStyle = color;
  context.strokeStyle = "#ffffff";
  voronoi.renderCell(cell, context);
  context.fill();
  context.stroke();
  context.closePath();
}

export function getTileCenter(i_prefix, i, j_prefix, j, tile_width, tile_height, x_shift, y_shift) {
  const output = lcg(szudzik(Math.trunc(i + i_prefix), Math.trunc(j + j_prefix)), 2);
  let alpha = ((output % 64) * tile_width) / 64;
  let beta = ((lcg(output) % 64) * tile_height) / 64;
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