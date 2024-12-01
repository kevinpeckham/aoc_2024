console.log("Hello via Bun!");

const testData = `
3   4
4   3
2   5
1   3
3   9
3   3`;

import { arrayFromFirstColumn, arrayFromLastColumn, getData } from "./../utils";

// get data
// const data = testData;
const data = await getData("./day_1/data.txt");

// parse data into column a and b
// coerce strings to numbers in each array
// sort each array
const colA = arrayFromFirstColumn(data);
const colANumbers = colA?.map((x) => parseInt(x)) ?? [];
const colASorted = colANumbers?.sort((a, b) => a - b); // low to high

const colB = arrayFromLastColumn(data);
const colBNumbers = colB?.map((x) => parseInt(x)) ?? [];
const colBSorted = colBNumbers?.sort((a, b) => a - b); // low to high

// combine two columns into a single array of a,b pairs
const sortedPairs = colASorted.map((a, i) => [a, colBSorted[i]]);

//array of differences
const differences = sortedPairs.map(([a, b]) => Math.abs(a - b));

console.log(
	"SUM",
	differences.reduce((acc, curr) => acc + curr, 0)
);
// correct answer: 1830467
