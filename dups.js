import questions from "./app/questions.json";
import groupBy from "lodash/groupBy";

const groupedQuestions = groupBy(questions, "question");
const dups = Object.keys(groupedQuestions).filter(
  (key) => groupedQuestions[key].length > 1
);
console.log({ dups });
