import { expect, test } from "vitest";
import {
  replaceNumbersFromAllBooks,
  replaceNumbersFromPrimaryBook,
} from "../src/helpers";

const singleBookTestCases = [
  {
    testName: "Description",
    input: `Jim opened with 56t and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t.`,
    primaryBook: "denson2025",
    expectedOutput: `Jim opened with 56t Columbiana and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t Gainsville.`,
  },
];

const multipleBookTestCases = [
  {
    testName: "EH Sample",
    input: `Jim: EH 106; 406
  Bill: EH 55t; EH 58
  David: EH 13; EH 40
  Andy: 345b; 442
  Shawn: 547; 546
  Ernie: 168`,
    primaryBook: "denson2025",
    expectedOutput: `Jim: EH 106 Sweet Hour of Prayer; 406 New Harmony
  Bill: EH 55t Nearer, My God, to Thee; EH 58 Cleansing Fountain
  David: EH 13 Converse; EH 40 Rhode Island
  Andy: 345b I'm On My Journey Home; 442 New Jordan
  Shawn: 547 Granville; 546 My Brightest Days
  Ernie: 168 Cowper`,
  },
  {
    testName: "Shenandoah - should not say 'Coop ShH 278 Stafford Hauff'",
    input: `Coop ShH 278`,
    primaryBook: "denson2025",
    expectedOutput: `Coop ShH 278 Hauff`,
  },
  {
    testName: "No primary book provided",
    input: `Coop ShH 278`,
    primaryBook: "none",
    expectedOutput: `Coop ShH 278 Hauff`,
  },
];

singleBookTestCases.forEach(
  ({ testName, input, expectedOutput, primaryBook }) => {
    test(`gets correct output, single book: ${testName}`, () => {
      expect(replaceNumbersFromPrimaryBook(input, primaryBook)).toEqual(
        expectedOutput,
      );
    });
  },
);

// test the same cases, but use the "all books" method (they should work this way as well)
singleBookTestCases.forEach(
  ({ testName, input, expectedOutput, primaryBook }) => {
    test(`gets correct output, all books: ${testName}`, () => {
      expect(replaceNumbersFromAllBooks(input, primaryBook)).toEqual(
        expectedOutput,
      );
    });
  },
);

multipleBookTestCases.forEach(
  ({ testName, input, expectedOutput, primaryBook }) => {
    test(`gets correct output, single book: ${testName}`, () => {
      expect(replaceNumbersFromAllBooks(input, primaryBook)).toEqual(
        expectedOutput,
      );
    });
  },
);
