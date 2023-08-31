function factorial(num: number): number {
    if (num < 0) throw "Factorial number must be positive integer";

    if (num <= 1) return 1;

    return num * factorial(num - 1);
}

export default factorial;
