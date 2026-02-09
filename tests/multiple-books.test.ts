import { describe, expect, test } from "vitest";
import {
  replaceNumbersFromAllBooks,
  replaceNumbersFromPrimaryBook,
} from "../src/helpers";

describe("multiple books", () => {
  test("EH sample", () => {
    const input = `Jim: EH 106; 406
Bill: EH 55t; EH 58
David: EH 13; EH 40
Andy: 345b; 442
Shawn: 547; 546
Ernie: 168`;
    const expectedOutput = `Jim: EH 106 Sweet Hour of Prayer; 406 New Harmony
Bill: EH 55t Nearer, My God, to Thee; EH 58 Cleansing Fountain
David: EH 13 Converse; EH 40 Rhode Island
Andy: 345b I'm On My Journey Home; 442 New Jordan
Shawn: 547 Granville; 546 My Brightest Days
Ernie: 168 Cowper`;

    expect(replaceNumbersFromAllBooks(input, "denson2025")).toEqual(
      expectedOutput,
    );
  });

  test("Shenandoah - should not say 'Coop ShH 278 Stafford Hauff'", () => {
    const input = "Coop ShH 278";
    const expectedOutput = "Coop ShH 278 Hauff";

    expect(replaceNumbersFromAllBooks(input, "denson2025")).toEqual(
      expectedOutput,
    );
  });

  test("no primary book provided", () => {
    const input = "Coop ShH 278";
    const expectedOutput = "Coop ShH 278 Hauff";

    expect(replaceNumbersFromAllBooks(input, "none")).toEqual(expectedOutput);
  });

  test("book before page, bad input", () => {
    // written as page before book but "book before page" option is on
    // this output is not what the user expects, but is correct for their settings
    const input = `55t (EH 1)
459 (1991)
522 (CB)`;
    const expectedOutput = `55t (EH 1 Windgate)
459 Hurricane Creek (1991)
522 Ye Heedless Ones (CB)`;

    expect(
      replaceNumbersFromAllBooks(input, "denson2025", false, false),
    ).toEqual(expectedOutput);
  });

  test("page before book, bad input", () => {
    // written as book before page but "page before book" option is on
    // this output is not what the user expects, but is correct for their settings
    const input = "EH 55t";
    const expectedOutput = "EH 55t";

    expect(
      replaceNumbersFromAllBooks(input, "denson2025", false, true),
    ).toEqual(expectedOutput);
  });

  test("page before book, correct input", () => {
    const input = `55t (EH 1)
459 (1991)
522 (CB)
213b
213b (1991)`;
    const expectedOutput = `55t (EH 1) Nearer, My God, to Thee
459 (1991) Tolling Bell
522 (CB) Shades of Night
213b Trembling Spirit
213b (1991) Warning`;

    expect(
      replaceNumbersFromAllBooks(input, "denson2025", false, true),
    ).toEqual(expectedOutput);
  });

  test("`isTopDefault` on, page before book", () => {
    const input = `45
45t
55 (EH 1)
55t (EH 1)
404 (ShH)
404t (ShH)`;
    const expectedOutput = `45 New Britain
45t New Britain
55 (EH 1) Nearer, My God, to Thee
55t (EH 1) Nearer, My God, to Thee
404 (ShH) Paradise
404t (ShH) Paradise`;
    expect(replaceNumbersFromAllBooks(input, "denson2025", true, true)).toEqual(
      expectedOutput,
    );
  });

  test("`isTopDefault` off, page before book", () => {
    const input = `45
45t
55 (EH 1)
55t (EH 1)
404 (ShH)
404t (ShH)`;
    const expectedOutput = `45
45t New Britain
55 (EH 1)
55t (EH 1) Nearer, My God, to Thee
404 (ShH)
404t (ShH) Paradise`;
    expect(
      replaceNumbersFromAllBooks(input, "denson2025", false, true),
    ).toEqual(expectedOutput);
  });

  test("`isTopDefault` on, book before page", () => {
    const input = `45
45t
EH 55
EH 55t
ShH 404
ShH 404t`;
    const expectedOutput = `45 New Britain
45t New Britain
EH 55 Nearer, My God, to Thee
EH 55t Nearer, My God, to Thee
ShH 404 Paradise
ShH 404t Paradise`;
    expect(
      replaceNumbersFromAllBooks(input, "denson2025", true, false),
    ).toEqual(expectedOutput);
  });

  test("`isTopDefault` off, book before page", () => {
    const input = `45
45t
EH 55
EH 55t
ShH 404
ShH 404t`;
    const expectedOutput = `45
45t New Britain
EH 55
EH 55t Nearer, My God, to Thee
ShH 404
ShH 404t Paradise`;
    expect(
      replaceNumbersFromAllBooks(input, "denson2025", false, false),
    ).toEqual(expectedOutput);
  });
});
