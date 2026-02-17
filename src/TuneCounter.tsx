import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./App.css";
import { countPageNumbers } from "./tune-counter-helpers.ts";
import { Analytics } from "@vercel/analytics/react";

function TuneCounter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [isShowing91, setShowing91] = useState<boolean>(false);

  useEffect(() => {
    setOutput(countPageNumbers(input, isShowing91));
  }, [input, isShowing91]);

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
        This app counts the number of times each page number is included in the
        minutes. Paste in minutes results from{" "}
        <a
          href="https://lite.datasette.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmarktgodfrey%2Ffasolaminutes_parsing%2Fmaster%2Fminutes.db#/minutes"
          target="_blank"
        >
          querying the database
        </a>
        . Page numbers should look like <code>[218-1991]</code>.
      </p>
      <p>
        The results are "smart", combining minutes from the 1991 and 2025 into
        the 2025 page number. For example, 330b Fellowship in the 1991 gets
        combined with 330t Fellowship in the 2025, to get listed just as "330t".
      </p>
      <label>
        Show songs not in the 2025 Sacred Harp
        <input
          type="checkbox"
          checked={isShowing91}
          onChange={(e) => setShowing91(e.target.checked)}
        />
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
