
export function convertCoordinates(X, Y, center, scale, ratio) {
    const Cx = center.x
    const Cy = center.y
    const s = 2 / scale
    const p = 0.25
    const y = Cy + Y / (s * ratio * (1 - p * Y))
    const x = Cx + X / s + X * ratio * p * (y - Cy)
    return [x, y];
}