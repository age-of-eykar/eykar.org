import { feltToString } from "../felt";

let conquerMode;

export function isConquerMode() {
    return conquerMode;
}

export function setConquerMode(mode) {
    conquerMode = mode;
}

let colonyMeta = new Map();
export function getColonyMeta(colonyId) {
    return colonyMeta.get(colonyId);
}

export function updateColonyMeta(colonyId, resp) {
    if (!resp || !resp.colony)
        return;
    const name = feltToString(resp.colony.name)
    return colonyMeta.set(colonyId, { name });
}

let cache;
export function getCache() {
    return cache;
}

export function setCache(newCache) {
    cache = newCache;
}