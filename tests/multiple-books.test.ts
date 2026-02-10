import { describe, expect, test } from "vitest";
import { replaceNumbers } from "../src/helpers";

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

    expect(replaceNumbers(input, "denson2025", true)).toEqual(expectedOutput);
  });

  test("Shenandoah - should not say 'Coop ShH 278 Stafford Hauff'", () => {
    const input = "Coop ShH 278";
    const expectedOutput = "Coop ShH 278 Hauff";

    expect(replaceNumbers(input, "denson2025", true)).toEqual(expectedOutput);
  });

  test("no primary book provided", () => {
    const input = "Coop ShH 278";
    const expectedOutput = "Coop ShH 278 Hauff";

    expect(replaceNumbers(input, "none", true)).toEqual(expectedOutput);
  });

  test("book before page, bad input", () => {
    // written as page before book but "book before page" option is on
    // this output is not what the user expects, but is correct for their settings
    const input = `55t (EH 1)
459 (1991)
522 (CB)`;
    const expectedOutput = `55t??? (EH 1 Windgate)
459 Hurricane Creek (1991???)
522 Ye Heedless Ones (CB)`;

    expect(replaceNumbers(input, "denson2025", true, false, false)).toEqual(
      expectedOutput,
    );
  });

  test("page before book, bad input", () => {
    // written as book before page but "page before book" option is on
    // this output is not what the user expects, but is correct for their settings
    const input = "EH 55t";
    const expectedOutput = "EH 55t???";

    expect(replaceNumbers(input, "denson2025", true, false, true)).toEqual(
      expectedOutput,
    );
  });

  test("page before book, correct input", () => {
    const input = `55t (EH 1)
459 (1991)
522 (CB)
213b
213b (1991)
60 (EH 1)`;
    const expectedOutput = `55t (EH 1) Nearer, My God, to Thee
459 (1991) Tolling Bell
522 (CB) Shades of Night
213b Trembling Spirit
213b (1991) Warning
60 (EH 1) Shades of Night`;

    expect(replaceNumbers(input, "denson2025", true, false, true)).toEqual(
      expectedOutput,
    );
  });

  test("`isTopDefault` on, page before book", () => {
    const input = `45
45t
55 (EH 1)
55t (EH 1)
404 (ShH)
404t (ShH)
60 (EH 1)`;
    const expectedOutput = `45 New Britain
45t New Britain
55 (EH 1) Nearer, My God, to Thee
55t (EH 1) Nearer, My God, to Thee
404 (ShH) Paradise
404t (ShH) Paradise
60 (EH 1) Shades of Night`;
    expect(replaceNumbers(input, "denson2025", true, true, true)).toEqual(
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
    const expectedOutput = `45???
45t New Britain
55??? (EH 1)
55t (EH 1) Nearer, My God, to Thee
404??? (ShH)
404t (ShH) Paradise`;
    expect(replaceNumbers(input, "denson2025", true, false, true)).toEqual(
      expectedOutput,
    );
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
    expect(replaceNumbers(input, "denson2025", true, true, false)).toEqual(
      expectedOutput,
    );
  });

  test("`isTopDefault` off, book before page", () => {
    const input = `45
45t
EH 55
EH 55t
ShH 404
ShH 404t`;
    const expectedOutput = `45???
45t New Britain
EH 55???
EH 55t Nearer, My God, to Thee
ShH 404???
ShH 404t Paradise`;
    expect(replaceNumbers(input, "denson2025", true, false, false)).toEqual(
      expectedOutput,
    );
  });

  test("> 10 replacements", () => {
    const input = `Our extra special guest made for an extra special singing ❤️
Esther 49t
Piper 178t
Shawn 537
David 536
Andy 471
Jim 223
Zane 102
Coop ShH 200
Delaney 86
Maygan 162
Lily 278
Esther 362
Piper 34b
Shawn 240
Andy 423b
David 364
Jim 179
Zane 49b
Coop ShH 278
Delaney 47b
Maygan 39t
Lily 513
Esther 368
Piper 68b
Shawn 545
David 444
Andy 483
Jose 403
Jim 130
Coop ShH 288t
Lily 312b
Maygan 448b
Esther 524
Piper 168
David 356
Zane 55
Andy 255
Lily 442
Closer - 347t`;
    const expectedOutput = `Our extra special guest made for an extra special singing ❤️
Esther 49t Old Hundred
Piper 178t Africa
Shawn 537 Portsmouth
David 536 Sweet Majesty
Andy 471 Becket
Jim 223 Balm in Gilead
Zane 102 Fulfillment
Coop ShH 200 Attention
Delaney 86 Poland
Maygan 162 Plenary
Lily 278???
Esther 362 Norwich
Piper 34b St. Thomas
Shawn 240 Christian Song
Andy 423b Hall
David 364 Southwell
Jim 179 The Christian Warfare
Zane 49b Mear
Coop ShH 278 Hauff
Delaney 47b Idumea
Maygan 39t Detroit
Lily 513 Oakland
Esther 368 Stony Point
Piper 68b Ortonville
Shawn 545 Somers
David 444 All Saints New
Andy 483 Golden Gardens
Jose 403 Heavenly Rest
Jim 130 The Old Graveyard
Coop ShH 288t Savannah
Lily 312b Restoration
Maygan 448b The Grieved Soul
Esther 524 Moonlight
Piper 168 Cowper
David 356 Boundless Grace
Zane 55 Converse
Andy 255 Mechanicville
Lily 442 New Jordan
Closer - 347t Christian's Farewell`;
    expect(replaceNumbers(input, "denson2025", true, false, false)).toEqual(
      expectedOutput,
    );
  });
});
