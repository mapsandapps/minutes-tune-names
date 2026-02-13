import { tunebooks, type Tunebook } from "./tunebooks.ts";

interface PageNumber {
  fromInput: string;
  pageNumber: string;
  lowerCaseNumber: string;
  bookId: string;
}

const STRING_TO_REPLACE = "REPLACE_NUMBER_HERE_";
const UNKNOWN_PAGE_STRING = "???";

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

const getTuneNameAndNumber = (
  number: PageNumber,
  primaryTunebook?: string,
  isTopDefault?: boolean,
  isPageBeforeBook?: boolean,
) => {
  const { fromInput, pageNumber, lowerCaseNumber, bookId } = number;

  const tunebook = tunebooks.find((book) => book.id === bookId);
  const thisIsPrimaryTunebook = primaryTunebook === number.bookId;

  if (!tunebook) return "";

  const tuneName = getTuneNameFromPageNumber(
    lowerCaseNumber,
    tunebook,
    isTopDefault,
  );

  // tune name was not found, return "?"
  if (!tuneName) {
    if (isPageBeforeBook) {
      if (thisIsPrimaryTunebook) {
        return `${pageNumber}${UNKNOWN_PAGE_STRING}`;
      }
      return `${pageNumber}${UNKNOWN_PAGE_STRING} ${tunebook.suffix}`;
    } else {
      return `${fromInput}${UNKNOWN_PAGE_STRING}`;
    }
  }

  if (thisIsPrimaryTunebook) {
    return `${pageNumber} ${tuneName}`;
  }

  if (isPageBeforeBook) {
    return `${pageNumber} ${tunebook.suffix} ${tuneName}`;
  } else {
    return `${tunebook.prefix} ${pageNumber} ${tuneName}`;
  }
};

const getNumbersFromTextOneBook = (text: string, primaryTunebook: string) => {
  // if they're only using one book, any number is assumed to be a page number

  const numbers: PageNumber[] = [];

  const textWithoutNumbers = text.replace(/\d+[tbTB]*/g, (match) => {
    numbers.push({
      fromInput: match,
      pageNumber: match,
      lowerCaseNumber: match.toLowerCase(),
      bookId: primaryTunebook,
    });
    return `${STRING_TO_REPLACE}${numbers.length - 1}`;
  });

  return { textWithoutNumbers, numbers };
};

const getNumbersFromTextAllBooks = (
  text: string,
  primaryTunebook: string,
  isPageBeforeBook?: boolean,
) => {
  const numbers: PageNumber[] = [];

  var textWithoutNumbers = text;

  if (isPageBeforeBook) {
    // find numbers that have a book abbreviation after them
    tunebooks.forEach((book) => {
      if (book.id === primaryTunebook) return; // we will handle the primary book later

      const escapedAbbreviation = book.suffix
        ?.replace(/\(/, "\\(")
        .replace(/\)/, "\\)");

      const regex = new RegExp(
        "\\b\\d+[tbTB]*\\b" + " " + escapedAbbreviation,
        "g",
      );

      textWithoutNumbers = textWithoutNumbers.replace(regex, (match) => {
        const pageNumber = match.replace(` ${book.suffix}`, "");

        numbers.push({
          fromInput: match,
          pageNumber,
          lowerCaseNumber: pageNumber.toLowerCase(),
          bookId: book.id,
        });
        return `${STRING_TO_REPLACE}${numbers.length - 1}`;
      });
    });
  } else {
    // find numbers that have a book abbreviation before them
    tunebooks.forEach((book) => {
      if (book.id === primaryTunebook) return; // we will handle the primary book later

      const regex = new RegExp(book.prefix + " " + "\\b\\d+[tbTB]*\\b", "g");

      textWithoutNumbers = textWithoutNumbers.replace(regex, (match) => {
        const pageNumber = match.replace(`${book.prefix} `, "");

        numbers.push({
          fromInput: match,
          pageNumber,
          lowerCaseNumber: pageNumber.toLowerCase(),
          bookId: book.id,
        });
        return `${STRING_TO_REPLACE}${numbers.length - 1}`;
      });
    });
  }

  // now get numbers for primary tunebook
  if (primaryTunebook !== "none") {
    textWithoutNumbers = textWithoutNumbers.replace(
      /\b\d+[tbTB]*\b/g,
      (match) => {
        numbers.push({
          fromInput: match,
          pageNumber: match,
          lowerCaseNumber: match.toLowerCase(),
          bookId: primaryTunebook,
        });
        return `${STRING_TO_REPLACE}${numbers.length - 1}`;
      },
    );
  }

  return { textWithoutNumbers, numbers };
};

export const replaceNumbers = (
  text: string,
  primaryTunebook: string,
  isUsingMultipleBooks?: boolean,
  isTopDefault?: boolean,
  isPageBeforeBook?: boolean,
) => {
  const isUsingOnlyOneBook =
    !isUsingMultipleBooks && primaryTunebook !== "none";

  const { textWithoutNumbers, numbers } = isUsingOnlyOneBook
    ? getNumbersFromTextOneBook(text, primaryTunebook)
    : getNumbersFromTextAllBooks(text, primaryTunebook, isPageBeforeBook);

  var textWithNames = textWithoutNumbers;

  numbers.forEach((number, i) => {
    const nameAndNumber = getTuneNameAndNumber(
      number,
      primaryTunebook,
      isTopDefault,
      isPageBeforeBook,
    );

    const regex = new RegExp(STRING_TO_REPLACE + i + "(?!\\d)", "i");

    textWithNames = textWithNames.replace(regex, nameAndNumber);
  });

  // check if any STRING_TO_REPLACEs are left (they shouldn't be, but just in case)
  const regex = new RegExp(STRING_TO_REPLACE + "[0-9]*", "g");
  textWithNames = textWithNames.replaceAll(regex, (match) => {
    console.warn(`${STRING_TO_REPLACE} found! ${match}`);
    return "";
  });

  return textWithNames;
};

export const replaceNumbersAndAddTooltips = (
  text: string,
  primaryTunebook: string,
  isUsingMultipleBooks?: boolean,
  isTopDefault?: boolean,
  isPageBeforeBook?: boolean,
  shouldShowUnmatched?: boolean, // always true, for now
) => {
  const textWithNames = replaceNumbers(
    text,
    primaryTunebook,
    isUsingMultipleBooks,
    isTopDefault,
    isPageBeforeBook,
  );

  const escapedUnknownPageString = UNKNOWN_PAGE_STRING.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  if (shouldShowUnmatched) {
    const regex = new RegExp(`\\b\\d*[tbTB]*${escapedUnknownPageString}`, "g");

    return textWithNames.replaceAll(regex, (match) => {
      const number = match.replace(UNKNOWN_PAGE_STRING, "");
      return `<span data-comments='?' title='Number not found in book(s)' class='no-name'>${number}</span>`;
    });
  } else {
    return textWithNames.replaceAll(UNKNOWN_PAGE_STRING, "");
  }
};
