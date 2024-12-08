// utils
import { getData, getGrid, getGridDimensions } from "../utils";

// import test data from part A
// import { testData } from "./a";

// import types from part A
import type { Coordinate } from "./a";

// import functions from part A
import {
	findAllUniqueCharacters,
	findAllCharacterCoordinates,
	findAllUniqueCoordinatePairs,
	findUniqueExtendedLinesFromCoordinatePairs,
	removeDuplicateCoordinates,
} from "./a";

// find all possible antipodes for character in grid
function findAllPossibleAntipodesForCharacter(
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
		// !! in this case every coordinate in the line is an antipode
		uniqueLines.forEach((line) => {
			antipodeCoordinates = antipodeCoordinates.concat(line);
		});
	});

	return antipodeCoordinates;
}
function findAllPossibleAntipodesForAllCharacters(data: string): number {
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

console.log(findAllPossibleAntipodesForAllCharacters(data)); /* 1266 */
