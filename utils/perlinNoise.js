import { lcg, szudzik } from "./deterministic";

// Vector table for gradient
const grad2 = [
  [1, 0],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [1, -1],
  [0, 1],
];

// Fast dost product function
function fastDot(g, x, y) {
  return g[0] * x + g[1] * y;
}

// get the noise value at the given coordinates
function getGrad(x, y, s) {
  let rand_val = lcg(szudzik(x, y) + s) % 6;
  return grad2[rand_val];
}

// Function for obtaining integer and fractionnal part of a number
function intAndFrac(n) {
  const floor = Math.floor(n);
  return [floor, n - floor];
}

// Cubic interpolation function
function cubicInterpolate(a, b, t) {
  let f = t * t * t * (t * (t * 6 - 15) + 10);
  return a * (1 - f) + b * f;
}

// Main calculatory function for obtaining noise value at the given coordinates
export function noise(x, y, s) {
  let x_int, y_int, x_frac, y_frac;
  [x_int, x_frac] = intAndFrac(x*2);
  [y_int, y_frac] = intAndFrac(y);

  const g00 = fastDot(getGrad(x_int, y_int, s), x_frac, y_frac);
  const g01 = fastDot(getGrad(x_int, y_int + 1, s), x_frac, y_frac - 1);
  const g10 = fastDot(getGrad(x_int + 1, y_int, s), x_frac - 1, y_frac);
  const g11 = fastDot(getGrad(x_int + 1, y_int + 1, s), x_frac - 1, y_frac - 1);

  const x00 = cubicInterpolate(g00, g10, x_frac);
  const x01 = cubicInterpolate(g01, g11, x_frac);
  const xy = cubicInterpolate(x00, x01, y_frac);

  return xy;
}

// Main function
export function perlin(x, y, octaves, persistence, frequency, seed) {
  let r = 0,
    f = frequency,
    amplitude = 1,
    max = 0;

  for (let i = 0; i < octaves; i++) {
    r += noise(x * f, y * f, seed) * amplitude;
    f *= 2;
    amplitude *= persistence;
    max += amplitude;
  }
  return r / max;
}