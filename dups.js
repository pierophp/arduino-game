import questions from "./app/questions.json";
import groupBy from "lodash/groupBy";
import { writeFile } from "fs/promises";

const groupedQuestions = groupBy(questions, "question");
const dups = Object.keys(groupedQuestions).filter(
  (key) => groupedQuestions[key].length > 1
);

function findAllButFirstIndices(array, callback) {
  let firstIndex = array.findIndex(callback);

  // If no match is found, return an empty array
  if (firstIndex === -1) return [];

  // Find all indices except the first match
  return array
    .map((item, index) => (callback(item) && index !== firstIndex ? index : -1)) // Map to indices or -1
    .filter((index) => index !== -1); // Filter out the -1 values
}

let newQuestions = questions;

for (const dup of dups) {
  console.log(dup);
  const indicesToRemove = findAllButFirstIndices(
    questions,
    (q) => q.question === dup
  );

  newQuestions = newQuestions.filter(
    (_, index) => !indicesToRemove.includes(index)
  );
}

await writeFile("./app/questions.json", JSON.stringify(newQuestions, null, 2));
