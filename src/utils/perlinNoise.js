import { szudzik, lcg } from "./deterministic"

function rand(x, y) {
    return ((lcg(szudzik(x, y, 3))%100)-50)/50;
}

function cosineInterpolate(Ax, Bx, t) {
    const c = (1-Math.cos(t*Math.PI)) * 0.5;
    return (1. - c) * Ax + c * Bx;
}

function smoothNoiseCosine(x, y) {
    let int_X = Math.floor(x), int_Y = Math.floor(y);
    let frac_X = x - int_X;
    if (x < 0) int_X -= 1
    if (y < 0) int_Y -= 1

    const a = smoothedNoise(int_X, int_Y);
    const b = smoothedNoise(int_X+1, int_Y);
    const c = smoothedNoise(int_X, int_Y+1);
    const d = smoothedNoise(int_X+1, int_Y+1);

    const f = cosineInterpolate(a, b, frac_X);
    const g = cosineInterpolate(c, d, frac_X);

    return cosineInterpolate(f, g, frac_X);
}

function smoothedNoise(x, y) {
    const corners = (rand(x-1, y-1) + rand(x+1, y-1) + rand(x-1, y+1) + rand(x+1, y+1)) / 16
    const sides =  (rand(x-1, y) + rand(x+1, y) + rand(x, y-1) + rand(x, y+1)) /8
    const center = rand(x, y) / 4
    return corners + sides + center
}

function smoothCubicBis(intX, intY, fracX) {
    const v0 = rand(intX-1, intY);
    const v1 = rand(intX, intY);
    const v2 = rand(intX+1, intY);
    const v3 = rand(intX+2, intY);

    return cubicInterpolate(v0, v1, v2, v3, fracX);
}

function smoothNoiseCubic(x, y) {
    const int_X = Math.floor(x), int_Y = Math.floor(y);
    const frac_X = x - int_X, frac_Y = y - int_Y;

    const t0 = smoothCubicBis(int_X, int_Y-1, frac_X);
    const t1 = smoothCubicBis(int_X, int_Y,   frac_X);
    const t2 = smoothCubicBis(int_X, int_Y+1, frac_X);
    const t3 = smoothCubicBis(int_X, int_Y+2, frac_X);

    return cubicInterpolate(t0, t1, t2, t3, frac_Y);
}

function cubicInterpolate(p1, p2, p3, p4, t) {
    const a2 = -0.5 * p1 + 0.5 * p3;
    const a3 = p1 - 2.5 * p2 + 2 * p3 - 0.5 * p4;
    const a4 = -0.5 * p1 + 1.5 * p2 - 1.5 * p3 + 0.5 * p4;
    return p1 + a2 * t + a3 * t*t + a4 * t*t*t;
}

/*
Explication des variables :
- octaves :
    nombre d'appels a la fonction de bruit lisse
- frequence :
    c'est l'inverse du pas, l'intervale entre deux points definis  par le bruit
- persistence :
    controle de la variation d'amplitude des courbes (part d'une courbe dans la courbe finale)
- amplitude :
    c'est l'ecart maximal en ordonne entre les points de la courbe

*/

export function perlin1(octaves, frequency, persistence, x, y) {
    let r = 0, f = 1, amplitude = 1;
    for (let i = 0; i < octaves; i++) {
        amplitude *= persistence;
        f *= 2;
        r += smoothNoiseCosine(x * f, y * f) * amplitude;
    }
    
    return r * (1-persistence) / (1-amplitude);
}

export function perlin2(octaves, frequency, persistence, x, y) {
    let r = 0., f = frequency, amplitude = 1.;
    for (let i = 0; i < octaves; i++) {
        r += smoothNoiseCubic(x * f, y * f) * amplitude;
        amplitude *= persistence;
        f *= 2;
    }
    
    return r * (1-persistence) / (1-amplitude);
}

export function perlinTest(sizeX, sizeY) {
    let randTab = []
    for (let i = 0; i < sizeX; i++) {
        for (let j= 0; j < sizeY; j++) {
            randTab.push(perlin1(3, 1, 0.95, i, j));
        }
    }
    return randTab;
}