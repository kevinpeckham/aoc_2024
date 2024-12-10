import type { GridMap, CoordKey } from "../types";
export function lookupCharAtCoordKey(grid: GridMap, coord: CoordKey): string {
	const [x, y] = coord.split(",");
	return grid.get(`${x},${y}`) ?? "";
}
