let conquerMode;

export function isConquerMode() {
    return conquerMode;
}

export function setConquerMode(mode) {
    conquerMode = mode;
}

let colonyMeta = new Map();
export function getColonyMeta(colonyId) {
    return colonyMeta.get(colonyId, false);
}

export function setColonyMeta(colonyId, meta) {
    return colonyMeta.set(colonyId, meta);
}

let cache;
export function getCache() {
    return cache;
}

export function setCache(newCache) {
    cache = newCache;
}