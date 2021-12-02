import { perlin } from "../../../utils/perlinNoise";
import { drawCell } from "./gridManager";

function getElevation(x, y) {
  return perlin(x, y, 3, 0.5, 0.01, 0);
}

function getTemperature(x, y) {
  return perlin(x, y, 1, 1, 0.015, 0);
}

// Color table:
const desertIce = "#bdf5e9";
const desertSand = "#edc9af";
const plainContinental = "#bacb38";

function biomes(x, y) {
  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);
  const colorS = "#1e272e20";
  if (elevation < -0.15) {
    // negative elevation
    if (temperature < -0.4) return [desertIce, desertIce];
    const r1 = 62 * (1 + elevation * 1.2);
    const g1 = 146 * (1 + elevation * 1.2);
    const b1 = 209 * (1 + elevation * 1.2);
    const grad1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";
    return [grad1, grad1];
  } else {
    const r2 = (178 + 27 * (elevation + 0.15)/ 1.15) * (1 - Math.abs(temperature) * 1.08);
    const g2 = (152 + 51 * (elevation + 0.15)/ 1.15) * (1 - Math.abs(temperature) * 0.44);
    const b2 = (91 + 92 * (elevation + 0.15) / 1.15) * (1 - Math.abs(temperature) * 1.25);
    const grad2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
    return [grad2, colorS];
  }
}

export function drawMap(grid, context, voronoi) {
  let x = 0,
    y = 0;
  let colorF, colorS;
  for (let i = 0; i < voronoi.getVoronoi._circumcenters.length; i++) {
    if (typeof grid.get(i) !== "undefined") [x, y] = grid.get(i);
    [colorF, colorS] = biomes(x, y);
    drawCell(context, i, colorF, voronoi, colorS);
  }
}

// returns [elevation, temperature, biome]
export function biomeData(x, y) {
  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);
  let e = (((elevation + 0.15)*20)**3);
  if (e < 0) e = e*5;
  const t = (temperature * 1.75 + 0.6) * 50 * (Math.log((Math.E - 1)*(1-elevation)/2+1)) - 4;
  if (elevation < -0.15) {
    if (temperature < -0.2 && elevation > -0.17) return [e, t, "icefloe"];
    else return [e, t, "Sea"];
  } else if (elevation < 0.17) {
    if (temperature < -0.2) {
      if (temperature < -0.35) return [e, t, "Ice desert"];
      else if (elevation > 0.05) return [e, t, "Tundra forest"];
      else return [e, t, "Continental plain"];
    } else if (temperature < 0.2) {
      if (elevation > 0.05) return [e, t, "Continental forest"];
      else return [e, t, "Continental plain"];
    } else {
      if (temperature > 0.3) return [e, t, "Sand desert"];
      else if (elevation > 0.05) return [e, t, "Jungle forest"];
      else return [e, t, "Savanna plain"];
    }
  } else {
    return [e, t, "Mountains"];
  }
}
