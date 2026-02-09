import { useEffect, useState } from "react";
import "./App.css";
import { tunebooks } from "./tunebooks.ts";
import Instructions from "./Instructions.tsx";
import {
  replaceNumbersFromAllBooks,
  replaceNumbersFromPrimaryBook,
} from "./helpers.ts";

function App() {
  const [tunebook, setTunebook] = useState("denson2025"); // can be "none", as well as any tunebook from `tunebooks`
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [isUsingMultipleBooks, setUsingMultipleBooks] =
    useState<boolean>(false);

  const replaceNumbersInText = () => {
    if (tunebook === "none" || isUsingMultipleBooks) {
      setOutput(replaceNumbersFromAllBooks(input, tunebook));
    } else {
      setOutput(replaceNumbersFromPrimaryBook(input, tunebook));
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
