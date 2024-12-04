// Day 4 - Part A

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
// horizontal matches should equal 5
// vertical matches should equal 3
// diagonal matches tl to br should equal 5
// diagonal matches bl to tr should equal 5
// total matches should equal 18

// ASSUMPTIONS
// !! all rows are the same length

// NOTE
// !! TRICKY TEST CASE
// !! "XMAS" and "SAMX" could overlap
const testString = "MXSAMXMASX";

// TYPES
interface Coordinate {
	x: number;
	y: number;
} // x is column, y is row
interface RelativePosition {
	x: "right" | "left" | "same";
	y: "above" | "below" | "same";
}

// FINDER FUNCTIONS
// because "XMAS" and "SAMX" could overlap find them separately
function findForward(data: string): number {
	const regex = /XMAS/g;
	const matches = data.match(regex);
	return matches ? matches.length : 0;
}
function findBackward(data: string): number {
	const regex = /SAMX/g;
	const matches = data.match(regex);
	return matches ? matches.length : 0;
}
// find all matches in string
function findAllMatchesInString(data: string): number {
	const forward = findForward(data);
	const backward = findBackward(data);
	return forward + backward;
}

// FUNCTIONS FOR SOLVING VERTICAL MATCHES
function getRowLength(data: string, rowIndex?: number | null): number {
	const regex = /^[^\n]+?$/gm;
	const matches = data.match(regex) ?? [];
	return matches[rowIndex ?? 0].length;
}
// function to transpose first column to string
function getFirstColumnAsString(data: string): string {
	const regex = /^[^\n]/gm;
	const matches2 = data.match(regex);
	return matches2 ? matches2.join("") : "";
}
// function to remove first column from data
function removeFirstCharacterInEachRow(data: string): string {
	const regex = /^./gm;
	return data.replace(regex, "");
}
function findVerticalMatches(data: string): number {
	// number of columns equals length of first row
	const columnCount = getRowLength(data);

	// iterate through each column
	// finding and counting matches and removing first column
	// until no columns remain
	let d = data;
	let count = 0;
	for (let i = 0; i < columnCount; i++) {
		const column = getFirstColumnAsString(d);
		count += findAllMatchesInString(column);
		d = removeFirstCharacterInEachRow(d);
	}
	return count;
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
function getDiagonal(
	rows: string[],
	startingCoordinate: Coordinate,
	direction: RelativePosition
): string {
	// lookup starting coordinate
	const startingCharacter = lookupCharacterAtCoordinate(
		rows,
		startingCoordinate
	);

	// if starting coordinate has no character
	if (startingCharacter === null) return "";

	// diagonal string begins with current character
	let diagonal = startingCharacter;
	let current = startingCoordinate;
	while (lookupRelativeCoordinate(rows, current, direction) !== null) {
		const result = lookupRelativeCoordinate(rows, current, direction);
		if (!result) break;
		diagonal += result.character;
		current = result.coordinate;
	}
	return diagonal;
}
function getAllDiagonalsFromTopRightToBottomLeft(rows: string[]): string[] {
	const diagonals = [];
	const rowCount = rows.length;
	const columnCount = getRowLength(rows.join("\n"));

	// starting from last column and going left
	for (let i = 0; i < rowCount; i++) {
		const diagonal = getDiagonal(
			rows,
			{ x: columnCount - 1, y: i },
			{ x: "left", y: "below" }
		);
		// don't bother pushing to array if string is less than 4 characters
		// or if it doesn't include each letter "XMAS"
		if (
			diagonal.length > 3 &&
			diagonal.includes("X") &&
			diagonal.includes("M") &&
			diagonal.includes("A") &&
			diagonal.includes("S")
		) {
			diagonals.push(diagonal);
		}
	}
	// starting from first row and going down
	// !! don't include the last row because it was already included
	for (let i = 1; i < columnCount - 1; i++) {
		const diagonal = getDiagonal(
			rows,
			{ x: i, y: 0 },
			{ x: "left", y: "below" }
		);
		// don't bother pushing to array if string is less than 4 characters
		if (
			diagonal.length > 3 &&
			diagonal.includes("X") &&
			diagonal.includes("M") &&
			diagonal.includes("A") &&
			diagonal.includes("S")
		) {
			diagonals.push(diagonal);
		}
	}
	return diagonals;
}
function getAllDiagonalsFromTopLeftToBottomRight(rows: string[]): string[] {
	const diagonals = [];
	const rowCount = rows.length;
	const columnCount = getRowLength(rows.join("\n"));

	// starting from first column and going right
	for (let i = 0; i < rowCount; i++) {
		const diagonal = getDiagonal(
			rows,
			{ x: 0, y: i },
			{ x: "right", y: "below" }
		);
		// don't bother pushing to array if string is less than 4 characters
		// or if it doesn't include each letter "XMAS"
		if (
			diagonal.length > 3 &&
			diagonal.includes("X") &&
			diagonal.includes("M") &&
			diagonal.includes("A") &&
			diagonal.includes("S")
		) {
			diagonals.push(diagonal);
		}
	}
	// starting from first row and going down
	// !! don't include the last row because it was already included
	for (let i = 1; i < columnCount - 1; i++) {
		const diagonal = getDiagonal(
			rows,
			{ x: i, y: 0 },
			{ x: "right", y: "below" }
		);
		// don't bother pushing to array if string is less than 4 characters
		// or if it doesn't include each letter "XMAS"
		if (
			diagonal.length > 3 &&
			diagonal.includes("X") &&
			diagonal.includes("M") &&
			diagonal.includes("A") &&
			diagonal.includes("S")
		) {
			diagonals.push(diagonal);
		}
	}
	return diagonals;
}
function getAllDiagonals(rows: string[]): string[] {
	const diagonals = [];
	const diagonals1 = getAllDiagonalsFromTopLeftToBottomRight(rows);
	const diagonals2 = getAllDiagonalsFromTopRightToBottomLeft(rows);
	return diagonals1.concat(diagonals2);
}
function findAllDiagonalMatches(rows: string[]): number {
	const diagonals = getAllDiagonals(rows);
	let count = 0;
	for (const diagonal of diagonals) {
		count += findAllMatchesInString(diagonal);
	}
	return count;
}

// constants
// const data = testData;
const data = await getData("./data.txt");
const rows = getRows(data);

// find horizontal matches
const horizontalMatches = findAllMatchesInString(data);

// find vertical matches
const verticalMatches = findVerticalMatches(data);

// find diagonal matches
const diagonalMatches = findAllDiagonalMatches(rows);

// total matches
const totalMatches = horizontalMatches + verticalMatches + diagonalMatches;

console.log("horizontal matches", horizontalMatches);
console.log("vertical matches", verticalMatches);
console.log("diagonal matches", diagonalMatches);
console.log("total matches", totalMatches);

// answer candidate: 1609 : too low
// answer candidate: 2434
