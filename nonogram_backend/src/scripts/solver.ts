import { nonData } from "../types";
import { nonoCombinations, totalCombinations } from "./combinations";
import printer from "./printer";

function getResolutionRow(rowId: number, resolution: boolean[][]): boolean[] {
    return resolution[rowId];
}
function getResolutionColumn(columnId: number, resolution: boolean[][]): boolean[] {
    return resolution.map((row) => row[columnId]);
}

function groupRanges(row: number[], maxRange: number) {
    const ranges = row.map((group, i, arr) => {
        const beforeGroup = arr.slice(0, i).reduce((sum, val) => sum + val, i);
        const afterGroup = arr.slice(i + 1).reduce((sum, val) => sum + val, arr.length - (i + 1));

        const left = beforeGroup;
        const right = maxRange - afterGroup;

        return { group, range: [left, right] };
    });

    return ranges;
}

function overlapGroup(group: number, range: number[]) {
    const beforeGroup = range[0];
    const afterGroup = range[1];

    const beginBorder = beforeGroup + group;
    const endBorder = afterGroup - group;

    const marks = [];

    for (let i = endBorder; i < beginBorder; i++) marks.push(i);

    return marks;
}

function overlapResult(row: number[], maxLength: number): boolean[] {
    const fullRow: boolean[] = new Array(maxLength).fill(null);

    const ranges = groupRanges(row, maxLength);

    ranges.forEach(({ group, range }) => {
        const marks = overlapGroup(group, range);

        for (const id of marks) fullRow[id] = true;
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

function whoIBelongTo(cellID: number, ranges: { group: number; range: number[] }[]) {
    return ranges.filter(({ range: r }) => cellID >= r[0] && cellID < r[1]);
}

function calcTrueRange(group: number, pos: number, availableRange: number[]) {
    const trueRange = [
        Math.max(pos - group, availableRange[0]),
        Math.min(pos + group, availableRange[1]),
    ];

    return trueRange;
}

function calcOverlapMarks(group: number, pos: number, availableRange: number[]) {
    const trueRange = calcTrueRange(group, pos, availableRange);

    return overlapGroup(group, trueRange);
}

function pushToLast(arr: number[], val: number) {
    const findVal = arr.findIndex((v) => v === val);
    if (findVal >= 0) arr.splice(findVal, 1);
    arr.push(val);
}

function fillRow(
    resolution: boolean[][],
    rows: number[][],
    columns: number[][],
    changedRows: number[],
    changedColumns: number[]
) {
    if (changedRows.length === 0) return;

    const rowID = changedRows.shift() as number;
    const row = getResolutionRow(rowID, resolution);
    const rowCode = rows[rowID];
    const rowRanges = groupRanges(rowCode, columns.length);

    for (let j = 0; j < row.length; j++) {
        if (row[j] === null) continue;

        if (row[j] === true) {
            const belongs = whoIBelongTo(j, rowRanges);

            if (belongs.length > 1) continue;

            const marks = calcOverlapMarks(belongs[0].group, j, belongs[0].range);

            for (const id of marks) {
                const markResult = true;

                if (row[id] === markResult) continue;

                resolution[rowID][id] = markResult;

                pushToLast(changedRows, rowID);
                pushToLast(changedColumns, id);
            }
        }
    }
}

function fillColumn(
    resolution: boolean[][],
    rows: number[][],
    columns: number[][],
    changedRows: number[],
    changedColumns: number[]
) {
    if (changedColumns.length === 0) return;

    const columnID = changedColumns.shift() as number;
    const column = getResolutionColumn(columnID, resolution);
    const columnCode = columns[columnID];
    const columnRanges = groupRanges(columnCode, rows.length);

    for (let j = 0; j < column.length; j++) {
        if (column[j] === null) continue;

        if (column[j]) {
            const belongs = whoIBelongTo(j, columnRanges);

            if (belongs.length > 1) continue;

            const marks = calcOverlapMarks(belongs[0].group, j, belongs[0].range);

            for (const id of marks) {
                const markResult = true;

                if (column[id] === markResult) continue;

                resolution[id][columnID] = markResult;

                pushToLast(changedRows, id);
                pushToLast(changedColumns, columnID);
            }
        }
    }
}

function fillGeneral(
    resolution: boolean[][],
    rows: number[][],
    columns: number[][],
    changedRows: number[],
    changedColumns: number[]
) {
    while (changedRows.length > 0 || changedColumns.length > 0) {
        fillRow(resolution, rows, columns, changedRows, changedColumns);
        fillColumn(resolution, rows, columns, changedRows, changedColumns);
    }
}

function solver(level: nonData) {
    const { goal, height, width, rows, columns } = level;

    const resolution: boolean[][] = [];

    for (let i = 0; i < height; i++) resolution.push(new Array(width).fill(null));

    fillInitial(resolution, rows, columns);

    const changedRows: number[] = [];
    const changedColumns: number[] = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (resolution[i][j] === null) continue;

            pushToLast(changedRows, i);
            pushToLast(changedColumns, j);
        }
    }

    fillGeneral(resolution, rows, columns, changedRows, changedColumns);

    printer(resolution);

    // printer(goal);

    return resolution;
}

export default solver;
