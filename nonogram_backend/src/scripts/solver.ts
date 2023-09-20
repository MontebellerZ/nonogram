import { nonData } from "../types";
import { nonoCombinations, totalCombinations } from "./combinations";
import printer from "./printer";

function getResolutionRow(rowId: number, resolution: boolean[][]): boolean[] {
	return resolution[rowId];
}
function getResolutionColumn(columnId: number, resolution: boolean[][]): boolean[] {
	return resolution.map((row) => row[columnId]);
}

function whoIBelongTo() {}

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

function fillInitial(resolution: boolean[][], rows: number[][], columns: number[][]) {
	const maxColumns = columns.length;
	const maxRows = rows.length;

	for (let i = 0; i < maxRows; i++) {
		const row = rows[i];
		const overlapped = overlapResult(row, maxColumns);

		overlapped.forEach((v, j) => {
			if (v != null) resolution[i][j] = v;
		});
	}

	for (let i = 0; i < maxColumns; i++) {
		const column = columns[i];
		const overlapped = overlapResult(column, maxRows);

		overlapped.forEach((v, j) => {
			if (v != null) resolution[j][i] = v;
		});
	}
}

// function fill

function solver(level: nonData) {
	const { goal, height, width, rows, columns } = level;

	const resolution: boolean[][] = [];

	for (let i = 0; i < height; i++) resolution.push(new Array(width).fill(null));

	fillInitial(resolution, rows, columns);

	printer(resolution);

	// console.log("\n\n");

	// printer(goal);

	return resolution;
}

export default solver;
