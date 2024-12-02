import { arrayFromFirstColumn, arrayFromLastColumn, getData } from "./../utils";

const testData = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

// get data
const data = await getData("./day_2/data.txt");

// break into data sets by row
const dataSets = data.split("\n");

// coerce each data set into an array of numbers
const numberSets = dataSets.map((dataSet) =>
	dataSet.split(" ").map((x) => parseInt(x))
);

type Direction = "increasing" | "decreasing" | "unknown";
type Status = "safe" | "unsafe"; // status of set so far
type Acc = [number, Direction, Status];

// helper function to determine if the interval between two numbers is safe
function isSafeInterval(n1: number, n2: number): boolean {
	const difference = Math.abs(n1 - n2);
	return difference >= 1 && difference <= 3;
}

// helper function to determine direction of the interval (rising or falling)
function intervalDirection(n1: number, n2: number): Direction {
	return n1 < n2 ? "increasing" : "decreasing";
}

function evaluatePair(acc: Acc, curr: number): Acc {
	const difference = curr - acc[0];
	const absoluteDifference = Math.abs(curr - acc[0]);
	// if the set is already unsafe, return unsafe
	if (acc[2] === "unsafe") {
		return [-1, "unknown", "unsafe"];
	}
	// else if curr === -1 return, return [curr, unknown, safe]
	// e.g. first number in set
	else if (acc[0] === -1) {
		return [curr, "unknown", "safe"];
	}
	// else if direction is "unknown" but interval is safe
	// e.g. second number in set
	else if (acc[1] === "unknown" && isSafeInterval(acc[0], curr)) {
		const direction = intervalDirection(acc[0], curr);
		return [curr, direction, "safe"];
	}
	// else if interval is safe and direction is known {
	else if (isSafeInterval(acc[0], curr)) {
		// if direction is the same as previous, return curr
		if (intervalDirection(acc[0], curr) === acc[1]) {
			return [curr, acc[1], "safe"];
		} else {
			return [-1, "unknown", "unsafe"];
		}
	}
	// else interval must be unsafe
	else {
		return [-1, "unknown", "unsafe"];
	}
}

function evaluateSet(set: number[]): "safe" | "unsafe" {
	// reduce the set of numbers to a single value
	// where the first item is the previous number
	// the second item is the direction of the interval
	// the third item is the status of the set
	const evaluated = set.reduce(
		(acc, curr) => {
			return evaluatePair(acc, curr);
		},
		[-1, "unknown", "safe"] as Acc
	);

	return evaluated[2] === "safe" ? "safe" : "unsafe";
}

// evaluate each set of numbers
const evaluatedSets = numberSets.map(evaluateSet);

// count safe sets
const safeSets = evaluatedSets.filter((set) => set === "safe").length;

console.log({ safeSets });
// answer: 252
