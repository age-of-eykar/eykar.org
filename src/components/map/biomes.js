import { perlin } from "../../utils/perlinNoise"
import { drawCell } from "./gridManager"

function getElevation(x, y) {
    return perlin(x, y, 3, 0.5, 0.01, 0);
}

function getTemperature(x, y) {
    return perlin(x, y, 1, 1, 0.015, 0);
}

// Color table:
const desertIce = "#bdf5e9";
const desertSand = "#edc9af";
const forestContinental = "#177245";
const forestJungle = "#066000";
const forestTundra = "#204c39";
const plainContinental = "#bacb38";
const plainSavanna = "#f8de7e";

function biomes(x, y) {
    const elevation = getElevation(x, y);
    const temperature = getTemperature(x, y);
    const colorS = "#1e272e20";
    if (elevation < -0.15) {                   // negative elevation
        const r1 = 62 * (1 + elevation*1.2);
        const g1 = 146 * (1 + elevation*1.2);
        const b1 = 209 * (1 + elevation*1.2);
        const grad1 = "rgb("+r1+","+g1+","+b1+")";
        return [grad1, grad1];
    } else if (elevation < 0.16) {             // medium elevation
        if (temperature < -0.2) {                  // cold
            if (temperature < -0.35)
                return [desertIce, colorS];
            else if (elevation > 0.05)
                return [forestTundra, colorS];
            else
                return [plainContinental, colorS];
        } else if (temperature < 0.2) {             // medium
            if (elevation > 0.05)
                return [forestContinental, colorS];
            else
                return [plainContinental, colorS];
        } else {                                    // warm
            if (temperature > 0.3)
                return [desertSand, colorS];
            else if (elevation > 0.05)
                return [forestJungle, colorS];
            else
                return [plainSavanna, colorS];
        }
    } else {                                    // High elevation
        if (temperature < 0 && elevation > 0.5) {                      // cold
            const x2 = 228 + 20 * elevation;
            const grad2 = "rgb("+x2+","+x2+","+x2+")";
            return [grad2, "#1e272e0f"];
        } else {                                    // medium
            const r3 = 43 * (1 + elevation*1.5);
            const g3 = 23 * (1 + elevation*1.5);
            const b3 = 7 * (1 + elevation*1.5);
            const grad3 = "rgb("+r3+","+g3+","+b3+")";
            return [grad3, colorS];
       }
    }
}

export function drawMap(grid, context, voronoi) {
    let x = 0, y = 0;
    let colorF, colorS;
    for (let i = 0; i < voronoi._circumcenters.length; i++) {
        if (typeof grid.get(i) !== 'undefined')
            [x, y] = grid.get(i);
        [colorF, colorS] = biomes(x, y);
        drawCell(context, i, colorF, voronoi, colorS);
    }
}

// returns [elevation, temperature, biome]
export function biomeData(x, y) {
    const elevation = getElevation(x, y);
    const temperature = getTemperature(x, y);
    const e = elevation  * 45 + 5;
    const t = temperature * 5000;
        
    if (elevation < -0.15) {
        return [e, t, "Sea"];
    } else if (elevation < 0.16) {
        if (temperature < -0.2) {
            if (temperature < -0.35)
                return [e, t, "Ice desert"];
            else if (elevation > 0.05)
                return [e, t, "Tundra forest"];
            else
                return [e, t, "Continental plain"];
        } else if (temperature < 0.2) {
            if (elevation > 0.05)
                return [e, t, "Continental forest"];
            else
                return [e, t, "Continental plain"];
        } else {
            if (temperature > 0.3)
                return [e, t, "Sand desert"];
            else if (elevation > 0.05)
                return [e, t, "Jungle forest"];
            else
                return [e, t, "Savanna plain"];
        }
    } else {
        if (temperature < 0 && elevation > 0.5) {
            return [e, t, "Snowy mountains"];
        } else {
            return [e, t, "Rocky mountains"];
       }
    }
}