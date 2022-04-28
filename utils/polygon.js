function dotProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function vector(a, b) {
    return [b[0] - a[0], b[1] - a[1]];
}

export function isInsideConvex(loc, polygon) {
    for (let i = 0; i < polygon.length; i++) {
        const pi = polygon[i];
        const nextPi = polygon[(i + 1) % polygon.length];
        const p = vector(nextPi, pi);
        const orth = [p[1], -p[0]];
        if (dotProduct(orth, vector(pi, loc)) < 0)
            return false;
    }
    return true;
}
