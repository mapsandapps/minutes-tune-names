import { tunebooks } from "./tunebooks.ts";
import "./App.css";

export default function Instructions() {
  return (
    <details className="instructions">
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
          <table>
            <thead>
              <tr>
                <td>Book</td>
                <td>Book before page</td>
                <td>Page before book</td>
              </tr>
            </thead>
            <tbody>
              {tunebooks.map((book) => {
                return (
                  <tr key={`book-row-${book.id}`}>
                    <td>{book.name}</td>
                    <td className={book.prefix ? "" : "no-prefix"}>
                      {book.prefix || "N/A"}
                    </td>
                    <td>{book.suffix}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </li>
        <li>
          Example of two tunebooks
          <img src="/screenshot.png" />
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
        <li>
          Want more books to be included? Send a list of page numbers and tune
          names for additional books to shawn -at- mapsandapps -dot- net and I
          will be happy to add them. Any editable text format is fine.
        </li>
      </ul>
    </details>
  );
}
