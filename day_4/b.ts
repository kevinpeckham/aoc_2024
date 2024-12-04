// Day 4 - Part B

// utils
import { getData } from "./../utils";

const testData = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;
// STRATEGY
// iterate through A's and evaluate it's neighbors

// ASSUMPTIONS

// NOTE

// TYPES
interface Coordinate {
	x: number;
	y: number;
} // x is column, y is row
interface RelativePosition {
	x: "right" | "left" | "same";
	y: "above" | "below" | "same";
}

// FUNCTIONS FOR SOLVING DIAGONALS
function getRows(data: string): string[] {
	const regex = /^[^\n]+?$/gm;
	const matches = data.match(regex) ?? [];
	return matches;
}
function lookupCharacterAtCoordinate(
	rows: string[],
	coordinate: Coordinate
): string | null {
	const { x, y } = coordinate;
	if (!rows[y]) return null;
	if (!rows[y][x]) return null;
	return rows[y][x];
}
function lookupRelativeCoordinate(
	rows: string[],
	coordinate: Coordinate,
	relativePosition: RelativePosition
): { coordinate: Coordinate; character: string } | null {
	const { x, y } = coordinate;
	let newX = x;
	let newY = y;
	if (relativePosition.x === "right") newX++;
	if (relativePosition.x === "left") newX--;
	if (relativePosition.y === "above") newY--;
	if (relativePosition.y === "below") newY++;
	// [coordinate, value]
	const newCoordinate = { x: newX, y: newY };
	const value = lookupCharacterAtCoordinate(rows, newCoordinate);
	if (value === null) return null;
	return { coordinate: newCoordinate, character: value };
}
function aMatches(rows: string[], coordinate: Coordinate): boolean {
	const value = lookupCharacterAtCoordinate(rows, coordinate);

	const { x, y } = coordinate;
	// if x is in the first or last column, return false
	if (x === 0 || x === rows[0].length - 1) return false;
	// if y is in the first or last row, return false
	if (y === 0 || y === rows.length - 1) return false;

	// if value is not an A, return null
	if (value === null || value !== "A") return false;

	return true;
}
function strokeTlToBrMatches(rows: string[], coordinate: Coordinate): boolean {
	// evaluate center
	if (!aMatches(rows, coordinate)) return false;

	// lookup top left corner
	const topLeft = lookupRelativeCoordinate(rows, coordinate, {
		x: "left",
		y: "above",
	});
	if (topLeft === null) return false;
	if (topLeft.character !== "M" && topLeft.character !== "S") return false;

	// lookup bottom left corner
	const bottomRight = lookupRelativeCoordinate(rows, coordinate, {
		x: "right",
		y: "below",
	});
	if (bottomRight === null) return false;
	if (bottomRight.character !== "M" && bottomRight.character !== "S")
		return false;

	// if topRight and bottomLeft are the same, return false
	if (topLeft.character === bottomRight.character) return false;

	return true;
}
function strokeTrToBlMatches(rows: string[], coordinate: Coordinate): boolean {
	// evaluate center
	if (!aMatches(rows, coordinate)) return false;

	// lookup top right corner
	const topRight = lookupRelativeCoordinate(rows, coordinate, {
		x: "right",
		y: "above",
	});
	if (topRight === null) return false;
	if (topRight.character !== "M" && topRight.character !== "S") return false;

	// lookup bottom left
	const bottomLeft = lookupRelativeCoordinate(rows, coordinate, {
		x: "left",
		y: "below",
	});
	if (bottomLeft === null) return false;
	if (bottomLeft.character !== "M" && bottomLeft.character !== "S")
		return false;

	// if topLeft and bottomLeft are the same, return false
	if (bottomLeft.character === topRight.character) return false;

	return true;
}
function evaluateCoordinate(rows: string[], coordinate: Coordinate): boolean {
	return (
		strokeTrToBlMatches(rows, coordinate) &&
		strokeTlToBrMatches(rows, coordinate)
	);
}
function evaluateRow(rows: string[], y: number): number {
	const row = rows[y].split("");
	// use reduce to evaluate each character in the row and count the number of matches
	const count = row.reduce((acc, curr, i) => {
		const coordinate = { x: i, y };
		if (evaluateCoordinate(rows, coordinate)) {
			return acc + 1;
		}
		return acc;
	}, 0);

	// console.log(`row-${y}`, count);
	return count;
}
function evaluateAllRows(rows: string[]): number {
	const count = rows.reduce((acc, curr, i) => {
		return acc + evaluateRow(rows, i);
	}, 0);
	return count;
}

// const data = testData;
const data = await getData("./data.txt");
const rows = getRows(data);

console.log("evaluateAllRows", evaluateAllRows(rows));
// answer: 1835
