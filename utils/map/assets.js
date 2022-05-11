import { getElevation } from "./biomes";
import svgLoader from "svg-webgl-loader";

/**
 * Apply foo to assets coordinates over a specific area
 * @param {number} topx top left x coordinate of the chunk, for chunk: topLeft.x - 0.5
 * @param {number} topy top left y coordinate of the chunk, for chunk: topLeft.y - 0.5
 * @param {number} spacing spacing between assets
 * @param {number} length to go through
 * @param {(x, y) -> (bool)} condition to apply to asset
 * @param {(x, y) -> ()} foo function to apply
 */
function applyToAssets(topx, topy, spacing, length, condition, foo) {
    for (let i = topx - (topx % spacing); i < topx + length; i += spacing)
        for (let j = topy - (topy % spacing); j < topy + length; j += spacing)
            if (condition(i, j))
                foo(i, j);
}

class Asset {
    constructor(spacing, condition, variants) {
        this.spacing = spacing
        this.condition = condition
        this.oddsThresholds = new Map();
        let threshold = 0;
        for (const variant of variants) {
            threshold += variant.rarity;
            this.oddsThresholds.set(threshold, variant);
        }
        this.maxThreshold = threshold;
        this.loaded = false;
    }

    getVariant(interThreshold) {
        for (const threshold of this.oddsThresholds.keys())
            if (interThreshold < threshold)
                return this.oddsThresholds.get(threshold);
    }

    async load() {
        for (const variant of this.oddsThresholds.values())
            await variant.load();
        this.loaded = true;
        console.log("loaded!")
    }
}

class AssetVariant {

    constructor(texture, size, rarity) {
        this.texture = texture;
        this.size = size;
        this.rarity = rarity;
        this.loaded = false;
    }

    async load() {
        this.loaded = await svgLoader(this.texture);
    }

}

export const MOUNTAINS_ASSET = new Asset(12, (x, y) => { getElevation(x, y) > 0.5 },
    [new AssetVariant("/textures/mountains/small.svg", 1.8, 5),
    new AssetVariant("/textures/mountains/medium.svg", 2.4, 3),
    new AssetVariant("/textures/mountains/big.svg", 3.2, 17)]);