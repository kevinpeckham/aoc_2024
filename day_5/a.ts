// Day 5 - Part A

// utils
import { getData } from "./../utils";

const testData = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

// problem
// a list of numbers represents an "update"
// -- meaning a an ordered list of pages to be printed
// e.g.
//"75,47,61,53,29"

// a list of rules tells us restrictions on the order of pages
// e.g.
// 47|53 means 47 must be printed before 53

// evaluate all the lists of numbers
// to find out which are in the appropriate order

// then find the middle number of each each valid list
// and sum them up

// STEP 1: extract data
// extract data into rules and updates

// types
interface Rule {
	page: number;
	before: number[];
}
type Update = number[];

function getRules(data: string): string[] {
	const regex = /^\d+?\|\d+?$/gm;
	const results = data.match(regex) ?? [];
	return results;
}
function parseRules(input: string[]): Rule[] {
	// map the input to an array of objects
	const r1 = input.map((result) => {
		const split = result.split("|");
		const obj = {
			page: Number(split[0]),
			before: [Number(split[1])],
		};
		return obj;
	});

	// create array to store consolidated rules
	const rules: Rule[] = [];

	// loop through each object
	// and consolidate the rules
	r1.forEach((rule) => {
		// find the page in the consolidated rules
		const page = rules.find((p) => p.page === rule.page);
		// if the page is not found
		if (!page) {
			// add the rule to the consolidated rules
			rules.push(rule);
		} else {
			// if the page is found, add the before to the existing page
			page.before.push(...rule.before);
		}
	});

	// sort the rules by number of items in the before array
	rules.sort((a, b) => a.before.length - b.before.length);

	return rules;
}
function getUpdates(data: string): number[][] {
	const regex = /^(?:\d{2},?)+?$/gm;
	const results = data.match(regex) ?? [];
	return results.map((result) => result.split(",").map((n) => Number(n)));
}
function evaluatePageInUpdate(
	page: number,
	update: Update,
	rules: Rule[]
): "pass" | "fail" {
	const pageIndex = update.indexOf(page);
	const rule = rules.find((r) => r.page === page);
	if (!rule) return "pass";

	// Check each page that must come after
	for (const mustComeAfter of rule.before) {
		const index = update.indexOf(mustComeAfter);
		// Fail if page is in update and comes before our page
		if (index !== -1 && index < pageIndex) {
			return "fail";
		}
	}
	return "pass";
}
function evaluateAllPagesInUpdate(
	update: number[],
	rules: Rule[]
): "pass" | "fail" {
	// Work backwards through array for efficiency
	for (let i = update.length - 1; i >= 0; i--) {
		if (evaluatePageInUpdate(update[i], update, rules) === "fail") {
			return "fail";
		}
	}
	return "pass";
}
function evaluateAllUpdates(updates: Update[], rules: Rule[]): Update[] {
	// return passing updates
	const passing = updates.filter((update) => {
		const evaluation = evaluateAllPagesInUpdate(update, rules);
		console.log(evaluation);
		return evaluation === "pass";
	});
	return passing;
}
function getMiddleNumberOfUpdate(update: Update): number {
	const middleIndex = Math.floor(update.length / 2);
	return update[middleIndex];
}
function getMiddleNumbersOfUpdates(updates: Update[]): number[] {
	const middleNumbers = updates.map((update) =>
		getMiddleNumberOfUpdate(update)
	);
	return middleNumbers;
}

// const data = testData;
// const data = testData;
const data = await getData("./data.txt");
const rules = parseRules(getRules(data));
const updates = getUpdates(data);
const passingUpdates = evaluateAllUpdates(updates, rules);
const middleNumbers = getMiddleNumbersOfUpdates(passingUpdates);
const sumOfMiddleNumbers = middleNumbers.reduce((a, b) => a + b, 0);

console.log("sum of middle numbers", sumOfMiddleNumbers); // number
