import factorial from "./factorial";

export function totalCombinations(row: number[], maxLength: number) {
    const blockGroups = row.length;
    const usedBlocks = row.reduce((sum, val) => sum + val, row.length - 1);
    const emptyBlocks = maxLength - usedBlocks;
    const totalBlocks = blockGroups + emptyBlocks;

    const totalFact = factorial(totalBlocks);
    const groupsFact = factorial(blockGroups);
    const repeatingFact = factorial(totalBlocks - blockGroups);

    const combinations = totalFact / (groupsFact * repeatingFact);

    return Math.round(combinations);
}

function combinations(arr: number[], k: number): number[][] {
    if (k === 0) {
        return [[]];
    }

    if (arr.length === 0) {
        return [];
    }

    const [first, ...rest] = arr;

    const withoutFirst = combinations(rest, k);
    const withFirst = combinations(rest, k - 1).map((comb) => [first, ...comb]);

    return [...withoutFirst, ...withFirst];
}

function fillFullRow(row: number[], combs: number[][], maxLength: number): boolean[][] {
    const fullRow = combs.map((comb) => {
        const fullCombRow: boolean[] = new Array(maxLength).fill(false);

        comb.forEach((place, i) => {
            const position = row.slice(0, i).reduce((sum, val) => sum + val, place);

            const fillSequence: boolean[] = new Array(row[i]).fill(true);

            fullCombRow.splice(position, fillSequence.length, ...fillSequence);
        });

        return fullCombRow;
    });

    return fullRow;
}

export function nonoCombinations(row: number[], maxLength: number): boolean[][] {
    const blockGroups = row.length;
    const totalBlocks = row.reduce((sum, val) => sum + val, row.length - 1);
    const emptyBlocks = maxLength - totalBlocks;

    const groupElements = Array.from({ length: blockGroups + emptyBlocks }, (_, i) => i);

    const combs = combinations(groupElements, blockGroups);

    const rowCombs = fillFullRow(row, combs, maxLength);

    return rowCombs;
}
