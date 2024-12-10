import type { GridMap } from "../types";
export function getGridMapFromData(data: string): GridMap {
	// Check for empty input
	if (!data || !data.trim()) {
		throw new Error("Input data is empty");
	}

	const regex = /^[^\n]+?$/gm;
	const matches = data.match(regex) ?? [];

	// Check if any rows were found
	if (matches.length === 0) {
		throw new Error("No valid rows found in input data");
	}

	// Check row lengths are consistent
	const rowLength = matches[0]?.length ?? 0;
	const hasInconsistentRows = matches.some((row) => row.length !== rowLength);
	if (hasInconsistentRows) {
		throw new Error("Input data has inconsistent row lengths");
	}

	// Create and populate the map
	const gridMap = new Map<string, string>();

	// Store grid dimensions
	gridMap.set("width", rowLength.toString());
	gridMap.set("height", matches.length.toString());

	// Convert rows to map entries
	matches.forEach((row, y) => {
		[...row].forEach((char, x) => {
			gridMap.set(`${x},${y}`, char);
		});
	});

	return gridMap;
}
export default getGridMapFromData;