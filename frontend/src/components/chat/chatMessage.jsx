import { useState } from "react";
import { Sparkles, User, Copy, Check } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ message, onRegenerate, isLastAssistantMessage }) {
  const isAssistant = message.role === "assistant";

  const [copied, setCopied] = useState(false);

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy text:", error);
    }
  }

  function CodeBlock({ children, className }) {
    const code = String(children).replace(/\n$/, "");

    return (
      <div className="chat-code-block">
        <div className="chat-code-header">
          <span>{className?.replace("language-", "") || "Code"}</span>

          <button
            type="button"
            onClick={() => copyText(code)}
            className="chat-code-copy"
            title="Copy code"
          >
            <Copy size={14} />
            Copy
          </button>
        </div>

        <pre>
          <code className={className || ""}>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`chat-message ${
        isAssistant ? "assistant-message" : "user-message"
      }`}
    >
      <div className="chat-message-avatar">
        {isAssistant ? <Sparkles size={18} /> : <User size={18} />}
      </div>

      <div className="chat-message-content">
        <span className="chat-message-author">
          {isAssistant ? "NattyAI" : "You"}
        </span>

        {isAssistant ? (
          <>
            <div className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p>{children}</p>,

                  code: ({ children, className }) => {
                    const isBlock = Boolean(className);

                    if (!isBlock) {
                      return (
                        <code className="chat-inline-code">{children}</code>
                      );
                    }

                    return (
                      <CodeBlock className={className}>{children}</CodeBlock>
                    );
                  },

                  pre: ({ children }) => <>{children}</>,

                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content || ""}
              </ReactMarkdown>
            </div>

            <div className="chat-message-actions">
              <button
                type="button"
                onClick={() => copyText(message.content || "")}
                title="Copy response"
                className="chat-action-button"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy response"}
              </button>

              {isLastAssistantMessage && onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="chat-action-button"
                  title="Regenerate response"
                >
                  <Sparkles size={15} />
                  Regenerate
                </button>
              )}
            </div>
          </>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
