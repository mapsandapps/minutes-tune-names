import { tunebooks } from "./tunebooks.ts";

// find numbers
// if the number has a tunebook abbreviation before it, replace it from that page in the book
// if the number does not have a tunebook abbreviation before it, AND there is a primary book, replace the number with the page in the primary book
// ignore all other numbers
const replaceNumbersBookBeforePage = (
  text: string,
  primaryTunebook: string,
) => {
  // replace numbers that have a book abbreviation before them
  tunebooks.forEach((book) => {
    if (book.id === primaryTunebook) return; // we will handle the primary book later

    const bookMap = book.data;

    const regex = new RegExp(book.prefix + " " + "\\d+[tbTB]*", "g");

    text = text.replace(regex, (match) => {
      const pageNumber = match.replace(`${book.prefix} `, "").toLowerCase();
      // @ts-ignore
      return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
    });
  });

  // if there is no primary book, we're done
  if (primaryTunebook === "none") return text;

  // if there is a primary book, replace numbers that have no abbreviation before them
  const abbreviations = tunebooks
    .map((book) => `${book.prefix} `)
    .filter(Boolean); // `.filter(Boolean) removes falsy values
  const pattern = `(?<!${abbreviations.join("|")})\\b\\d+[tbTB]*\\b`;
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

// find numbers
// if the number has a tunebook abbreviation before it, replace it from that page in the book
// if the number does not have a tunebook abbreviation before it, AND there is a primary book, replace the number with the page in the primary book
// ignore all other numbers
const replaceNumbersPageBeforeBook = (
  text: string,
  primaryTunebook: string,
) => {
  // replace numbers that have a book abbreviation before them
  tunebooks.forEach((book) => {
    if (book.id === primaryTunebook) return; // we will handle the primary book later

    const bookMap = book.data;

    const escapedAbbreviation = book.suffix
      ?.replace(/\(/, "\\(")
      .replace(/\)/, "\\)");

    const regex = new RegExp("\\d+[tbTB]*" + " " + escapedAbbreviation, "g");

    text = text.replace(regex, (match) => {
      const pageNumber = match.replace(` ${book.suffix}`, "").toLowerCase();
      // @ts-ignore
      return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
    });
  });

  // if there is no primary book, we're done
  if (primaryTunebook === "none") return text;

  const abbreviations = tunebooks
    .map((book) => ` ${book.suffix}`)
    .filter(Boolean) // `.filter(Boolean) removes falsy values
    .join("|");

  const escapedAbbreviations = abbreviations
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
  const pattern = `(?<!\\d)\\b\\d+[tbTB]*\\b(?!(${escapedAbbreviations}))`;

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

export const replaceNumbersFromAllBooks = (
  text: string,
  primaryTunebook: string,
  isPageBeforeBook?: boolean,
) => {
  return isPageBeforeBook
    ? replaceNumbersPageBeforeBook(text, primaryTunebook)
    : replaceNumbersBookBeforePage(text, primaryTunebook);
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
