import { tunebooks } from "./tunebooks.ts";

export default function Instructions() {
  return (
    <details>
      <summary>💡 Click here for instructions!</summary>
      <ul>
        <li>
          If only one book was used, simply select that book in the dropdown and
          then paste your minutes in the input!
        </li>
        <li>
          If using more than one book, generally (see below for what to do if
          this is not the case), you will have one book for which no
          abbreviation is used and any other books will include the abbreviation
          before the number. The book with no abbreviation should be selected as
          the "primary book", and the "more than one tunebook" box should be
          checked.
        </li>
        <li>
          Book abbreviations:
          {tunebooks.map((book) => {
            if (!book.abbreviation) return;

            return (
              <div>
                {book.name}: {book.abbreviation}
              </div>
            );
          })}
        </li>
        <li>
          <b>What is a "primary book"?</b> If page numbers of one book are not
          prefaced with the book abbreviation, that is the primary book. If{" "}
          <i>all</i> the tunes led are prefaced with abbreviations, then there
          is no primary book, and you'll need to select "None" in the primary
          book dropdown.
        </li>
        <li>
          Note: the app does not really know what numbers are and aren't page
          numbers. It's probably best to not include any announcements, etc.
          when using this, and instead add those later. Otherwise, your singing
          on "February 26" will end up being your singing on "February 26
          Samaria". 😉
        </li>
      </ul>
    </details>
  );
}
