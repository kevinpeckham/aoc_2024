// Day 7 - Part A

// utils
import { getData } from "./../utils";

// test data
const testData = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

// types and interfaces
interface Problem {
	integers: number[];
	solution: number;
}

// parse data into problems
function parseData(data: string): Problem[] {
	return data
		.trim()
		.split("\n")
		.map((line) => {
			const [solution, integers] = line.split(": ");
			return {
				integers: integers.split(" ").map(Number),
				solution: Number(solution),
			};
		});
}

function solveProblem(problem: Problem): number {
	const { integers, solution } = problem;

	// start with the sum and product of the first two integers
	let candidateSolutions = [
		integers[0] + integers[1],
		integers[0] * integers[1],
	];

	// then iterate through the rest of the integers
	for (let i = 2; i < integers.length; i++) {
		// deep copy of the current candidate solutions
		const currentCandidates = JSON.parse(JSON.stringify(candidateSolutions));
		const newCandidates = [];

		for (const candidate of currentCandidates) {
			// sum the solution candidate to the current integer
			const sum = candidate + integers[i];
			if (sum <= solution) {
				newCandidates.push(sum);
			}

			// multiply the solution candidate to the current integer
			const product = candidate * integers[i];
			if (product <= solution) {
				newCandidates.push(product);
			}
		}

		// replace the candidate solutions after processing all current candidates
		candidateSolutions = newCandidates;
	}

	// evaluate solutions after all combinations have been considered
	return candidateSolutions.includes(solution) ? solution : 0;
}

function solveProblems(data: string): number {
	// parse data into problems
	const problems = parseData(data);
	// return the sum of all solutions
	return problems.reduce((acc, problem) => acc + solveProblem(problem), 0);
}

// const data = testData.trim();
const data = await getData("./data.txt");
console.log(solveProblems(data)); // 1545311493300
