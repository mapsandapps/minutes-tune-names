import { useEffect, useState } from "react";
import "./App.css";
import { tunebooks } from "./tunebooks.ts";
import Instructions from "./Instructions.tsx";

function App() {
  const [tunebook, setTunebook] = useState("denson2025"); // can be "none", as well as any tunebook from `tunebooks`
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [isUsingMultipleBooks, setUsingMultipleBooks] =
    useState<boolean>(false);

  // find numbers
  // if the number has a tunebook abbreviation before it, replace it from that page in the book
  // if the number does not have a tunebook abbreviation before it, AND there is a primary book, replace the number with the page in the primary book
  // ignore all other numbers
  const replaceNumbersFromAllBooks = () => {
    var text = input;
    // replace numbers that have a book abbreviation before them
    tunebooks.forEach((book) => {
      if (book.id === tunebook) return; // we will handle the primary book later

      const bookMap = book.data;

      const regex = new RegExp(book.abbreviation + " " + "\\d+[tb]*", "g");

      text = text.replace(regex, (match) => {
        const pageNumber = match.replace(`${book.abbreviation} `, "");
        // @ts-ignore
        return bookMap[pageNumber] ? `${match} ${bookMap[pageNumber]}` : match;
      });
    });

    // if there is no primary book, we're done
    if (tunebook === "none") return text;

    // if there is a primary book, replace numbers that have no abbreviation before them
    const abbreviations = tunebooks
      .map((book) => `${book.abbreviation} `)
      .filter(Boolean); // `.filter(Boolean) removes falsy values
    const pattern = `(?<!${abbreviations.join("|")})\\d+[tb]*`;
    const primaryBookRegex = new RegExp(pattern, "g");

    const bookData = tunebooks.find((book) => book.id === tunebook);
    if (!bookData) return text;
    const bookMap = bookData.data;

    text = text.replace(primaryBookRegex, (match) => {
      // @ts-ignore
      return bookMap[match] ? `${match} ${bookMap[match]}` : match;
    });

    return text;
  };

  const replaceNumbersFromPrimaryBook = () => {
    if (!input) {
      setOutput("");
      return;
    }

    const bookData =
      tunebooks.find((book) => book.id === tunebook) || tunebooks[0];
    const bookMap = bookData.data;

    return input.replace(/\d+[tb]*/g, (match) => {
      // @ts-ignore
      return bookMap[match] ? `${match} ${bookMap[match]}` : match;
    });
  };

  const replaceNumbersInText = () => {
    if (tunebook === "none" || isUsingMultipleBooks) {
      setOutput(replaceNumbersFromAllBooks());
    } else {
      setOutput(replaceNumbersFromPrimaryBook());
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onChangeUsingMultipleBooks = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUsingMultipleBooks(e.target.checked);
  };

  useEffect(() => {
    replaceNumbersInText();
  }, [input, isUsingMultipleBooks, tunebook]);

  return (
    <>
      <Instructions />
      <label>
        The primary book of the singing:
        <select value={tunebook} onChange={(e) => setTunebook(e.target.value)}>
          {tunebooks.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
          <option value="none">None</option>
        </select>
      </label>
      <label>
        Was more than one tunebook used?
        <input
          type="checkbox"
          checked={isUsingMultipleBooks}
          onChange={onChangeUsingMultipleBooks}
        />
      </label>
      <label>
        Input:
        <textarea
          value={input}
          onChange={onChangeInput}
          placeholder="Put your minutes without tune names here"
          rows={16}
          cols={64}
        />
      </label>
      <label>
        Output:
        <textarea
          value={output}
          disabled
          rows={16}
          cols={64}
          placeholder="Your minutes will appear here with tune names added"
        />
      </label>
    </>
  );
}

export default App;
