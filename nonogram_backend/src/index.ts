import { getLevel } from "./scripts/getLevels";
import solver from "./scripts/solver";

const n = Number(process.argv[2]);

const lvl = getLevel(n);
const teste = solver(lvl);
