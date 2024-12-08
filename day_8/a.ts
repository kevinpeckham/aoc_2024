// utils
import { getData, getGrid, getGridDimensions } from "./../utils";

// test data
export const testData = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

export interface Coordinate {
	x: number;
	y: number;
}
export type Line = Coordinate[];
export type CoordinatePair = [Coordinate, Coordinate];

export interface GridDimensions {
	width: number;
	height: number;
}
export interface Result {
	distance: number; // The base distance 'd'
	indexes: number[]; // Indexes that satisfy the distance criteria
}
export function normalizeZero(value: number): number {
	return value === 0 ? 0 : value;
}
// find all unique characters in grid
export function findAllUniqueCharacters(grid: string[][]): string[] {
	const characters: string[] = [];
	grid.forEach((row) => {
		row.forEach((character) => {
			if (!characters.includes(character) && character !== ".") {
				characters.push(character);
			}
		});
	});
	return characters;
}

// find all coordinates of a specific character in grid
export function findAllCharacterCoordinates(
	character: string,
	grid: string[][]
): Coordinate[] {
	const coordinates: Coordinate[] = [];
	grid.forEach((row, y) => {
		row.forEach((actual, x) => {
			if (actual === character) {
				coordinates.push({ x, y });
			}
		});
	});
	return coordinates;
}

// find all unique pairs of coordinates from array of coordinates
export function findAllUniqueCoordinatePairs(
	coordinates: Coordinate[]
): CoordinatePair[] {
	const pairs: CoordinatePair[] = [];

	// Only iterate through necessary combinations
	// We use i < j to ensure we don't create duplicate pairs
	for (let i = 0; i < coordinates.length - 1; i++) {
		for (let j = i + 1; j < coordinates.length; j++) {
			pairs.push([coordinates[i], coordinates[j]]);
		}
	}
	return pairs;
}

// find all points with integer coordinates that lie exactly on a line between two points
// and extend to grid edges
export function findExtendedLinePoints(
	p1: Coordinate,
	p2: Coordinate,
	dimensions: GridDimensions
): Coordinate[] {
	// Handle vertical lines
	if (p1.x === p2.x) {
		const points: Coordinate[] = [];
		const x = p1.x;
		if (x >= 0 && x < dimensions.width) {
			for (let y = 0; y < dimensions.height; y++) {
				points.push({ x, y });
			}
		}
		return points;
	}

	// Handle horizontal lines
	if (p1.y === p2.y) {
		const points: Coordinate[] = [];
		const y = p1.y;
		if (y >= 0 && y < dimensions.height) {
			for (let x = 0; x < dimensions.width; x++) {
				points.push({ x, y });
			}
		}
		return points;
	}

	const points: Coordinate[] = [];
	const slope = (p2.y - p1.y) / (p2.x - p1.x);
	const yIntercept = p1.y - slope * p1.x;

	// For diagonal lines, we need to find all grid points that the line passes through
	for (let x = 0; x < dimensions.width; x++) {
		const y = slope * x + yIntercept;
		// We need to handle floating point precision issues
		const roundedY = Math.round(y * 1000000) / 1000000;
		if (
			Number.isInteger(roundedY) &&
			roundedY >= 0 &&
			roundedY < dimensions.height
		) {
			points.push({ x, y: roundedY });
		}
	}

	// Remove duplicates and sort
	const uniquePoints = points.filter(
		(point, index, self) =>
			index === self.findIndex((p) => p.x === point.x && p.y === point.y)
	);

	// console.log("Debug info:");
	// console.log("Input points:", p1, p2);
	// console.log("Slope:", slope);
	// console.log("Y-intercept:", yIntercept);
	// console.log("Generated points:", uniquePoints);

	return uniquePoints.sort((a, b) => a.x - b.x);
}
// find all unique extended lines between two points
export function findUniqueExtendedLinesFromCoordinatePairs(
	pairs: CoordinatePair[],
	dimensions: GridDimensions
): Line[] {
	const uniqueLines: Line[] = [];

	// Helper function to check if two coordinates are equal
	const areCoordinatesEqual = (c1: Coordinate, c2: Coordinate): boolean => {
		return c1.x === c2.x && c1.y === c2.y;
	};

	// Helper function to check if a line contains a coordinate
	const lineContainsCoordinate = (line: Line, coord: Coordinate): boolean => {
		return line.some((lineCoord) => areCoordinatesEqual(lineCoord, coord));
	};

	// Helper function to check if two lines are the same (regardless of point order)
	const areLinesEqual = (line1: Line, line2: Line): boolean => {
		// Check if both endpoints of line2 exist in line1
		return (
			lineContainsCoordinate(line1, line2[0]) &&
			lineContainsCoordinate(line1, line2[1])
		);
	};

	pairs.forEach((pair) => {
		const line: Line = findExtendedLinePoints(pair[0], pair[1], dimensions);

		// if uniqueLines is empty, add line to uniqueLines
		if (uniqueLines.length === 0) {
			uniqueLines.push(line);
			return;
		}

		const isDuplicate = uniqueLines.some((uniqueLine) =>
			areLinesEqual(uniqueLine, line)
		);

		if (!isDuplicate) {
			uniqueLines.push(line);
		}
	});

	return uniqueLines;
}
// find specific character on line
export function findSpecificCharacterOnLine(
	line: Line,
	character: string,
	grid: string[][]
): string[] {
	const broadcastPath: string[] = [];
	line.forEach((coord) => {
		if (grid[coord.y][coord.x] === character) {
			broadcastPath.push(grid[coord.y][coord.x]);
		} else {
			broadcastPath.push("");
		}
	});
	return broadcastPath;
}

