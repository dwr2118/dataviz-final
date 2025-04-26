import { readFileSync } from 'fs';
import { csvParse } from 'd3-dsv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as d3 from "d3";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to CSV file
const csvPath = join(__dirname, 'data.csv');

export async function getDataAsJson() {
  // Read CSV file as string
  const csvString = readFileSync(csvPath, 'utf-8');
  
  // Parse CSV string
  const csvData = csvParse(csvString, row => {
    // Convert numeric fields to numbers
    return {
      Gender: row.Gender,
      Age: +row.Age,
      AcademicPressure: +row["Academic Pressure"],
      StudySatisfaction: +row["Study Satisfaction"],
      SleepDuration: row["Sleep Duration"],
      DietaryHabits: row["Dietary Habits"],
      SuicidalThoughts: row["Have you ever had suicidal thoughts ?"],
      StudyHours: +row["Study Hours"],
      FinancialStress: +row["Financial Stress"],
      FamilyHistory: row["Family History of Mental Illness"],
      Depression: row.Depression
    };
  });

  return csvData;
}

// For Observable Framework use
export const data = getDataAsJson();

// For direct Node.js execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  getDataAsJson().then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}