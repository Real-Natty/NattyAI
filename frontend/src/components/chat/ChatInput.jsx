import { useState } from "react";
import { ArrowUp } from "lucide-react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Message NattyAI..."
        rows={1}
        maxLength={10000}
        disabled={loading}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form.requestSubmit();
          }
        }}
      />

      <button
        type="submit"
        className="chat-send-button"
        disabled={!message.trim() || loading}
        aria-label="Send message"
      >
        <ArrowUp size={20} />
      </button>
    </form>
  );
}

export default ChatInput;
