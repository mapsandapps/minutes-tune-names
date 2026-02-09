import { tunebooks, type Tunebook } from "./tunebooks.ts";

const getTuneNameFromPageNumber = (
  pageNumber: string,
  tunebook: Tunebook,
  /**
   * if top is default, e.g. "45" should be assumed to be "45t"
   * if top is not default, only match "45t"; "45" should not get a tune name
   */
  isTopDefault?: boolean,
): string | undefined => {
  const bookMap = tunebook.data;
  const lowercaseNumber = pageNumber.toLowerCase();

  // if top is default, we want e.g. add a "t" to "45" to check if there is a tune on the top of that page in the relevant book (after checking if there is a "45" with no suffix)
  const lowercaseNumberWithT =
    lowercaseNumber.endsWith("t") || lowercaseNumber.endsWith("b")
      ? lowercaseNumber
      : `${lowercaseNumber}t`;

  const tuneName = bookMap[lowercaseNumber]
    ? bookMap[lowercaseNumber]
    : isTopDefault
      ? bookMap[lowercaseNumberWithT]
      : undefined;

  return tuneName;
};

// find numbers
// if the number has a tunebook abbreviation before it, replace it from that page in the book
// if the number does not have a tunebook abbreviation before it, AND there is a primary book, replace the number with the page in the primary book
// ignore all other numbers
const replaceNumbersBookBeforePage = (
  text: string,
  primaryTunebook: string,
  isTopDefault?: boolean,
) => {
  // replace numbers that have a book abbreviation before them
  tunebooks.forEach((book) => {
    if (book.id === primaryTunebook) return; // we will handle the primary book later

    const regex = new RegExp(book.prefix + " " + "\\d+[tbTB]*", "g");

    text = text.replace(regex, (match) => {
      const pageNumber = match.replace(`${book.prefix} `, "").toLowerCase();
      const tuneName = getTuneNameFromPageNumber(
        pageNumber,
        book,
        isTopDefault,
      );
      return tuneName ? `${match} ${tuneName}` : match;
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

  text = text.replace(primaryBookRegex, (match) => {
    const tuneName = getTuneNameFromPageNumber(match, bookData, isTopDefault);
    return tuneName ? `${match} ${tuneName}` : match;
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
  isTopDefault?: boolean,
) => {
  // replace numbers that have a book abbreviation before them
  tunebooks.forEach((book) => {
    if (book.id === primaryTunebook) return; // we will handle the primary book later

    const escapedAbbreviation = book.suffix
      ?.replace(/\(/, "\\(")
      .replace(/\)/, "\\)");

    const regex = new RegExp("\\d+[tbTB]*" + " " + escapedAbbreviation, "g");

    text = text.replace(regex, (match) => {
      const pageNumber = match.replace(` ${book.suffix}`, "");
      const tuneName = getTuneNameFromPageNumber(
        pageNumber,
        book,
        isTopDefault,
      );
      return tuneName ? `${match} ${tuneName}` : match;
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

  text = text.replace(primaryBookRegex, (match) => {
    const tuneName = getTuneNameFromPageNumber(match, bookData, isTopDefault);
    return tuneName ? `${match} ${tuneName}` : match;
  });

  return text;
};

export const replaceNumbersFromAllBooks = (
  text: string,
  primaryTunebook: string,
  isTopDefault?: boolean,
  isPageBeforeBook?: boolean,
) => {
  return isPageBeforeBook
    ? replaceNumbersPageBeforeBook(text, primaryTunebook, isTopDefault)
    : replaceNumbersBookBeforePage(text, primaryTunebook, isTopDefault);
};

export const replaceNumbersFromPrimaryBook = (
  text: string,
  primaryTunebook: string,
  isTopDefault?: boolean,
) => {
  if (!text) return "";

  if (!primaryTunebook) return text;

  const bookData =
    tunebooks.find((book) => book.id === primaryTunebook) || tunebooks[0];

  return text.replace(/\d+[tbTB]*/g, (match) => {
    const tuneName = getTuneNameFromPageNumber(match, bookData, isTopDefault);
    return tuneName ? `${match} ${tuneName}` : match;
  });
};
