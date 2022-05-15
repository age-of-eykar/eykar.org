import { getElevation } from "./biomes";
import { szudzik, lcg } from "../deterministic";
import svgLoader from "svg-webgl-loader-opti";
import fragmentShader from '../../shaders/vectors/fragment.glsl'
import vertexShader from '../../shaders/vectors/vertex.glsl'

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

    async load(webgl) {
        for (const variant of this.oddsThresholds.values())
            await variant.load(webgl);
        this.loaded = true;
    }

    getRandomVariant(x, y) {
        const id = szudzik(x, y); // designed for integers but works fine to get float entropy
        return this.getVariant(lcg(id, 2) % this.maxThreshold);
    }

    apply(chunkTopLeft, length, foo) {
        if (!this.loaded)
            return;
        applyToAssets(chunkTopLeft.x - 0.5, chunkTopLeft.y - 0.5, length,
            this.spacing, this.condition, (x, y) => {
                foo(x, y, this.getRandomVariant(x, y));
            });
    }
}

class AssetVariant {

    constructor(texture, size, rarity) {
        this.texture = texture;
        this.size = size;
        this.rarity = rarity;
        this.loaded = false;
    }

    async load(webgl) {
        this.loaded = await svgLoader(this.texture);
        this.loaded.load({
            webgl,
            shaders: {
                vertex: vertexShader,
                fragment: fragmentShader,
            },
            loc: {
                width: 400,
                height: 400,
            },
            needTrim: false,
        });
    }

}

export const MOUNTAINS_ASSET = new Asset(12, (x, y) => { return getElevation(x, y) > 0.95 },
    [new AssetVariant("/textures/mountains/small.svg", 1.8, 100),
    new AssetVariant("/textures/mountains/medium.svg", 2.4, 3),
    new AssetVariant("/textures/mountains/big.svg", 3.2, 17)]);