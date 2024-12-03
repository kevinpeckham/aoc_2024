import { getData } from "./../utils";

const testData = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

const data = await getData("./data.txt");

// find valid mul pairs
const regex = /mul\((\d+),(\d+)\)/g;
const matches = data.matchAll(regex);

// coerce into array of numbers and multiply
const results = Array.from(matches).map((match) => {
	const [_, n1, n2] = match;
	return parseInt(n1) * parseInt(n2);
});

// sum the results
console.log(results.reduce((acc, curr) => acc + curr, 0));
// answer is 182619815
