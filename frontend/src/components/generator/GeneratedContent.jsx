import { useState } from "react";
import { Sparkles, Download } from "lucide-react";

function GeneratedContent({ result }) {
  const [copied, setCopied] = useState(false);

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
      setCopied(false);
    }
  }

  function downloadResult() {
    const blob = new Blob([result], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "NattyAI-Generated-Content.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  if (!result) {
    return null;
  }

  return (
    <div className="result-box">
      {" "}
      <div className="result-heading">
        {" "}
        <div className="result-title">
          {" "}
          <Sparkles size={18} />
          NattyAI response{" "}
        </div>
        <div className="result-actions">
          <button type="button" className="copy-button" onClick={copyResult}>
            {copied ? "Copied!" : "Copy response"}
          </button>

          <button
            type="button"
            className="copy-button"
            onClick={downloadResult}
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
      <p>{result}</p>
    </div>
  );
}

export default GeneratedContent;
