import type { Coordinate, Grid } from "../types";
export function findCharacterInGrid(
	character: string,
	grid: Grid
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
