import { describe, expect, test } from "vitest";
import {
  replaceNumbersFromAllBooks,
  replaceNumbersFromPrimaryBook,
} from "../src/helpers";

describe("single books", () => {
  // tests should pass with both `replaceNumbersFromAllBooks` and `replaceNumbersFromPrimaryBook` methods, even though "all books" shouldn't really be used if there's only one

  test("lengthy description", () => {
    const input = `Jim opened with 56t and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t.`;
    const expectedOutput = `Jim opened with 56t Columbiana and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t Gainsville.`;

    expect(replaceNumbersFromPrimaryBook(input, "denson2025")).toEqual(
      expectedOutput,
    );
    expect(replaceNumbersFromAllBooks(input, "denson2025")).toEqual(
      expectedOutput,
    );
  });

  test("bad input", () => {
    // "multiple books" checkbox is unchecked, but multiple books have been provided
    // garbage in, garbage out
    const input = `55t (EH 1)
EH 55t
459 (1991)
522 (CB)`;
    const expectedOutput = `55t Carolina (EH 1 Weary Rest)
EH 55t Carolina
459 (1991)
522 Newbury (CB)`;

    expect(replaceNumbersFromPrimaryBook(input, "ch")).toEqual(expectedOutput);
  });

  test("capital T or B", () => {
    const input = `Delaney 47B
Maygan 39T`;
    const expectedOutput = `Delaney 47B Idumea
Maygan 39T Detroit`;

    expect(replaceNumbersFromPrimaryBook(input, "denson2025")).toEqual(
      expectedOutput,
    );
    expect(replaceNumbersFromAllBooks(input, "denson2025")).toEqual(
      expectedOutput,
    );
  });
});
