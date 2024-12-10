import type { Grid, GridDimensions } from "../types";
export function getGridDimensions(grid: Grid): GridDimensions {
	return {
		width: grid[0].length,
		height: grid.length,
	};
}
export default getGridDimensions;
