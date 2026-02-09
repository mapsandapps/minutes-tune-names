import { describe, expect, test } from "vitest";
import { replaceNumbersFromAllBooks } from "../src/helpers";

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

  test("No primary book provided", () => {
    const input = "Coop ShH 278";
    const expectedOutput = "Coop ShH 278 Hauff";

    expect(replaceNumbersFromAllBooks(input, "none")).toEqual(expectedOutput);
  });
});
