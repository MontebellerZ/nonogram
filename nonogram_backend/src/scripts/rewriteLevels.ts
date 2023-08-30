import { readNonDetails } from "./readNon";
import fs from "fs";
import path from "path";

const PATH_NON = "./non";
const WRITE_LEVELS_PATH = "levels.json";

function rewriteLevels() {
    const nonFiles = fs
        .readdirSync(PATH_NON)
        .map((fpath) => readNonDetails(path.join(PATH_NON, fpath)));

    nonFiles.sort((a, b) => a.height * a.width - b.height * b.width);

    fs.writeFileSync(WRITE_LEVELS_PATH, JSON.stringify(nonFiles, null, 4));
}

export default rewriteLevels;
