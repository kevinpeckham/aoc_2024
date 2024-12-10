// Day 10

const testData = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

// import functions
import {
	findCharacterInGridMap,
	findRelativeCoordKey,
	getData,
	getGridMapFromData,
	lookupCharAtCoordKey,
} from "../utils";

// import types
import type { CardinalDirection, CoordKey, GridMap } from "../types";

interface Status {
	deadEnds: Set<CoordKey>; // set of strings
	visited: Set<CoordKey>; // set of strings
	currentCoordKey: CoordKey; // string
	currentChar: string;
}

// find path from summit to trailhead
function findPathFromSummitToTrailhead(
	grid: GridMap,
	status: Status,
	gridHeight: number,
	gridWidth: number,
	targetCoordKey: CoordKey,
	visited: Set<string>,
	deadEnds: Set<string>
): boolean {
	const currentValue = parseInt(status.currentChar);

	// check if current value is a number
	if (isNaN(currentValue)) {
		console.error("Invalid current value:", status.currentChar);
		return false;
	}

	// check if at trailhead
	if (currentValue === 0 && targetCoordKey === status.currentCoordKey) {
		return true;
	}

	const targetChar = (currentValue - 1).toString();
	const directions: CardinalDirection[] = ["N", "E", "S", "W"];

	for (const direction of directions) {
		const nextCoordKey = findRelativeCoordKey(
			status.currentCoordKey,
			direction,
			1,
			gridHeight,
			gridWidth
		);

		if (!nextCoordKey) continue;
		if (visited.has(nextCoordKey)) continue;
		if (deadEnds.has(nextCoordKey)) continue;

		const nextChar = lookupCharAtCoordKey(grid, nextCoordKey);
		if (nextChar !== targetChar) continue;
		if (targetChar === "0" && nextCoordKey !== targetCoordKey) continue;

		// add to visited set
		visited.add(nextCoordKey);

		// create new status with fresh sets
		const newStatus: Status = {
			deadEnds: new Set(deadEnds),
			visited: new Set(visited),
			currentCoordKey: nextCoordKey,
			currentChar: targetChar,
		};

		if (
			findPathFromSummitToTrailhead(
				grid,
				newStatus,
				gridHeight,
				gridWidth,
				targetCoordKey,
				visited,
				deadEnds
			)
		) {
			return true;
		}

		// remove from visited set when backtracking
		visited.delete(nextCoordKey);
	}

	deadEnds.add(status.currentCoordKey);
	return false;
}

// count paths to trailhead
function countPathsToTrailHead(gridMap: GridMap, trailHead: CoordKey): number {
	// get grid dimensions
	const gridHeight = parseInt(gridMap.get("height") ?? "0");
	const gridWidth = parseInt(gridMap.get("width") ?? "0");
	if (gridHeight === 0 || gridWidth === 0) {
		throw new Error("Invalid grid dimensions");
	}

	// find all summits
	const summits = findCharacterInGridMap("9", gridMap);
	let totalPaths = 0;

	// create new sets for each attempt
	for (const summit of summits) {
		const visited = new Set<string>([summit]);
		const deadEnds = new Set<string>();

		const startingStatus: Status = {
			currentCoordKey: summit,
			currentChar: "9",
			deadEnds: new Set(),
			visited: new Set(summit),
		};

		// Increment counter if a valid path is found
		if (
			findPathFromSummitToTrailhead(
				gridMap,
				startingStatus,
				gridHeight,
				gridWidth,
				trailHead,
				visited,
				deadEnds
			)
		) {
			totalPaths++;
		}
	}

	return totalPaths;
}

// score all trailheads
function scoreAllTrailheads(data: string): number {
	const gridMap = getGridMapFromData(data);

	// find all trailheads
	const trailheads = findCharacterInGridMap("0", gridMap);

	let total = 0;
	trailheads.forEach((trailhead) => {
		total += countPathsToTrailHead(gridMap, trailhead);
	});

	return total;
}

// const data = testData;
const data = await getData("./data.txt");
console.log(scoreAllTrailheads(data)); // 496
