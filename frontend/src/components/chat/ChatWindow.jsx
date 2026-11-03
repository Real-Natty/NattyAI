import { useEffect, useRef } from "react";
import { MessageSquare, Sparkles } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, onSend, loading, error, onRegenerate }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const lastAssistantIndex = messages.reduce(
    (lastIndex, message, index) =>
      message.role === "assistant" ? index : lastIndex,
    -1,
  );

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <h2>NattyAI Assistant</h2>
          <span>Your intelligent AI companion</span>
        </div>

        <div className="chat-status">
          <span className="chat-status-dot" />
          {loading ? "Generating response" : "Ready to help"}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <MessageSquare size={30} />
            </div>

            <h2>What can I help you with?</h2>

            <p>
              Ask questions,learn something new, solve problems, or brainstorm
              your next big idea.
            </p>

            <div className="chat-suggestions">
              {[
                "How to prepare Afang soup",
                "Create a professional blog post ",
                "Give me business ideas for Nigeria",
                "Help me write a professional email",
              ].map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => onSend(suggestion)}
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={`${index}-${message.role}`}
              message={message}
              onRegenerate={
                index === lastAssistantIndex ? onRegenerate : undefined
              }
              isLastAssistantMessage={index === lastAssistantIndex}
            />
          ))
        )}

        {loading && (
          <div className="chat-typing">
            <Sparkles size={17} />
            NattyAI is thinking...
          </div>
        )}

        {error && <div className="chat-error">{error}</div>}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <ChatInput onSend={onSend} loading={loading} />

        <p>NattyAI can make mistakes. Check important information.</p>
      </div>
    </div>
  );
}

export default ChatWindow;
