import { nonData } from "../types";
import { nonoCombinations, totalCombinations } from "./combinations";
import printer from "./printer";

function certainInCombs(combination: boolean[][], maxLength: number): boolean[] {
    const result: boolean[] = new Array(maxLength).fill(null);

    for (let i = 0; i < maxLength; i++) {
        let flagFalse = true;
        let flagTrue = true;

        for (let j = 0; j < combination.length; j++) {
            if (combination[j][i]) flagFalse = false;
            if (!combination[j][i]) flagTrue = false;

            if (!flagFalse && !flagTrue) break;
        }

        if (flagFalse) result[i] = false;
        if (flagTrue) result[i] = true;
    }

    return result;
}

function willOverlap(row: number[], maxLength: number): number {
    const totalBlocks = row.reduce((sum, val) => sum + val, row.length - 1);
    const blankBlocks = maxLength - totalBlocks;

    const overlapBlocks = row.reduce((sum, val) => sum + Math.max(val - blankBlocks, 0), 0);

    return overlapBlocks;
}

function isWorthOverlap(row: number[], maxLength: number) {
    const combinationsLimit = 200_000_000_000_000;
    const worthPercentage = 0;

    const overlapBlocks = willOverlap(row, maxLength);
    if (overlapBlocks <= 0) return false;

    const overlapPercentage = (overlapBlocks * 100) / maxLength;
    if (overlapPercentage < worthPercentage) return false;

    const combinations = totalCombinations(row, maxLength);
    if (combinations > combinationsLimit) return false;

    console.log(overlapBlocks, overlapPercentage, combinations);

    return true;
}

function fillCertains(resolution: boolean[][], rows: number[][], columns: number[][]) {
    const maxColumns = columns.length;
    const maxRows = rows.length;

    for (let i = 0; i < maxRows; i++) {
        const row = rows[i];

        const isWorth = isWorthOverlap(row, maxColumns);

        if (!isWorth) continue;

        const t1 = Date.now();
        const combinations = nonoCombinations(row, maxColumns);
        console.log("Time taken:", Date.now() - t1, "ms");

        const newRow = certainInCombs(combinations, maxColumns);

        // console.log(newRow);
    }
}

function solver(level: nonData) {
    const { goal, height, width, rows, columns } = level;

    const resolution: boolean[][] = [];

    for (let i = 0; i < height; i++) resolution.push(new Array(width).fill(null));

    fillCertains(resolution, rows, columns);

    // printer(goal);
}

export default solver;
