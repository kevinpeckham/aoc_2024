interface Stone {
	value: string;
	iterationsLeft: number;
}

// cache to store previously calculated results
const memoCache = new Map<string, number>();

// create a unique key for memoization
function createCacheKey(stone: Stone): string {
	return `${stone.value}-${stone.iterationsLeft}`;
}

function evaluateStone(stone: Stone): number {
	const cacheKey = createCacheKey(stone);

	// check cache first
	if (memoCache.has(cacheKey)) {
		return memoCache.get(cacheKey)!;
	}

	// base case
	if (stone.iterationsLeft === 0) {
		memoCache.set(cacheKey, 1);
		return 1;
	}

	const iterationsLeft = stone.iterationsLeft - 1;
	let result: number;

	// pattern matching
	switch (true) {
		case stone.value === "0":
			result = evaluateStone({ value: "1", iterationsLeft });
			break;

		case stone.value.length % 2 === 0: {
			const midPoint = stone.value.length / 2;
			const d1 = stone.value.slice(0, midPoint);
			const d2 = stone.value.slice(midPoint).replace(/^0+/, "") || "0";

			// Process both halves in parallel if possible
			const [r1, r2] = [
				evaluateStone({ value: d1, iterationsLeft }),
				evaluateStone({ value: d2, iterationsLeft }),
			];
			result = r1 + r2;
			break;
		}

		default: {
			const newValue = `${BigInt(stone.value) * 2024n}`;
			result = evaluateStone({ value: newValue, iterationsLeft });
		}
	}

	// Cache the result before returning
	memoCache.set(cacheKey, result);
	return result;
}

function evaluateStoneRecursively(stone: Stone): number {
	// initialize backlog with pattern recognition
	const backlog: Stone[] = [stone];
	let sum = 0;

	// process patterns in batches where possible
	while (backlog.length > 0) {
		const currentBatch = backlog.splice(0, Math.min(10, backlog.length));
		sum += currentBatch.reduce((acc, currentStone) => {
			return acc + evaluateStone(currentStone);
		}, 0);
	}

	return sum;
}

// function evaluate a sequence of stones recursively
function evaluateStonesRecursively(stones: string, times: number): number {
	const stonesArray = stones.split(" ");
	let total = 0;

	for (const stone of stonesArray) {
		const stoneObj: Stone = { value: stone, iterationsLeft: times };
		total += evaluateStoneRecursively(stoneObj);
	}

	return total;
}

const data = "1950139 0 3 837 6116 18472 228700 45";
const start = performance.now();
const result = evaluateStonesRecursively(data, 75);
const end = performance.now();
console.log(result); // 279903140844645
console.log(`Time: ${end - start}ms`);
