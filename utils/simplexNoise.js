import { szudzik, lcg } from "./deterministic";

// gradients table for 2D
const grad2 = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

function fastFloor(x) {
    return (x ^ 0) - (x < 0 ? 1 : 0);
}

function dot(grad, x, y) {
    return grad[0] * x + grad[1] * y;
}

function computeContributions(x, y, grad) {
    const t = 0.5 - x*x-y*y;

    if (t >= 0) {
        return Math.pow(t, 4) * dot(grad2[grad], x, y);
    } else {
        return 0;
    }
}

function noise(x, y) {
    const F2 = 0.3660254037844386;
    const G2 = 0.21132486540518713;
    const s = (x + y) * F2;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const t = (i + j) * G2;
    const X0 = i-t;
    const Y0 = j-t;
    const x0 = x-X0;
    const y0 = y-Y0;
    let i1, j1;

    if(x0 > y0) {
        i1 = 1;
        j1 = 0;
    } else {
        i1 = 0;
        j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;
    const gi0 = lcg(szudzik(i, j), 2) % 8;
    const gi1 = lcg(szudzik(i+i1, j+j1), 2) % 8;
    const gi2 = lcg(szudzik(i+1, j+1), 2) % 8;

    const n0 = computeContributions(x0, y0, gi0);
    const n1 = computeContributions(x1, y1, gi1);
    const n2 = computeContributions(x2, y2, gi2);

    return 70.0 * (n0 + n1 + n2);
}

export function simplexNoise(x, y, octaves, persistence, frequency) {
    let r = 0,
      f = frequency,
      amplitude = 1,
      max = 0;
  
    for (let i = 0; i < octaves; i++) {
      r += noise(x * f, y * f) * amplitude;
      f *= 2;
      max += amplitude;
      amplitude *= persistence;
    }
    return r / max;
}