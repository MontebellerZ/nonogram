import { nonData } from "../types";
import printer from "./printer";

function fillCertains(resolution: boolean[][], rows: number[][], columns: number[][]) {
    const maxBlocksColumn = columns.length;
    const maxBlocksRow = rows.length;

    for (let i = 0; i < maxBlocksRow; i++) {
        const row = rows[i];
        const totalBlocks = row.reduce((sum, val) => sum + val, row.length - 1);

        if (totalBlocks > Math.ceil(maxBlocksColumn / 2 + 1)) {
            const alwaysOn = new Array(maxBlocksColumn).fill(true);
            const flagger = new Array(maxBlocksColumn).fill(null);

            

            for (let j = 0; j < row.length; j++) {}
        }

        // for (let j = 0; j < maxBlocksColumn; j++) {}
    }
}

function solver(level: nonData) {
    const { goal, height, width, rows, columns } = level;

    const resolution: boolean[][] = [];

    for (let i = 0; i < height; i++) resolution.push(new Array(width).fill(null));

    fillCertains(resolution, rows, columns);

    printer(goal);
}

export default solver;
