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
  if (elevation > 0 && elevation <= 0.05)
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

export function getBiomeStyle(biome, styles) {
  if (biome === "Coast")
    return styles.coast_bg;
  if (biome === "Desert")
    return styles.desert_bg;
  if (biome === "Forest")
    return styles.forest_bg;
  if (biome === "Jungle")
    return styles.jungle_bg;
  if (biome === "Plain")
    return styles.plain_bg;
  if (biome === "Frozen Ocean")
    return styles.iceberg_bg;
  if (biome === "Iceberg")
    return styles.iceberg_bg;
  if (biome === "Frozen Land")
    return styles.iceberg_bg;
  if (biome === "Mountain")
    return styles.mountain_bg;
  if (biome === "Ice Mountain")
    return styles.mountain_bg;
  if (biome === "Ocean")
    return styles.ocean_bg;
}


export function getBiomeColors(x, y) {

  const elevation = getElevation(x, y);
  const temperature = getTemperature(x, y);

  const sandColor = [0.9, 0.89, 0.73];
  let expectedColor;

  const oceanColor = gradient([0.14, 0.51, 0.51], [0.13, 0.37, 0.40], elevation * 1.25);
  const groundColor = gradient([0.05, 0.27, 0.01], sandColor, elevation / 1.8);

  // ocean
  if (elevation <= 0.05) {
    if (elevation > 0)
      expectedColor = gradient(groundColor, gradient(oceanColor, sandColor, 0.85), elevation / 0.05)
    else
      expectedColor = oceanColor;
  } else // ground
    expectedColor = groundColor;

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
