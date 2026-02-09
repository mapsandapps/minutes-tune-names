import { tunebooks } from "./tunebooks.ts";

// find numbers
// if the number has a tunebook abbreviation before it, replace it from that page in the book
// if the number does not have a tunebook abbreviation before it, AND there is a primary book, replace the number with the page in the primary book
// ignore all other numbers
export const replaceNumbersFromAllBooks = (
  text: string,
  primaryTunebook: string,
) => {
  // replace numbers that have a book abbreviation before them
  tunebooks.forEach((book) => {
    if (book.id === primaryTunebook) return; // we will handle the primary book later

    const bookMap = book.data;

    const regex = new RegExp(book.abbreviation + " " + "\\d+[tbTB]*", "g");

    text = text.replace(regex, (match) => {
      const pageNumber = match
        .replace(`${book.abbreviation} `, "")
        .toLowerCase();
      // @ts-ignore
      return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
    });
  });

  // if there is no primary book, we're done
  if (primaryTunebook === "none") return text;

  // if there is a primary book, replace numbers that have no abbreviation before them
  const abbreviations = tunebooks
    .map((book) => `${book.abbreviation} `)
    .filter(Boolean); // `.filter(Boolean) removes falsy values
  // the first "\\d" is to keep the "78" part of "ShH 278" from matching
  const pattern = `(?<!${abbreviations.join("|")}|\\d)\\d+[tbTB]*`;
  const primaryBookRegex = new RegExp(pattern, "g");

  const bookData = tunebooks.find((book) => book.id === primaryTunebook);
  if (!bookData) return text;
  const bookMap = bookData.data;

  text = text.replace(primaryBookRegex, (match) => {
    const pageNumber = match.toLowerCase();
    // @ts-ignore
    return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
  });

  return text;
};

export const replaceNumbersFromPrimaryBook = (
  text: string,
  primaryTunebook: string,
) => {
  if (!text) return "";

  if (!primaryTunebook) return text;

  const bookData =
    tunebooks.find((book) => book.id === primaryTunebook) || tunebooks[0];
  const bookMap = bookData.data;

  return text.replace(/\d+[tbTB]*/g, (match) => {
    const pageNumber = match.toLowerCase();
    // @ts-ignore
    return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
  });
};
