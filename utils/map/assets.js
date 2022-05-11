import { getElevation } from "./biomes";

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

const ASSETS = [
    {
        spacing: 12,
        condition: (x, y) => { getElevation(x, y) > 0.5 },
        variants: [
            {
                texture: "mountains/small.svg",
                size: 1.8,
                rarity: 5
            },
            {
                texture: "mountains/regular.svg",
                size: 2.5,
                rarity: 3
            },
            {
                texture: "mountains/big.svg",
                size: 3.2,
                rarity: 17
            },
        ]
    }
];