import { simplexNoise } from "../simplexNoise";

export function getElevation(x, y) {
  return simplexNoise(x, y, 3, 0.5, 0.01);
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

  // ice
  if (temperature < -0.5)
    return gradient([0.9, 0.94, 0.96], [0.73, 0.76, 0.78], (-0.25 - temperature) / 0.25);
  // icebergs
  if (elevation < 0 && temperature < -0.48)
    return gradient([0.83, 0.86, 0.88], expectedColor, (-0.45 - temperature) / 0.1);

  // desert
  if (elevation > 0 && temperature > 0.5)
    return gradient(sandColor, expectedColor, (temperature - 0.5) / 0.5);

  // mountains
  if (elevation > 0.5)
    return gradient([0.9, 0.9, 0.9], expectedColor, (elevation - 0.5) / 2);

  return expectedColor;
}
