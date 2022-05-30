
export function convertCoordinates(X, Y, center, scale, ratio) {
    const Cx = center.x
    const Cy = center.y
    const s = 2 / scale
    const p = 0.25
    const y = Cy + Y / (s * ratio * (1 - p * Y))
    const x = Cx + X / s + X * ratio * p * (y - Cy)
    return [x, y];
}

/*
    These two functions make the bridge between cairo 64.61 floating point format to float
*/
const FRAC_PART = 2 ** 61
const P = 2 ** 251 + 17 * 2 ** 192 + 1
const MAX_INT = 2 ** 63

export function fromFloatToFelt(x) {
    const temp = Math.floor(Math.abs(f) * FRAC_PART)
    return f > 0 ? temp : (P - temp) % P
}

export function fromFeltToFloat(x) {
    const intPart = x / FRAC_PART
    const fracPart = n % FRAC_PART
    const res = intPart + fracPart / FRAC_PART
    return res < MAX_INT ? res : fromFeltToFloat(x - P)
}