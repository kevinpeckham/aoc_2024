console.log("Hello via Bun!");

const testData = `
3   4
4   3
2   5
1   3
3   9
3   3`;

import { arrayFromFirstColumn, arrayFromLastColumn, getData } from "../utils";

// get data
// const data = testData;
const data = await getData("./day_1/data.txt");

// parse data into column a and b
// coerce strings to numbers in each array
// sort each array
const colA = arrayFromFirstColumn(data);
const colANums = colA?.map((x) => parseInt(x)) ?? [];

const colB = arrayFromLastColumn(data);
const colBNums = colB?.map((x) => parseInt(x)) ?? [];
// array of pairs, where the first item is the col A numeric value
// and the second item is the number of times it appears in col B
const pairs = colANums.map((a) => [a, colBNums.filter((b) => b === a).length]);

// array of sums of each pair
const sums = pairs.map(([a, b]) => a * b);

// sum of all sums
const sum = sums.reduce((acc, curr) => acc + curr, 0);

console.log({ sum });
