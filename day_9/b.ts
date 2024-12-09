// Day 9 - Part B
import { getData } from "./../utils";

// import types part a
import type { File, Chunk } from "./a";

// import functions from part a
import { parseDataToChunks, parseChunksToBlocks } from "./a";

// consolidate free space
function consolidateFreeSpace(chunks: Chunk[]): Chunk[] {
	return chunks.reduce((acc: Chunk[], curr: Chunk, idx: number) => {
		// If current block isn't free space, add it to result
		if (curr.type !== "freeSpace") {
			acc.push(curr);
			return acc;
		}

		// Get last block in accumulator
		const prevBlock = acc[acc.length - 1];

		// If previous block is free space, add current size to it
		if (prevBlock?.type === "freeSpace") {
			prevBlock.sizeInBlocks += curr.sizeInBlocks;
		} else {
			// Otherwise add current block as new entry
			acc.push(curr);
		}

		return acc;
	}, []);
}

// defragment disk
function defragmentDisk(data: string): Chunk[] {
	const chunks = parseDataToChunks(data);
	const files = chunks.filter((chunk): chunk is File => chunk.type === "file");
	const sortedFiles = [...files].sort((a, b) => b.fileId - a.fileId);

	let result = [...chunks];

	for (const file of sortedFiles) {
		if (file.fileId === 0) break;

		const currentChunks = [...result];
		const fileIndex = currentChunks.findIndex(
			(chunk) => chunk.type === "file" && chunk.fileId === file.fileId
		);

		const freeSpace = currentChunks.find(
			(chunk) =>
				chunk.type === "freeSpace" && chunk.sizeInBlocks >= file.sizeInBlocks
		);

		if (!freeSpace) continue;

		const freeIndex = currentChunks.indexOf(freeSpace);

		if (freeIndex > fileIndex) continue;

		if (freeSpace.sizeInBlocks === file.sizeInBlocks) {
			// Swap positions
			currentChunks[freeIndex] = { ...file };
			currentChunks[fileIndex] = {
				type: "freeSpace",
				sizeInBlocks: file.sizeInBlocks,
			} as Chunk;
		} else {
			// Split free space
			currentChunks[freeIndex] = { ...file };
			currentChunks[fileIndex] = {
				type: "freeSpace",
				sizeInBlocks: file.sizeInBlocks,
			} as Chunk;
			currentChunks.splice(freeIndex + 1, 0, {
				type: "freeSpace",
				sizeInBlocks: freeSpace.sizeInBlocks - file.sizeInBlocks,
			} as Chunk);
		}

		result = consolidateFreeSpace(currentChunks);
	}

	return result;
}

// checksum
function checksum(chunks: Chunk[]): number {
	let sum = 0;
	let fileIndex = 0;
	let blocks = parseChunksToBlocks(chunks);

	for (const block of blocks) {
		if (block.type === "file") {
			sum += fileIndex * (block.fileId ?? 0);
		}
		fileIndex++;
	}

	return sum;
}

// const data = testData;
const data = await getData("./data.txt");
console.log("b", checksum(defragmentDisk(data))); // 6493634986625
