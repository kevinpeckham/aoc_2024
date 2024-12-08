interface GridDimensions {
	width: number;
	height: number;
}
export default function getGridDimensions(grid: string[][]): GridDimensions {
	return {
		width: grid[0].length,
		height: grid.length,
	};
}
