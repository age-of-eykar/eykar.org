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