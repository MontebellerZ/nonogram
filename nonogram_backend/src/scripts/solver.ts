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
	const overlapBlocks = willOverlap(row, maxLength);
	if (overlapBlocks <= 0) return false;

	return true;
}

function overlapResult(row: number[], maxLength: number): boolean[] {
	const fullRow: boolean[] = new Array(maxLength).fill(null);

	row.forEach((group, i, arr) => {
		const beforeGroup = arr.slice(0, i).reduce((sum, val) => sum + val, i);
		const afterGroup = arr.slice(i + 1).reduce((sum, val) => sum + val, arr.length - (i + 1));

		const beginBorder = beforeGroup + group;
		const endBorder = maxLength - afterGroup - group;

		for (let j = endBorder; j < beginBorder; j++) fullRow[j] = true;
	});

	return fullRow;
}

function fillCertains(resolution: boolean[][], rows: number[][], columns: number[][]) {
	const maxColumns = columns.length;
	const maxRows = rows.length;

	for (let i = 0; i < maxRows; i++) {
		const row = rows[i];

		const isWorth = isWorthOverlap(row, maxColumns);

		if (!isWorth) continue;

		const overlapped = overlapResult(row, maxColumns);

		overlapped.forEach((v, j) => {
			if (v != null) resolution[i][j] = v;
		});
	}

	for (let i = 0; i < maxColumns; i++) {
		const column = columns[i];

		const isWorth = isWorthOverlap(column, maxRows);

		if (!isWorth) continue;

		const overlapped = overlapResult(column, maxRows);

		overlapped.forEach((v, j) => {
			if (v != null) resolution[j][i] = v;
		});
	}
}

function solver(level: nonData) {
	const { goal, height, width, rows, columns } = level;

	const resolution: boolean[][] = [];

	for (let i = 0; i < height; i++) resolution.push(new Array(width).fill(null));

	fillCertains(resolution, rows, columns);

	printer(resolution);

	// console.log("\n\n");

	// printer(goal);
}

export default solver;
