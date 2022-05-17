

import { getElevation, getTemperature } from "./biomes";
import { szudzik, lcg } from "../deterministic";

/**
 * Apply foo to assets coordinates over a specific area
 * @param {number} topx top left x coordinate of the chunk, for chunk: topLeft.x - 0.5
 * @param {number} topy top left y coordinate of the chunk, for chunk: topLeft.y - 0.5
 * @param {number} length to go through
 * @param {number} spacing spacing between assets
 * @param {(x, y) -> (bool)} condition to apply to asset
 * @param {(x, y) -> ()} foo function to apply
 */
function applyToAssets(topx, topy, length, spacing, condition, foo) {
    for (let i = topx - (topx % spacing); i < topx + length; i += spacing)
        for (let j = topy - (topy % spacing); j < topy + length; j += spacing) {
            const seed1 = lcg(szudzik(i, j), 2);
            const seed2 = lcg(seed1, 1);
            const x = i + (((seed1 % 91) / 100 - 0.45) * spacing);
            const y = j + (((seed2 % 91) / 100 - 0.45) * spacing);

            if (condition(x, y)) {
                foo(x, y);
            }

        }
}

class Asset {
    constructor(spacing, condition, variants) {
        this.spacing = spacing
        this.condition = condition
        this.oddsThresholds = new Map();
        let threshold = 0;
        for (const variant of variants) {
            threshold += variant.frequency;
            this.oddsThresholds.set(threshold, variant);
        }
        this.maxThreshold = threshold;
    }

    getVariant(interThreshold) {
        for (const threshold of this.oddsThresholds.keys())
            if (interThreshold < threshold)
                return this.oddsThresholds.get(threshold);
    }

    getRandomVariant(x, y) {
        const id = szudzik(x, y); // designed for integers but works fine to get float entropy
        return this.getVariant(lcg(id, 2) % this.maxThreshold);
    }

    apply(topx, topy, length, foo) {
        applyToAssets(topx - 0.5, topy - 0.5, length,
            this.spacing, this.condition, (x, y) => {
                foo(x, y, this.getRandomVariant(x, y));
            });
    }
}

export const MOUNTAINS_ASSET = new Asset(9.5, (x, y) => {
    const elevation = getElevation(x, y);
    const temperature = getTemperature(x, y);
    return elevation > 0.5 && temperature > -0.5;
},
    [
        { sprite: "small_mountain", zoom: 3.0, frequency: 240 },
        { sprite: "medium_mountain", zoom: 3.0, frequency: 480 },
        { sprite: "big_mountain", zoom: 4.0, frequency: 120 },
        { sprite: "huge_mountain", zoom: 4.0, frequency: 50 },
        { sprite: "peak_mountain", zoom: 5.0, frequency: 40 },
        { sprite: "twins_mountain", zoom: 4.0, frequency: 30 },
        { sprite: "arch_mountain", zoom: 4.0, frequency: 20 },
        { sprite: "magic_mountain", zoom: 5.0, frequency: 1 },
    ]
);