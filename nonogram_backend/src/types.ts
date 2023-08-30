export type nonFile = {
    filepath: string;
    title: string;
    author: string;
    copyright: string;
    license: string;
    height: number;
    width: number;
};

export type nonData = {
    title: string;
    height: number;
    width: number;
    rows: number[][];
    columns: number[][];
    goal: boolean[][];
};
