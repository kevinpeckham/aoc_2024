// Day 6 - Part A

// utils
import { getData } from "../utils";

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
interface Coordinate {
	x: number;
	y: number;
}

interface GridDimensions {
	width: number;
	height: number;
}

type Direction = "N" | "E" | "S" | "W";
type Axis = "horizontal" | "vertical";
type Grid = string[][];

interface Situation {
	guard: Coordinate;
	obstacle: Coordinate;
}

interface GuardStatus {
	coordinate: Coordinate;
	direction: Direction;
	positionsEncountered: string[];
}

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
function getRows(grid: Grid): string[] {
	// get row data from grid data
	const rows = grid.map((row) => row.join(""));
	return rows;
}
function getColumns(rows: string[]): string[] {
	const columns: string[] = [];
	for (let i = 0; i < rows[0].length; i++) {
		let column = "";
		for (let j = 0; j < rows.length; j++) {
			column += rows[j][i];
		}
		columns.push(column);
	}
	return columns;
}
function getGridDimensions(grid: Grid): GridDimensions {
	return {
		width: grid[0].length,
		height: grid.length,
	};
}

// helper function to determine the new direction after a turn
function getNewDirection(currentDirection: Direction): Direction {
	const directionMap: { [key in Direction]: Direction } = {
		N: "E",
		E: "S",
		S: "W",
		W: "N",
	};
	return directionMap[currentDirection];
}

// useful for looking up starting position
function findStartingCoord(grid: Grid, character: string): Coordinate | null {
	for (let y = 0; y < grid.length; y++) {
		const row = grid[y];
		for (let x = 0; x < row.length; x++) {
			if (row[x] === character) return { x, y };
		}
	}
	return null;
}
function getStartingStatus(grid: Grid): GuardStatus | null {
	const coord = findStartingCoord(grid, "^");
	if (coord === null) return null;
	return {
		coordinate: coord,
		direction: "W", // !! we turn this counter-clockwise so we can apply the first turn here
		positionsEncountered: [],
	};
}

function getAxisForDirection(direction: Direction) {
	return direction === "N" || direction === "S" ? "vertical" : "horizontal";
}

function findNearestObstacle(
	rows: string[],
	columns: string[],
	coord: Coordinate,
	direction: Direction,
	dimensions: GridDimensions
): Situation | null {
	const isVertical = getAxisForDirection(direction) === "vertical";
	const line = isVertical ? columns[coord.x] : rows[coord.y];
	const position = isVertical ? coord.y : coord.x;
	const length = isVertical ? dimensions.height : dimensions.width;

	// Determine search direction and bounds
	const isForward = direction === "E" || direction === "S";
	const start = isForward ? position + 1 : position - 1;
	const end = isForward ? length : -1;
	const step = isForward ? 1 : -1;

	for (let i = start; i !== end; i += step) {
		if (line[i] === "#") {
			// return both the obstacle and the guard's new position
			return isVertical
				? { obstacle: { x: coord.x, y: i }, guard: { x: coord.x, y: i - step } }
				: {
						obstacle: { x: i, y: coord.y },
						guard: { x: i - step, y: coord.y },
				  };
		}
	}

	return null;
}

function getPosition(coord: Coordinate, direction: Direction) {
	return `${coord.x},${coord.y},${direction}`;
}

function goToObstacleToTheRight(
	rows: string[],
	columns: string[],
	dimensions: GridDimensions,
	currentStatus?: GuardStatus | null
): GuardStatus | null {
	// if no starting status is provided, return null
	if (!currentStatus) return null;

	// get new direction
	const newDirection = getNewDirection(currentStatus.direction);

	// find nearest obstacle in new direction
	const nearestObstacle = findNearestObstacle(
		// newDirection === "E" || newDirection === "W" ? rows : columns,
		rows,
		columns,
		currentStatus.coordinate,
		newDirection,
		dimensions
	);

	// if no obstacle is found, return null
	if (!nearestObstacle) return null;

	// if an obstacle is found, move to the spot just before the obstacle
	// and update status
	const newStatus = {
		coordinate: nearestObstacle.guard,
		direction: newDirection,
		positionsEncountered: [
			...currentStatus.positionsEncountered,
			getPosition(nearestObstacle.guard, newDirection),
		],
	};

	return newStatus;
}

// function to move character completely through the board
function moveCharacterThroughBoard(
	rows: string[],
	columns: string[],
	dimensions: GridDimensions,
	startingStatus: GuardStatus | null
): string {
	// if no starting status is provided, return "no starting position found"
	if (startingStatus === null) return "no starting position found";

	// create a new status object to keep track of the guard's position
	let newStatus = { ...startingStatus };
	let moves = 0;

	// iterate through the board
	while (true) {
		const status = goToObstacleToTheRight(rows, columns, dimensions, newStatus);
		if (status === null) {
			return "off";
		} else {
			// analyze the positionsEncountered array
			// if the any position appears in the positionsEncountered array more than once, return "loop"
			const latestPosition =
				status.positionsEncountered[status.positionsEncountered.length - 1];
			// count how many times the latest position appears in the array
			const count = status.positionsEncountered.filter(
				(position) => position === latestPosition
			).length;

			if (count > 1) {
				return "loop";
			}
			newStatus = status;
		}
		moves++;
		if (moves > 1000) {
			return "too many iterations";
		}
	}
}

// function to add obstacles to the board
function addObstacle(grid: Grid, obstacle: Coordinate): Grid {
	const newGrid = [...grid];
	newGrid[obstacle.y][obstacle.x] = "#";
	return newGrid;
}

// iterate through all the positions on the board that have a "." character
// for each position, add an obstacle, then move the character through the board
// and count the loop results
// add up the total number of loops
function countPossibleLoops(data: string): number {
	const grid = getGrid(data);
	const dimensions = getGridDimensions(grid);
	const startingStatus = getStartingStatus(grid);

	let loops = 0;
	for (let y = 0; y < dimensions.height; y++) {
		for (let x = 0; x < dimensions.width; x++) {
			if (grid[y][x] === ".") {
				console.log("obstacle at", x, y);
				const updatedGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
				const newGrid = addObstacle(updatedGrid, { x, y });
				const rows = getRows(updatedGrid);
				const columns = getColumns(rows);
				const result = moveCharacterThroughBoard(
					rows,
					columns,
					dimensions,
					startingStatus
				);

				if (result === "loop") {
					console.log("loop");
					loops++;
				}
			}
		}
	}
	return loops;
}

// const data = testData.trim();
const data = await getData("./data.txt");

console.log(countPossibleLoops(data));
// answer: 1443 -- correct
