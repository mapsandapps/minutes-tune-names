import { tunebooks } from "./tunebooks";

interface Page {
  pageNumber: string;
  count: number;
}

const getFormattedText = (allPages: Page[]) => {
  var text = "";
  allPages.forEach((page) => {
    text += page.pageNumber + " " + page.count;
    text += "\n";
  });

  return text;
};

const sortFn = (a: string, b: string) => {
  const isATop = a.at(-1) === "t";
  const isABottom = a.at(-1) === "b";
  const isAFullPage = !isATop && !isABottom;
  const aNumber = Number(a.replace(/[a-zA-Z]$/, ""));
  const isBTop = b.at(-1) === "t";
  const isBBottom = b.at(-1) === "b";
  const isBFullPage = !isBTop && !isBBottom;
  const bNumber = Number(b.replace(/[a-zA-Z]$/, ""));

  // we can potentially have top, bottom, and full page, since we're combining books
  if (aNumber === bNumber) {
    if (isAFullPage) return -1;
    if (isBFullPage) return 1;
    return isATop ? -1 : 1;
  }

  return aNumber - bNumber;
};

const sortPageNumbers = (pageNumbers: string[]) => {
  return pageNumbers.sort(sortFn);
};

const getPageNumbers = (bookId: string): string[] => {
  const denson1991 = tunebooks.find((book) => book.id === "denson1991");
  const denson2025 = tunebooks.find((book) => book.id === "denson2025");

  var keys: string[] = [];

  if (bookId === "denson1991" || bookId === "both") {
    keys = [...keys, ...Object.keys(denson1991?.data || [])];
  }
  if (bookId === "denson2025" || bookId === "both") {
    keys = [...keys, ...Object.keys(denson2025?.data || [])];
  }

  return [...new Set(keys)];
};

export const countPageNumbers = (input: string, bookId: string) => {
  const pageNumbers = sortPageNumbers(getPageNumbers(bookId));

  if (!pageNumbers || pageNumbers.length < 1) {
    console.error("page numbers not found");
    return;
  }

  const allPages: Page[] = [];

  pageNumbers.forEach((pageNumber) => {
    const years =
      bookId === "both" ? ["1991", "2025"] : [bookId.replace("denson", "")];
    const regex = new RegExp(
      "\\[" + pageNumber + "-" + years.join("|") + "\\]",
      "g",
    );
    const matches = input.match(regex);

    allPages.push({ pageNumber, count: matches ? matches.length : 0 });
  });

  return getFormattedText(allPages);
};
