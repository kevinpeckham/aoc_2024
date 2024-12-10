import type { Coordinate, Grid } from "../types";
export function lookupCharAtCoord(
	grid: Grid,
	coordinate: Coordinate
): string | null {
	const { x, y } = coordinate;
	if (x < 0 || y < 0) return null;
	if (!grid[y]) return null;
	if (!grid[y][x]) return null;
	return grid[y][x];
}
export default lookupCharAtCoord;
