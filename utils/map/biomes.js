import { simplexNoise } from "../simplexNoise";

export function getElevation(x, y) {
  return simplexNoise(x, y, 3, 0.5, 0.012);
}

export function getTemperature(x, y) {
  return simplexNoise(x, y, 1, 1, 0.015);
}


function gradient(firstColor, secondColor, ratio) {
  const neg = 1 - ratio;
  return [firstColor[0] * ratio + secondColor[0] * neg,
  firstColor[1] * ratio + secondColor[1] * neg,
  firstColor[2] * ratio + secondColor[2] * neg
  ];
}

export function getBiomeName(elevation, temperature) {
  if (elevation > -0.05 && elevation < 0.05)
    return "Coast";

  if (elevation < 0) {
    if (elevation < 0 && temperature < -0.9)
      return "Iceberg";
    if (temperature < -0.85)
      return "Frozen Ocean";

    return "Ocean";
  }

  if (elevation > 0.7) {
    if (temperature < -0.9)
      return "Ice Mountain";
    return "Mountain";
  }

  // ice
  if (temperature < -0.9)
    return "Frozen Land";

  if (elevation > 0.2 && temperature > 0.1)
    if (temperature < 0.4)
      return "Forest";
    else if (temperature < 0.7)
      return "Jungle";

  if (temperature > 0.7)
    return "Desert";

  return "Plain";
}


export function getBiomeColors(x, y) {

  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);

  const sandColor = [0.9, 0.89, 0.73];
  let expectedColor;

  // ocean
  if (elevation < 0.05) {
    if (elevation > -0.05)
      expectedColor = gradient(sandColor, [0.13, 0.41, 0.45], (elevation + 0.05) / 0.1);
    else
      expectedColor = gradient([0.14, 0.51, 0.51], [0.13, 0.37, 0.40], elevation / 1.2);
  } else // ground
    expectedColor = gradient([0.05, 0.27, 0.01], sandColor, elevation / 3);

  // ice
  if (temperature < -0.92)
    return gradient([0.75, 0.79, 0.81], gradient(expectedColor, [1, 1, 1], 0.5), (-0.85 - temperature) / 0.11);
  // icebergs
  if (elevation < 0 && temperature < -0.88)
    return gradient([0.83, 0.86, 0.88], expectedColor, (-0.85 - temperature) / 0.1);

  // mountains
  if (elevation > 0.7)
    return gradient([0.9, 0.9, 0.9], expectedColor, (elevation - 0.7) / 3);

  return expectedColor;
}
