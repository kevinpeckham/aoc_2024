// Day 9 - Part A
import { getData } from "./../utils";

export const testData = `2333133121414131402`;

export interface File {
	fileId: number;
	sizeInBlocks: number;
	type: "file";
}
export interface FreeSpace {
	fileId: undefined;
	sizeInBlocks: number;
	type: "freeSpace";
}
export type Chunk = File | FreeSpace;

export interface Block {
	type: "file" | "freeSpace";
	fileId?: number;
}

// parse data into chunks
export function parseDataToChunks(data: string): Chunk[] {
	let fileId = 0;
	return data.split("").map((char, index) => {
		// if index is even, create a file
		if (index % 2 === 0) {
			const file: Chunk = {
				type: "file",
				fileId: fileId,
				sizeInBlocks: parseInt(char),
			};
			fileId++; // increment fileId
			return file;
		}
		return { type: "freeSpace", sizeInBlocks: parseInt(char) };
	});
}

// parse chunks into blocks
export function parseChunksToBlocks(chunks: Chunk[]): Block[] {
	const totalBlocks = chunks.reduce(
		(sum, chunk) => sum + chunk.sizeInBlocks,
		0
	);
	const blocks = new Array<Block>(totalBlocks);

	let blockIndex = 0;
	for (const chunk of chunks) {
		const block = {
			type: chunk.type,
			fileId: chunk.fileId,
		};

		for (let i = 0; i < chunk.sizeInBlocks; i++) {
			blocks[blockIndex++] = { ...block };
		}
	}

	return blocks;
}

// defragment disk
function defragmentDisk(data: string): Block[] {
	const chunks = parseDataToChunks(data);
	const blocks = parseChunksToBlocks(chunks);

	const blocksCopy = [...blocks];
	let lastFileIndex = blocksCopy.length - 1;
	let firstFreeIndex = 0;

	while (true) {
		// Find last file block
		while (lastFileIndex >= 0 && blocksCopy[lastFileIndex].type !== "file") {
			lastFileIndex--;
		}

		// Find first free space
		while (
			firstFreeIndex < blocksCopy.length &&
			blocksCopy[firstFreeIndex].type !== "freeSpace"
		) {
			firstFreeIndex++;
		}

		// Check if defragmentation is complete
		if (
			firstFreeIndex >= lastFileIndex ||
			lastFileIndex < 0 ||
			firstFreeIndex >= blocksCopy.length
		) {
			break;
		}

		// Swap blocks
		[blocksCopy[firstFreeIndex], blocksCopy[lastFileIndex]] = [
			blocksCopy[lastFileIndex],
			blocksCopy[firstFreeIndex],
		];
	}

	return blocksCopy;
}

// visualize disk
export function encodeDisk(blocks: Block[]): string {
	return blocks
		.map((block) => (block.type === "file" ? block.fileId : "."))
		.join("");
}

// checksum
function checksum(blocks: Block[]): number {
	let sum = 0;
	let fileIndex = 0;

	for (const block of blocks) {
		if (block.type === "file") {
			sum += fileIndex * (block.fileId ?? 0);
			fileIndex++;
		}
	}

	return sum;
}

// const data = testData;
const data = await getData("./data.txt");
console.log("a", checksum(defragmentDisk(data))); // 6463499258318
