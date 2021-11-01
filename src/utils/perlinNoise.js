import { szudzik, lcg } from "./deterministic"

function rand(x, y) {
    return ((lcg(szudzik(x, y, 3))%100)-50)/100;
}

function tableauTest(taille) {
    let coordArray = []

    for (let i = 0; i < taille; i++) {
        for(let j = 0; j < taille; j++) {
            coordArray.push([i, j]);
        }
    }

    return coordArray;
}

/*  Exemples de biomes sur 10 :

- entre 0 et 3 plaines -> jaune sable rgb(255,222,125)
- entre 4 et 6 montagnes -> marron fonce rgb(123,7,7)
- entre 7 et 9 foret -> vert fonce rgb(6,59,0)

*/
export function randTest(sizeX, sizeY) {
    let randTab = []
    for (let i = 0; i < sizeX; i++) {
        for (let j= 0; j < sizeY; j++) {
            randTab.push(rand(i, j));
        }
    }
    return randTab;
}

function cosineInterpolate(Ax, Bx, t) {
    const c = (1-Math.cos(t*Math.PI)) * 0.5;
    return (1-c) * Ax+c * Bx;
}

function smoothNoiseCosine(x, y) {
    const int_X = Math.trunc(x), int_Y = Math.trunc(y);
    const frac_X = x - int_X; //, frac_Y = y - int_Y;

    const a = rand(int_X, int_Y);
    const b = rand(int_X+1, int_Y);
    const c = rand(int_X, int_Y+1);
    const d = rand(int_X+1, int_Y+1);

    const f = cosineInterpolate(a, b, frac_X);
    const g = cosineInterpolate(c, d, frac_X);

    return cosineInterpolate(f, g, frac_X);
}

function smoothCubicBis(intX, intY, fracX) {
    const v0 = rand(intX-1, intY);
    const v1 = rand(intX, intY);
    const v2 = rand(intX+1, intY);
    const v3 = rand(intX+2, intY);

    return cubicInterpolate(v0, v1, v2, v3, fracX);
}

function smoothNoiseCubic(x, y) {
    const int_X = Math.trunc(x), int_Y = Math.trunc(y);
    const frac_X = x - int_X, frac_Y = y - int_Y;

    const t0 = smoothCubicBis(int_X, int_Y-1, frac_X);
    const t1 = smoothCubicBis(int_X, int_Y,   frac_X);
    const t2 = smoothCubicBis(int_X, int_Y+1, frac_X);
    const t3 = smoothCubicBis(int_X, int_Y+2, frac_X);

    return cubicInterpolate(t0, t1, t2, t3, frac_Y);
}

function cubicInterpolate(p1, p2, p3, p4) {
    const a2 = -0.5 * p1 + 0.5 * p3;
    const a3 = p1 - 2.5 * p2 + 2 * p3 - 0.5 * p4;
    const a4 = -0.5 * p1 + 1.5 * p2 - 1.5 * p3 + 0.5 * p4;
    return [p1, a2, a3, a4];
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
    let r = 0., f = frequency, amplitude = 1.;

    for (let i = 0; i < octaves; i++) {
        r += smoothNoiseCosine(x * f, y * f) * amplitude;
        amplitude *= persistence;
        //console.log("r = ", r, "persistence = ", persistence, "amplitude = ", amplitude)
        f *= 2;
    }
    
    return r * (1-persistence) / (1-amplitude);
}

export function perlinTest(sizeX, sizeY) {
    let randTab = []
    for (let i = 0; i < sizeX; i++) {
        for (let j= 0; j < sizeY; j++) {
            randTab.push(perlin1(3, 1, 0.5, i, j));
            //console.log("Perlin", perlin1(1, 1, 1, i, j))
        }
    }
    return randTab;
}

// fonction polynomiale d'odre 5, derivees 1 et 2 nulles
function polynomial5F(t) {
    return 6*Math.pow(t, 5) - 15*Math.pow(t, 4) + 10*Math.pow(t, 3);
}