// Day 6 - Part A

// utils
import { getData } from "./../utils";

const testData = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

// types
type Direction = "N" | "E" | "S" | "W";
type Grid = string[][];
interface Coordinate {
	x: number;
	y: number;
}
interface GuardStatus {
	coordinate: Coordinate;
	direction: Direction;
	isBlocked: boolean;
	isOnBoard: boolean;
	squaresVisited: Coordinate[];
	uniqueSquaresVisitedCount: number;
	playsCompleted: number;
}

// parse the data into a grid
function getGrid(data: string): Grid {
	// Check for empty input
	if (!data || !data.trim()) {
		throw new Error("Input data is empty");
	}

	const regex = /^[^\n]+?$/gm;
	const matches = data.match(regex) ?? [];

	// Check if any rows were found
	if (matches.length === 0) {
		throw new Error("No valid rows found in input data");
	}

	// Check row lengths are consistent
	const rowLength = matches?.[0]?.length ?? 0;
	const hasInconsistentRows = matches.some((row) => row.length !== rowLength);
	if (hasInconsistentRows) {
		throw new Error("Input data has inconsistent row lengths");
	}

	// Check for invalid characters (optional)
	const validChars = new Set([".", "#", "^"]);
	const hasInvalidChars = matches.some((row) =>
		[...row].some((char) => !validChars.has(char))
	);
	if (hasInvalidChars) {
		throw new Error("Input data contains invalid characters");
	}

	return matches.map((row) => row.split(""));
}

// helper function to evaluate character at a given coordinate
function lookupCharAtCoord(grid: Grid, coordinate: Coordinate): string | null {
	const { x, y } = coordinate;
	if (x < 0 || y < 0) return null;
	if (!grid[y]) return null;
	if (!grid[y][x]) return null;
	return grid[y][x];
}

// helper function to determine if a guard is blocked at their current position
function isBlocked(grid: Grid, currentStatus: GuardStatus): boolean {
	const { coordinate, direction } = currentStatus;
	const newCoordinate = { ...coordinate };
	if (direction === "N") newCoordinate.y--;
	if (direction === "E") newCoordinate.x++;
	if (direction === "S") newCoordinate.y++;
	if (direction === "W") newCoordinate.x--;
	const facingCharacter = lookupCharAtCoord(grid, newCoordinate);
	if (facingCharacter === "#") return true;
	return false;
}

// helper function to determine the new direction after a turn
function getNewDirectionForGuard(currentDirection: Direction): Direction {
	const directionMap: { [key in Direction]: Direction } = {
		N: "E",
		E: "S",
		S: "W",
		W: "N",
	};
	return directionMap[currentDirection];
}

// helper function to turn a guard 90 deg to the right and return the new status
function turnGuard(grid: Grid, currentStatus: GuardStatus): GuardStatus {
	const newStatus: GuardStatus = { ...currentStatus };
	newStatus.direction = getNewDirectionForGuard(currentStatus.direction);

	// check if new direction is blocked
	newStatus.isBlocked = isBlocked(grid, newStatus);

	// update moves completed
	newStatus.playsCompleted++;

	// return new status
	return newStatus;
}

// helper function to move a guard by one square
function moveGuard(currentStatus: GuardStatus): Coordinate {
	const direction = currentStatus.direction;
	const coordinate = { ...currentStatus.coordinate };
	if (direction === "N") coordinate.y--;
	if (direction === "E") coordinate.x++;
	if (direction === "S") coordinate.y++;
	if (direction === "W") coordinate.x--;
	return coordinate;
}

// execute a play for a guard:  either a turn or a move
function makePlay(grid: Grid, currentStatus: GuardStatus): GuardStatus {
	// if blocked, turn
	if (currentStatus.isBlocked) {
		return turnGuard(grid, currentStatus);
	}

	// if not blocked, move
	else {
		const newStatus: GuardStatus = { ...currentStatus };

		// update coordinate
		const newCoord = moveGuard(currentStatus);
		newStatus.coordinate = newCoord;

		// update direction
		// note: direction is not updated when moving

		// update isBlocked
		newStatus.isBlocked = isBlocked(grid, newStatus);

		// update isOnBoard
		newStatus.isOnBoard = lookupCharAtCoord(grid, newCoord) !== null;

		// update squaresVisited -- only update if still on board
		if (newStatus.isOnBoard) {
			newStatus.squaresVisited = [...currentStatus.squaresVisited, newCoord];
		}

		// update uniqueSquaresVisitedCount -- only update if still on board
		if (newStatus.isOnBoard) {
			const uniqueCoords = new Set(
				[...currentStatus.squaresVisited, newCoord].map(
					(coord) => `${coord.x},${coord.y}`
				)
			);
			newStatus.uniqueSquaresVisitedCount = uniqueCoords.size;
		}

		// update playsCompleted
		newStatus.playsCompleted++;

		return newStatus;
	}
}

// execute all plays
function executeAllPlays(grid: Grid, startingStatus: GuardStatus): GuardStatus {
	let currentStatus = { ...startingStatus };
	while (currentStatus.isOnBoard) {
		currentStatus = makePlay(grid, currentStatus);
	}
	return currentStatus;
}

// useful for looking up starting position
function findCharacter(grid: Grid, character: string): Coordinate | null {
	for (let y = 0; y < grid.length; y++) {
		const row = grid[y];
		for (let x = 0; x < row.length; x++) {
			if (row[x] === character) return { x, y };
		}
	}
	return null;
}
function getGuardStartingStatus(grid: Grid): GuardStatus {
	const startingCoord = findCharacter(grid, "^");
	if (startingCoord === null) {
		throw new Error("Guard not found");
	}
	return {
		coordinate: startingCoord,
		direction: "N",
		isBlocked: false, // assume not blocked for first turn
		isOnBoard: true,
		squaresVisited: [startingCoord],
		uniqueSquaresVisitedCount: 1,
		playsCompleted: 0,
	};
}

// const data = testData.trim();
const data = await getData("./data.txt");
const grid = getGrid(data);
const startingStatus = getGuardStartingStatus(grid);
const finalStatus = executeAllPlays(grid, startingStatus);
console.log("uniqueSquaresVisited", finalStatus.uniqueSquaresVisitedCount);
