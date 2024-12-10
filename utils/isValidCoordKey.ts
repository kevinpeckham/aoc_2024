import type { CoordKey } from "../types";
export function isValidCoordKey(
	coord: CoordKey,
	gridHeight: number,
	gridWidth: number
): boolean {
	const x = parseInt(coord.split(",")[0]);
	const y = parseInt(coord.split(",")[1]);
	return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
}
export default isValidCoordKey;
