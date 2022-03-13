import { perlin } from "../../../utils/perlinNoise";

function getElevation(x, y) {
  return perlin(x, y, 3, 0.5, 0.01, 0);
}

function getTemperature(x, y) {
  return perlin(x, y, 1, 1, 0.015, 0);
}



// Color table:
const desertIce = [189 / 255, 245 / 255, 233 / 255, 1.0];
const desertSand = [237 / 255, 201 / 255, 175 / 255, 1.0];
const plainContinental = [186 / 255, 203 / 255, 56 / 255, 1.0];

export function getBiomeColors(x, y) {
  return [Math.random(), Math.random(), Math.random()];
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
