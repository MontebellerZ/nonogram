import fs from "fs";
import { nonData, nonFile } from "../types";

const RGX_INT = /^[0-9]+(,[0-9]+)*$/;

function convertGoalString(goalString: string, height: number, width: number): boolean[][] {
	if (!goalString || !height || !width) throw "Invalid goal converter arguments";

	if (goalString.length !== height * width) throw "Incorrect goal length";

	const goal: boolean[][] = [];

	for (let i = 0; i < height; i++) {
		goal.push([]);

		const hIndex = i * width;

		for (let j = 0; j < width; j++) {
			const index = hIndex + j;

			const strVal = goalString[index];

			if (strVal !== "0" && strVal !== "1") throw "Invalid character in goal string";

			const boolVal = Boolean(Number(strVal));

			goal[i].push(boolVal);
		}
	}

	return goal;
}

function checkGoalRowsColumns(goal: boolean[][], rows: number[][], columns: number[][]): boolean {
	let rowTrues: number[][] = [];
	let columnTrues: number[][] = [];

	for (let i = 0; i < goal.length; i++) {
		rowTrues.push([]);

		for (let j = 0; j < goal[i].length; j++) {
			if (i === 0) columnTrues.push([]);

			if (!goal[i][j]) continue;

			if (!goal[i][j - 1]) rowTrues[i].push(0);

			if (!goal[i - 1] || !goal[i - 1][j]) columnTrues[j].push(0);

			rowTrues[i][rowTrues[i].length - 1]++;

			columnTrues[j][columnTrues[j].length - 1]++;
		}
	}

	for (let i = 0; i < Math.max(rowTrues.length, columnTrues.length); i++) {
		if (rowTrues[i] && rowTrues[i].length === 0) rowTrues[i].push(0);
		if (columnTrues[i] && columnTrues[i].length === 0) columnTrues[i].push(0);
	}

	const rowInfo = JSON.stringify(rows);
	const rowReal = JSON.stringify(rowTrues);
	if (rowInfo !== rowReal) return false;

	const columnInfo = JSON.stringify(columns);
	const columnReal = JSON.stringify(columnTrues);
	if (columnInfo !== columnReal) return false;

	return true;
}

export function readNonDetails(filepath: string): nonFile {
	const readFile = fs.readFileSync(filepath, "utf-8").split("\n");

	const title = readFile.find((line) => line.startsWith("title "))?.slice(7, -1) ?? "";
	const author = readFile.find((line) => line.startsWith("by "))?.slice(4, -1) ?? "";
	const copyright = readFile.find((line) => line.startsWith("copyright "))?.slice(11, -1) ?? "";
	const license = readFile.find((line) => line.startsWith("license "))?.slice(8) ?? "";
	const height = Number(readFile.find((line) => line.startsWith("height "))?.slice(6)) ?? "";
	const width = Number(readFile.find((line) => line.startsWith("width "))?.slice(5)) ?? "";

	const data: nonFile = { filepath, title, author, copyright, license, height, width };

	return data;
}

export function readNon(filepath: string): nonData {
	const readFile = fs
		.readFileSync(filepath, "utf-8")
		.split("\n")
		.map((l) => l.trim());

	const title = readFile.find((line) => line.startsWith("title "))?.slice(7, -1) ?? "";
	const height = Number(readFile.find((line) => line.startsWith("height "))?.slice(6)) ?? "";
	const width = Number(readFile.find((line) => line.startsWith("width "))?.slice(5)) ?? "";

	const goalString = readFile.find((line) => line.startsWith("goal "))?.slice(6, -1) ?? "";
	const goal = convertGoalString(goalString, height, width);

	const beginRows = readFile.findIndex((line) => line === "rows") + 1;
	const endRows = readFile.findIndex((line, i) => i > beginRows && !RGX_INT.test(line));

	const beginColumns = readFile.findIndex((line) => line === "columns") + 1;
	const endColumns = readFile.findIndex((line, i) => i > beginColumns && !RGX_INT.test(line));

	const rows: number[][] = readFile
		.slice(beginRows, endRows)
		.map((line) => line.split(",").map((n) => Number(n)));

	const columns: number[][] = readFile
		.slice(beginColumns, endColumns)
		.map((line) => line.split(",").map((n) => Number(n)));

	const validInfo = checkGoalRowsColumns(goal, rows, columns);

	if (!validInfo) throw "Invalid file info";

	const data: nonData = { title, height, width, goal, rows, columns };

	return data;
}
