/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
export function getRgbFromHsl(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b];
}

export function getColonyHue(seed) {
    return (24 * seed % 361) / 360.0;
}

export function weightedW3C(r, g, b) {
    return r * 0.299 + b * 0.587 + g * 0.114;
}

export function getColonyColor(seed) {
    const hue = getColonyHue(seed);
    let brightness = 94 / 100;
    const value = 65 / 100;
    let [r, g, b] = getRgbFromHsl(hue, brightness, value);
    const norm = weightedW3C(r, g, b);
    [r, g, b] = getRgbFromHsl(hue, brightness * (Math.log(norm + 1.0) - 1.0), value);
    return [r, g, b];
}