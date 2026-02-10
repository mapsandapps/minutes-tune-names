import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./App.css";
import { tunebooks } from "./tunebooks.ts";
import Instructions from "./Instructions.tsx";
import { replaceNumbersAndAddTooltips } from "./helpers.ts";

function App() {
  const [tunebook, setTunebook] = useState("denson2025"); // can be "none", as well as any tunebook from `tunebooks`
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [isUsingMultipleBooks, setUsingMultipleBooks] =
    useState<boolean>(false);
  const [isTopDefault, setTopDefault] = useState<boolean>(false);
  const [bookPageOrder, setBookPageOrder] = useState("book-before-page");

  useEffect(() => {
    setOutput(
      replaceNumbersAndAddTooltips(
        input,
        tunebook,
        isUsingMultipleBooks,
        isTopDefault,
        bookPageOrder === "page-before-book",
        true,
      ),
    );
  }, [bookPageOrder, input, isTopDefault, isUsingMultipleBooks, tunebook]);

  return (
    <>
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
          onChange={(e) => setUsingMultipleBooks(e.target.checked)}
        />
      </label>
      {isUsingMultipleBooks && (
        <>
          <div className="book-page-order">
            Book format:
            <label>
              <input
                type="radio"
                name="book-format"
                value="book-before-page"
                checked={bookPageOrder === "book-before-page"}
                onChange={(e) => setBookPageOrder(e.target.value)}
              />
              Book before page, e.g. <code>ShH 278</code>
            </label>
            <label>
              <input
                type="radio"
                name="book-format"
                value="page-before-book"
                checked={bookPageOrder === "page-before-book"}
                onChange={(e) => setBookPageOrder(e.target.value)}
              />
              Page before book, e.g. <code>278 (ShH)</code>
            </label>
          </div>

          <Instructions />
        </>
      )}
      <details className="advanced-settings">
        <summary>Advanced settings</summary>

        <label>
          Are top-piece songs not explicitly marked? (e.g. should we assume SH
          "45" is 45t New Britain?)
          <input
            type="checkbox"
            checked={isTopDefault}
            onChange={(e) => setTopDefault(e.target.checked)}
          />
        </label>
      </details>
      <label>
        Input:
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Put your minutes without tune names here"
          rows={16}
          cols={64}
        />
      </label>
      <label>
        Output:
        <div
          className="output"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(output || "") }}
        ></div>
      </label>
    </>
  );
}

export default App;
