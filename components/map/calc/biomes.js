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

function gradient(firstColor, secondColor, ratio) {
  const neg = 1 - ratio;
  return [firstColor[0] * ratio + secondColor[0] * neg,
  firstColor[1] * ratio + secondColor[1] * neg,
  firstColor[2] * ratio + secondColor[2] * neg
  ];
}

export function getBiomeColors(x, y) {

  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);

  const sandColor = [0.9, 0.89, 0.73];
  let expectedColor;

  // ocean
  if (elevation < 0.05) {
    if (elevation > 0)
      expectedColor = gradient(sandColor, [0.14, 0.51, 0.51], elevation / 0.05);
    else
      expectedColor = gradient([0.14, 0.51, 0.51], [0.13, 0.37, 0.40], elevation);
  } else // ground
    expectedColor = gradient([0.01, 0.27, 0.01], sandColor, elevation / 2);

  if (temperature < -0.5)
    return gradient([0.9, 0.94, 0.96], [0.73, 0.76, 0.78], (-0.25 - temperature) / 0.25);
  if (elevation < 0 && temperature < -0.48)
    return gradient([0.83, 0.86, 0.88], expectedColor, (-0.45 - temperature) / 0.1);

  return expectedColor;
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
