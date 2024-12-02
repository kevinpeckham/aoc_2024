import { getData } from "../utils";

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

// helper function to determine if the interval between two numbers is safe
function isSafeInterval(n1: number, n2: number): boolean {
	const difference = Math.abs(n1 - n2);
	return difference >= 1 && difference <= 3;
}

// helper function to determine direction of the interval (rising or falling)
function intervalDirection(n1: number, n2: number): Direction {
	return n1 < n2 ? "increasing" : "decreasing";
}

function evaluatePairInArray(array: number[], index: number): EvaluatedPair {
	const current = array[index]; // current value
	const p1 = index > 0 ? array[index - 1] : null; // previous
	const p2 = index > 1 ? array[index - 2] : null; // previous previous

	// determine the direction of the array based on the previous two values
	const arrayDirection =
		p1 !== null && p2 !== null ? intervalDirection(p2, p1) : "unknown";

	// determine the direction of the current interval
	const currentDirection =
		p1 !== null ? intervalDirection(p1, current) : "unknown";

	// determine if the current interval is safe
	const currentInterval = (p1 !== null ? isSafeInterval(p1, current) : true)
		? "safe"
		: "unsafe";

	// determine the status of the current interval
	const currentStatus =
		currentInterval === "safe" &&
		(currentDirection === arrayDirection || arrayDirection === "unknown")
			? "safe"
			: "unsafe";

	return {
		currentStatus,
	};
}

interface EvaluatedPair {
	currentStatus: Status;
}

function createEvaluationsSet(set: number[]) {
	let index = 0;
	const evaluations: EvaluatedPair[] = [];
	for (const number of set) {
		const evaluatedPair = evaluatePairInArray(set, index);
		index = index + 1;
		evaluations.push(evaluatedPair);
	}
	return evaluations;
}

function evaluateSet(set: number[]) {
	// if the set is has only one or two numbers, it is safe
	if (set.length === 1 || set.length === 2) {
		return "safe";
	}

	const evaluations = createEvaluationsSet(set);

	// get all evaluations where the current status is unsafe
	const allUnsafe = evaluations.filter(
		({ currentStatus }) => currentStatus === "unsafe"
	);

	// if there are no unsafe, return safe
	if (allUnsafe.length === 0) {
		return "safe";
	}

	// iterate through the evaluations, try replacing them and see if the set becomes safe
	for (let i = 0; i < evaluations.length; i++) {
		// create new set with number removed
		const newSet = set.filter((_, index) => index !== i);
		// create a new set of evaluations
		const newEvaluationsSet = createEvaluationsSet(newSet);
		// find all evaluations where the current status is unsafe
		const unsafe = newEvaluationsSet.filter(
			({ currentStatus }) => currentStatus === "unsafe"
		);
		// console.log({ unsafe });
		if (unsafe.length === 0) {
			return "safe";
		}
	}

	// if none of the evaluations can be replaced to make the set safe, return unsafe
	return "unsafe";
}

// evaluate each set of numbers
const evaluatedSets = numberSets.map(evaluateSet);

// count safe sets
const safeSets = evaluatedSets.filter((set) => set === "safe").length;

console.log(safeSets);
// answer candidate: 324: correct
