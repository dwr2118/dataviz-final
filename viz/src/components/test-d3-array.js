import { range } from "d3-array";
import { readFileSync } from "fs";
import { csvParse } from "d3-dsv";

console.log(range(5)); // Should output: [0, 1, 2, 3, 4]

// Read the CSV file as a string
const csvText = readFileSync("./src/data/data.csv", "utf-8");

// Parse CSV
const data = csvParse(csvText);

// Display column names
console.log("Column names:", data.columns);