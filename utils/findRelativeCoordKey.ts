// import types
import type { CoordKey, CardinalDirection } from "../types";

// import helper functions
import { isValidCoordKey } from "../utils";

export function findRelativeCoordKey(
	coord: CoordKey,
	direction: CardinalDirection,
	distance: number,
	gridHeight: number,
	gridWidth: number
): CoordKey | null {
	const x = parseInt(coord.split(",")[0]);
	const y = parseInt(coord.split(",")[1]);
	let newCoord: CoordKey;

	switch (direction) {
		case "N":
			newCoord = `${x},${y - distance}`;
			break;
		case "E":
			newCoord = `${x + distance},${y}`;
			break;
		case "S":
			newCoord = `${x},${y + distance}`;
			break;
		case "W":
			newCoord = `${x - distance},${y}`;
			break;
	}

	return isValidCoordKey(newCoord, gridHeight, gridWidth) ? newCoord : null;
}
