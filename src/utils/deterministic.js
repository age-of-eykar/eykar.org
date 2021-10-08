export function szudzik(x, y) {
    const xx = x >= 0 ? x * 2 : x * -2 - 1;
    const yy = y >= 0 ? y * 2 : y * -2 - 1;
    return (xx >= yy) ? (xx * xx + xx + yy) : (yy * yy + xx);
};

export function reversedSzudzik(z) {
    const sqrtz = Math.floor(Math.sqrt(z));
    const sqz = sqrtz * sqrtz;
    const result1 = ((z - sqz) >= sqrtz) ? [sqrtz, z - sqz - sqrtz] : [z - sqz, sqrtz];
    const xx = result1[0] % 2 === 0 ? result1[0] / 2 : (result1[0] + 1) / -2;
    const yy = result1[1] % 2 === 0 ? result1[1] / 2 : (result1[1] + 1) / -2;
    return [xx, yy];
};

export function lcg(seed, loop = 1) {
    for (; loop > 0; loop--)
        seed = (1_103_515_245 * seed + 12345) % 999_999_937
    return seed;
}
