// Day 10

// const testData = `
// 89010123
// 78121874
// 87430965
// 96549874
// 45678903
// 32019012
// 01329801
// 10456732`;

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

function findAllPathsFromSummitToTrailhead(
	grid: GridMap,
	status: Status,
	gridHeight: number,
	gridWidth: number,
	targetCoordKey: CoordKey,
	visited: Set<string>,
	deadEnds: Set<string>
): number {
	const currentValue = parseInt(status.currentChar);

	// validate current value
	if (isNaN(currentValue)) {
		console.error("Invalid current value:", status.currentChar);
		return 0;
	}

	// found a valid path to trailhead
	if (currentValue === 0 && targetCoordKey === status.currentCoordKey) {
		return 1;
	}

	const targetChar = (currentValue - 1).toString();
	const directions: CardinalDirection[] = ["N", "E", "S", "W"];
	let pathCount = 0;

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

		// Add to visited set for this path
		visited.add(nextCoordKey);

		// Create new status with fresh sets for this branch
		const newStatus: Status = {
			deadEnds: new Set(deadEnds),
			visited: new Set(visited),
			currentCoordKey: nextCoordKey,
			currentChar: targetChar,
		};

		// Accumulate paths found along this branch
		pathCount += findAllPathsFromSummitToTrailhead(
			grid,
			newStatus,
			gridHeight,
			gridWidth,
			targetCoordKey,
			visited,
			deadEnds
		);

		// remove from visited set when backtracking
		visited.delete(nextCoordKey);
	}

	// Only mark as dead end if no paths were found
	if (pathCount === 0) {
		deadEnds.add(status.currentCoordKey);
	}

	return pathCount;
}

// count all possible paths to trailhead
function countAllPathsToTrailHead(
	gridMap: GridMap,
	trailHead: CoordKey
): number {
	// get grid dimensions
	const gridHeight = parseInt(gridMap.get("height") ?? "0");
	const gridWidth = parseInt(gridMap.get("width") ?? "0");
	if (gridHeight === 0 || gridWidth === 0) {
		throw new Error("Invalid grid dimensions");
	}

	// find all summits
	const summits = findCharacterInGridMap("9", gridMap);
	let totalPaths = 0;

	// count paths from each summit
	for (const summit of summits) {
		const visited = new Set<string>([summit]);
		const deadEnds = new Set<string>();

		const startingStatus: Status = {
			currentCoordKey: summit,
			currentChar: "9",
			deadEnds: new Set(),
			visited: new Set([summit]),
		};

		// add all paths found from this summit
		totalPaths += findAllPathsFromSummitToTrailhead(
			gridMap,
			startingStatus,
			gridHeight,
			gridWidth,
			trailHead,
			visited,
			deadEnds
		);
	}

	return totalPaths;
}

// score all trailheads by counting all possible paths to them
function scoreAllTrailheads(data: string): number {
	const gridMap = getGridMapFromData(data);
	const trailheads = findCharacterInGridMap("0", gridMap);

	let total = 0;
	trailheads.forEach((trailhead) => {
		total += countAllPathsToTrailHead(gridMap, trailhead);
	});

	return total;
}

// const data = testData;
const data = await getData("./data.txt");
console.log(scoreAllTrailheads(data)); // 1120
