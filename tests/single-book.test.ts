import { describe, expect, test } from "vitest";
import { replaceNumbers } from "../src/helpers";

describe("single books", () => {
  test("lengthy description", () => {
    const input = `Jim opened with 56t and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t.`;
    const expectedOutput = `Jim opened with 56t Columbiana and offered a prayer.
David B. taught a beginner's lesson, and we sang 70t Gainsville.`;

    expect(replaceNumbers(input, "denson2025")).toEqual(expectedOutput);
    expect(replaceNumbers(input, "denson2025", true)).toEqual(expectedOutput);
  });

  test("bad input", () => {
    // "multiple books" checkbox is unchecked, but multiple books have been provided
    // garbage in, garbage out
    const input = `55t (EH 1)
EH 55t
459 (1991)
522 (CB)`;
    const badOutput = `55t??? (EH 1???)
EH 55t???
459 Hurricane Creek (1991???)
522 Ye Heedless Ones (CB)`;
    const worseOutput = `55t??? (EH 1 Windgate)
EH 55t Nearer, My God, to Thee
459 Hurricane Creek (1991???)
522 Ye Heedless Ones (CB)`;

    expect(replaceNumbers(input, "denson2025")).toEqual(badOutput);
    expect(replaceNumbers(input, "denson2025", true)).toEqual(worseOutput);
  });

  test("capital T or B", () => {
    const input = `Delaney 47B
Maygan 39T`;
    const expectedOutput = `Delaney 47B Idumea
Maygan 39T Detroit`;

    expect(replaceNumbers(input, "denson2025")).toEqual(expectedOutput);
    expect(replaceNumbers(input, "denson2025", true)).toEqual(expectedOutput);
  });

  test("`isTopDefault` on", () => {
    expect(replaceNumbers("45", "denson2025", false, true)).toEqual(
      "45 New Britain",
    );
    expect(replaceNumbers("45t", "denson2025", false, true)).toEqual(
      "45t New Britain",
    );
    expect(replaceNumbers("45", "denson2025", true, true)).toEqual(
      "45 New Britain",
    );
    expect(replaceNumbers("45t", "denson2025", true, true)).toEqual(
      "45t New Britain",
    );
  });

  test("`isTopDefault` off", () => {
    expect(replaceNumbers("45", "denson2025", false, false)).toEqual("45???");
    expect(replaceNumbers("45t", "denson2025", false, false)).toEqual(
      "45t New Britain",
    );
    expect(replaceNumbers("45", "denson2025", true, false)).toEqual("45???");
    expect(replaceNumbers("45t", "denson2025", true, false)).toEqual(
      "45t New Britain",
    );
  });

  test("time should not get replaced", () => {
    expect(
      replaceNumbers(
        "Wesley Teaching Chapel at Emory University, 10am",
        "denson2025",
      ),
    ).toEqual("Wesley Teaching Chapel at Emory University, 10???am");
    expect(
      replaceNumbers(
        "Wesley Teaching Chapel at Emory University, 10am",
        "denson2025",
        true,
      ),
    ).toEqual("Wesley Teaching Chapel at Emory University, 10am");
  });
});
