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
