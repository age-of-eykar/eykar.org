import { lcg, szudzik } from "./deterministic";

// Vector table for gradient
const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0]
];

// Fast dost product function
function fastDot(g, x, y) {
  return g[0] * x + g[1] * y;
}

// get the noise value at the given coordinates
function getGrad(x, y){
    let rand_val = lcg(szudzik(x, y, 1))%15;
    return grad3[rand_val];
}

// Polynomial function with derivative = 0
function poly(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Function for obtaining integer and fractionnal part of a number
function intAndFrac(x) {
  return [Math.floor(x), x - Math.floor(x)];
}

// Cosine interpolation function
function cosineInterpolate(a, b, x) {
  let ft = x * Math.PI;
  let f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}

// Main calculatory function for obtaining noise value at the given coordinates
export function Noise(x, y) {
    let x_int, y_int, x_frac, y_frac;
    [x_int, x_frac] = intAndFrac(x);
    [y_int, y_frac] = intAndFrac(y);

    const g00 = fastDot(getGrad(x_int, y_int), x_frac, y_frac);
    const g01 = fastDot(getGrad(x_int, y_int + 1), x_frac, y_frac - 1);
    const g10 = fastDot(getGrad(x_int + 1, y_int), x_frac - 1, y_frac);
    const g11 = fastDot(getGrad(x_int + 1, y_int + 1), x_frac - 1, y_frac - 1);

    const u = poly(x_frac);
    const v = poly(y_frac);

    const x00 = cosineInterpolate(g00, g10, u);
    const x01 = cosineInterpolate(g01, g11, u);

    const xy = cosineInterpolate(x00, x01, v);
    
    return xy;
}

// Main function
export function perlin(x, y, octaves, persistence, frequency) {
    let r = 0, f = frequency, amplitude = 1, max = 0;
    let t;
    for (let i = 0; i < octaves; i++) {
        t = i * 4096
        r += Noise(x * f + t, y * f + t) * amplitude;
        f *= 2;
        amplitude *= persistence;
        max += amplitude;
    }
    return r / max
}