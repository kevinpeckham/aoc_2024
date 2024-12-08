export interface Coordinate {
	x: number;
	y: number;
}
export type Line = Coordinate[];
export type CoordinatePair = [Coordinate, Coordinate];

export interface GridDimensions {
	width: number;
	height: number;
}
export interface Result {
	distance: number; // The base distance 'd'
	indexes: number[]; // Indexes that satisfy the distance criteria
}
