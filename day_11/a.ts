function evaluateStone(stone: string): string[] {
	if (stone === "0") {
		return ["1"];
	}
	if (stone.length % 2 === 0) {
		const midPoint = stone.length / 2;
		const d1 = stone.slice(0, midPoint); // * should never have a leading zero
		const d2 = stone.slice(midPoint).replace(/^0+/, "");
		return [d1, d2 ? d2 : "0"];
	}
	return [`${Number(stone) * 2024}`];
}

function evaluateStones(stonesArray: string[]): string[] {
	return stonesArray.flatMap((stone) => evaluateStone(stone.toString()));
}

function evaluateStonesMultipleTimes(stones: string, times: number): number {
	let stonesArray = stones.split(" ");
	for (let i = 0; i < times; i++) {
		stonesArray = evaluateStones(stonesArray);
	}
	return stonesArray.length;
}

const data = "1950139 0 3 837 6116 18472 228700 45";
console.log(evaluateStonesMultipleTimes(data, 25)); // 235080
