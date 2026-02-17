import { pages19912025 } from "./pages-1991-2025";

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
  const aPage = a.replace("-1991", "");
  const aNumber = Number(aPage.replace(/[a-zA-Z]$/, ""));

  const bPage = b.replace("-1991", "");
  const bNumber = Number(bPage.replace(/[a-zA-Z]$/, ""));

  return aNumber - bNumber;
};

const sortPageNumbers = (pageNumbers: string[]) => {
  return pageNumbers.sort(sortFn);
};

const getPageNumbers = (isShowing91: boolean): string[] => {
  const allPageNumbers = Object.keys(pages19912025);

  if (isShowing91) return allPageNumbers;

  return allPageNumbers.filter(
    (pageNumber) => pageNumber.slice(-5) !== "-1991",
  );
};

export const countPageNumbers = (input: string, isShowing91: boolean) => {
  const pageNumbers = sortPageNumbers(getPageNumbers(isShowing91));

  if (!pageNumbers || pageNumbers.length < 1) {
    console.error("page numbers not found");
    return;
  }

  const allPages: Page[] = [];

  pageNumbers.forEach((pageNumber) => {
    // @ts-ignore
    const pagesInBooks = pages19912025[pageNumber] as string[];

    if (!pagesInBooks) return;

    var count = 0;

    pagesInBooks.forEach((bookPage) => {
      const escapedBookPage = bookPage
        .replace(/\[/, "\\[")
        .replace(/\]/, "\\]");
      const regex = new RegExp(escapedBookPage, "g");

      const matches = input.match(regex);

      count += matches?.length || 0;
    });

    allPages.push({ pageNumber, count });
  });

  return getFormattedText(allPages);
};
