import { getData } from "./../utils";

const testData = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

// get data
const data = await getData("./data.txt");

// regex to match all portions of the input string that start with `don't()` and end just before a 'do()' or the end of the string
const regex = /don't\(\)[\s\S]+?(?=(?:do\(\))|$)/g;

// remove matches from string and return a new string
const replaced = data.replaceAll(regex, "");

// now find valid mul pairs
const regex2 = /mul\((\d+),(\d+)\)/g;
const matches = replaced.matchAll(regex2);

// coerce into array of numbers and multiply
const results = Array.from(matches).map((match) => {
	const [_, n1, n2] = match;
	return parseInt(n1) * parseInt(n2);
});

// sum the results
console.log(results.reduce((acc, curr) => acc + curr, 0));
// answer is 80747545