// find all possible antipodes for character in 2D array
export function findAllPossibleAntipodesInArray(arr: string[]): Result[] {
	// Find indexes where characters exist (non-empty strings)
	const characterIndexes = arr
		.map((val, idx) => (val !== "" ? idx : -1))
		.filter((idx) => idx !== -1);

	// If we don't have at least 2 characters, return empty array
	if (characterIndexes.length < 2) {
		return [];
	}

	const results = new Map<number, Set<number>>();

	// For each pair of character positions
	for (let i = 0; i < characterIndexes.length; i++) {
		for (let j = i + 1; j < characterIndexes.length; j++) {
			const pos1 = characterIndexes[i];
			const pos2 = characterIndexes[j];

			// For each possible index in the array
			for (let idx = 0; idx < arr.length; idx++) {
				const dist1 = Math.abs(idx - pos1);
				const dist2 = Math.abs(idx - pos2);

				// If one distance is twice the other, we've found a valid 'd'
				// Check both possibilities: dist1 = d, dist2 = 2d OR dist2 = d, dist1 = 2d
				if (dist2 === 2 * dist1) {
					if (!results.has(dist1)) {
						results.set(dist1, new Set<number>());
					}
					results.get(dist1)!.add(idx);
				} else if (dist1 === 2 * dist2) {
					if (!results.has(dist2)) {
						results.set(dist2, new Set<number>());
					}
					results.get(dist2)!.add(idx);
				}
			}
		}
	}

	// Convert results to array format and sort
	return Array.from(results.entries())
		.map(([distance, indexes]) => ({
			distance,
			indexes: Array.from(indexes).sort((a, b) => a - b),
		}))
		.sort((a, b) => a.distance - b.distance);
}

// function to remove duplicate coordinates from array of coordinates
export function removeDuplicateCoordinates(
	coordinates: Coordinate[]
): Coordinate[] {
	return coordinates.filter(
		(coord, index, self) =>
			index === self.findIndex((c) => c.x === coord.x && c.y === coord.y)
	);
}

// find all possible antipodes for character in grid
export function findAllPossibleAntipodesForCharacter(
	character: string,
	grid: string[][]
): Coordinate[] {
	const coordinates = findAllCharacterCoordinates(character, grid);
	const uniqueCoordinatePairs = findAllUniqueCoordinatePairs(coordinates);
	const uniqueLines = findUniqueExtendedLinesFromCoordinatePairs(
		uniqueCoordinatePairs,
		getGridDimensions(grid)
	);

	let antipodeCoordinates: Coordinate[] = [];
	uniqueLines.forEach((line) => {
		const broadcastPathWithAntennas = findSpecificCharacterOnLine(
			line,
			character,
			grid
		);
		const foundAntipodes = findAllPossibleAntipodesInArray(
			broadcastPathWithAntennas
		);

		// push foundAntipodes coordinates to antipodes array
		foundAntipodes.forEach((antipode) => {
			// convert antipodes indexes to coordinates
			const indexes = antipode.indexes;
			const coordinates = indexes.map((index) => line[index]);
			antipodeCoordinates = antipodeCoordinates.concat(coordinates);
		});
	});

	// console.log("antipode coordinates", antipodeCoordinates);
	return antipodeCoordinates;
}

// function find all possible antipodes for all characters in grid
export function findAllPossibleAntipodesForAllCharacters(data: string): number {
	const grid = getGrid(data);
	const characters = findAllUniqueCharacters(grid);
	let allAntipodes: Coordinate[] = [];
	characters.forEach((character) => {
		const antipodes = findAllPossibleAntipodesForCharacter(character, grid);
		allAntipodes = allAntipodes.concat(antipodes);
	});
	return removeDuplicateCoordinates(allAntipodes).length;
}

// const data = testData.trim();
const data = await getData("./data.txt");

console.log(findAllPossibleAntipodesForAllCharacters(data)); /* 357 */
