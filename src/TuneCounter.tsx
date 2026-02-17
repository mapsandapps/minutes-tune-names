import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./App.css";
import { tunebooks } from "./tunebooks.ts";
import { countPageNumbers } from "./tune-counter-helpers.ts";
import { Analytics } from "@vercel/analytics/react";

function TuneCounter() {
  const [tunebook, setTunebook] = useState("denson2025"); // can be "denson1991", "denson2025", or "both"
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const tunebooksToShow = tunebooks.filter(
    (tunebook) => tunebook.id === "denson2025" || tunebook.id === "denson1991",
  );

  useEffect(() => {
    setOutput(countPageNumbers(input, tunebook));
  }, [input, tunebook]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  const copyToClipboard = () => {
    var copyText = document.getElementsByClassName("output")[0].textContent;

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <>
      <h1>Minutes Tune Counter</h1>
      <p>
        Counts the number of times each page number is included in the minutes.
        Paste in minutes results from{" "}
        <a
          href="https://lite.datasette.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmarktgodfrey%2Ffasolaminutes_parsing%2Fmaster%2Fminutes.db#/minutes"
          target="_blank"
        >
          querying the database
        </a>
        .
      </p>
      <label>
        Book:
        <select value={tunebook} onChange={(e) => setTunebook(e.target.value)}>
          {tunebooksToShow.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
          <option key="both" value="both">
            Both
          </option>
        </select>
      </label>
      <label>
        Input:
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Put text of all minutes here"
          rows={16}
          cols={64}
        />
      </label>
      <div>
        <div className="output-label">
          Output:
          {output && (
            <button onClick={copyToClipboard}>
              {copied ? "Copied ✅" : "Copy to clipboard"}
            </button>
          )}
        </div>
        <div
          className={`output ${!output && "placeholder"}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(output || "The counts will appear here"),
          }}
        ></div>
      </div>
      <Analytics />
    </>
  );
}

export default TuneCounter;
