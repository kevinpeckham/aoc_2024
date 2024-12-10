import type { CoordKey, GridMap } from "../types";
export function findCharacterInGridMap(
	character: string,
	gridMap: GridMap
): Set<CoordKey> {
	const coords = new Set<CoordKey>();
	gridMap.forEach((value, key) => {
		if (key !== "width" && key !== "height" && value === character) {
			coords.add(key as CoordKey);
		}
	});
	return coords;
}
export default findCharacterInGridMap;
