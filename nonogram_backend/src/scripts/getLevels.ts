import { nonFile } from "../types";
import { readNon } from "./readNon";

const LEVELS_FILE = "../../levels.json";

export function getLevels() {
    const levels: nonFile[] = require(LEVELS_FILE);

    if (!Array.isArray(levels)) throw "Currupted file: ./levels.json";

    const lvls = levels.map(({ filepath }) => readNon(filepath));

    return lvls;
}

export function getLevelDetails(id: number) {
    const levels: nonFile[] = require(LEVELS_FILE);

    if (!Array.isArray(levels)) throw "Currupted file: ./levels.json";

    return levels[id];
}

export function getLevel(id: number) {
    const levels: nonFile[] = require(LEVELS_FILE);

    if (!Array.isArray(levels)) throw "Currupted file: ./levels.json";

    return readNon(levels[id].filepath);
}
