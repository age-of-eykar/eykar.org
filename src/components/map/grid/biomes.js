import { perlin } from "../../../utils/perlinNoise";
import { drawCell } from "./gridManager";
import { lcg, szudzik } from "../../../utils/deterministic.js"

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
  } else if (elevation < 0.16) {
    // medium elevation
    // sable ?
    if (elevation > 0.05) {
      if (temperature > 0) {
        const r2 = 11 + (11 / 3) * temperature;
        const g2 = 102 + (102 / 3) * temperature;
        const b2 = 35 + (35 / 3) * temperature;
        const grad2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
        return [grad2, colorS];
      } else {
        const r3 = 11 / (3 - 2 * (1 + temperature));
        const g3 = 102 / (3 - 2 * (1 + temperature));
        const b3 = 35 / (3 - 2 * (1 + temperature));
        const grad3 = "rgb(" + r3 + "," + g3 + "," + b3 + ")";
        return [grad3, colorS];
      }
    } else {
      if (temperature < -0.2) {
        return [desertIce, desertIce];
      } else if (temperature > 0.3) {
        return [desertSand, colorS];
      } else {
        return [plainContinental, colorS];
      }
    }
  } else {
    // High elevation
    if (temperature < 0 && elevation > 0.5) {
      // cold
      const x4 = 228 + 20 * elevation;
      const grad4 = "rgb(" + x4 + "," + x4 + "," + x4 + ")";
      return [grad4, "#1e272e0f"];
    } else {
      // medium
      const r5 = 22 * (0.75 + elevation * 3.1);
      const g5 = 20 * (0.75 + elevation * 3.1);
      const b5 = 20 * (0.75 + elevation * 3.1);
      const grad5 = "rgb(" + r5 + "," + g5 + "," + b5 + ")";
      return [grad5, colorS];
    }
  }
}

export function drawMap(activePlots, grid, context, voronoi) {
  let x = 0,
    y = 0;
  let colorF, colorS;
  for (let i = 0; i < voronoi._circumcenters.length; i++) {
    if (typeof grid.get(i) !== "undefined") [x, y] = grid.get(i);
    [colorF, colorS] = biomes(x, y);
    const colonyId = activePlots.get(szudzik(x, y));
    if (colonyId !== undefined) {
      const tint = lcg(colonyId);
      drawCell(context, i, "hsl(" + (tint % 360) + ",90%,61%)", voronoi, colorS);
    } else {
      drawCell(context, i, colorF, voronoi, colorS);
    }
  }
}

// returns [elevation, temperature, biome]
export function biomeData(x, y) {
  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);
  const e = (elevation + 0.15) * 1000;
  const t = temperature * 100;

  if (elevation < -0.15) {
    return [e, t, "Sea"];
  } else if (elevation < 0.16) {
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
