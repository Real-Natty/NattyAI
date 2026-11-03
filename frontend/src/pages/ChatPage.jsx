import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Plus,
  Sparkles,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
  MessagesSquare,
  // PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import ChatWindow from "../components/chat/ChatWindow";
import API_URL from "../services/api";

const STORAGE_KEY = "nattyai-chat-conversations";

function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getSavedConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [createConversation()];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [createConversation()];
    }

    return parsed;
  } catch (error) {
    console.error("Unable to load saved conversations:", error);
    return [createConversation()];
  }
}

function ChatPage() {
  const { token } = useAuth();
  const [conversations, setConversations] = useState(getSavedConversations);

  const [activeChatId, setActiveChatId] = useState(
    () => getSavedConversations()[0]?.id,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const activeConversation =
    conversations.find((chat) => chat.id === activeChatId) || conversations[0];

  const messages = activeConversation?.messages || [];
  const [showChatHistory, setShowChatHistory] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveChatId(conversations[0].id);
    }
  }, [activeConversation, conversations]);

  function updateConversation(chatId, updates) {
    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : chat,
      ),
    );
  }

  function startNewChat() {
    if (loading) return;

    const newConversation = createConversation();

    setConversations((previous) => [newConversation, ...previous]);

    setActiveChatId(newConversation.id);
    setError("");
  }

  function openConversation(chatId) {
    if (loading) return;

    setActiveChatId(chatId);
    setError("");
    setEditingChatId(null);
  }

  function deleteConversation(chatId) {
    if (loading) return;

    const confirmed = window.confirm("Delete this conversation permanently?");

    if (!confirmed) return;

    const remaining = conversations.filter((chat) => chat.id !== chatId);

    if (remaining.length === 0) {
      const newConversation = createConversation();

      setConversations([newConversation]);
      setActiveChatId(newConversation.id);
    } else {
      setConversations(remaining);

      if (activeChatId === chatId) {
        setActiveChatId(remaining[0].id);
      }
    }

    if (editingChatId === chatId) {
      setEditingChatId(null);
    }

    setError("");
  }

  function beginRename(chat) {
    if (loading) return;

    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  }

  function saveRename(chatId) {
    const title = editingTitle.trim();

    if (!title) return;

    updateConversation(chatId, { title });
    setEditingChatId(null);
    setEditingTitle("");
  }

  async function handleSend(message) {
    if (!message.trim() || loading || !activeConversation) {
      return;
    }

    const chatId = activeConversation.id;

    const updatedMessages = [
      ...activeConversation.messages,
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const firstUserMessage = updatedMessages.find(
      (item) => item.role === "user",
    );

    const currentTitle =
      activeConversation.title === "New chat" && firstUserMessage
        ? firstUserMessage.content.slice(0, 40) +
          (firstUserMessage.content.length > 40 ? "..." : "")
        : activeConversation.title;

    updateConversation(chatId, {
      messages: updatedMessages,
      title: currentTitle,
    });

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get an AI response.");
      }

      const completedMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          content: data.response,
        },
      ];

      updateConversation(chatId, {
        messages: completedMessages,
        title: currentTitle,
      });
    } catch (err) {
      console.error("NattyAI chat error:", err);

      setError(
        err.message ||
          "Unable to connect to NattyAI. Check that your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function handleRegenerate() {
    if (loading || !activeConversation) return;

    const chatId = activeConversation.id;
    const currentMessages = activeConversation.messages;

    // Make sure the last message is an AI response.
    if (
      currentMessages.length === 0 ||
      currentMessages[currentMessages.length - 1].role !== "assistant"
    ) {
      return;
    }

    // Remove the previous AI response from the request.
    const previousMessages = currentMessages.slice(0, -1);

    setLoading(true);
    setError("");
    console.log("Token available:", !!token);
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: previousMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to regenerate response.");
      }

      // Replace the previous AI response with the new one.
      updateConversation(chatId, {
        messages: [
          ...previousMessages,
          {
            role: "assistant",
            content: data.response,
          },
        ],
      });
    } catch (err) {
      console.error("NattyAI regeneration error:", err);

      setError(
        err.message || "Unable to regenerate response. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="chat-page chat-page-with-history">
      {" "}
      <div className="chat-page-heading">
        {" "}
        <div>
          {" "}
          <div className="chat-page-eyebrow">
            {" "}
            <Sparkles size={15} />
            NATTYAI CONVERSATIONS{" "}
          </div>
          <h1>AI Chat</h1>
          <p>Think, create, learn, and solve problems with NattyAI.</p>
        </div>
        <button
          type="button"
          className="new-chat-button"
          onClick={startNewChat}
          disabled={loading}
        >
          <Plus size={17} />
          New chat
        </button>
      </div>
      <div
        className={`chat-workspace ${
          showChatHistory ? "" : "chat-history-collapsed"
        }`}
      >
        {showChatHistory && (
          <aside className="chat-history-panel">
            <div className="chat-history-heading">
              <div>
                <MessagesSquare size={17} />
                <span>Conversations</span>
              </div>

              <span className="chat-history-count">{conversations.length}</span>
            </div>

            <button
              type="button"
              className="chat-history-new-button"
              onClick={startNewChat}
              disabled={loading}
            >
              <Plus size={16} />
              Start a new chat
            </button>

            <div className="chat-history-list">
              {conversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-history-item ${
                    chat.id === activeConversation?.id ? "active" : ""
                  }`}
                >
                  {editingChatId === chat.id ? (
                    <form
                      className="chat-rename-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveRename(chat.id);
                      }}
                    >
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(event) =>
                          setEditingTitle(event.target.value)
                        }
                        aria-label="Conversation title"
                        maxLength={80}
                      />

                      <button type="submit" aria-label="Save title">
                        <Check size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label="Cancel renaming"
                        onClick={() => setEditingChatId(null)}
                      >
                        <X size={15} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="chat-history-open"
                        onClick={() => openConversation(chat.id)}
                        disabled={loading}
                      >
                        <MessageSquare size={16} />

                        <span>
                          <span className="chat-history-title">
                            {chat.title}
                          </span>

                          <span className="chat-history-date">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </span>
                        </span>
                      </button>

                      <div className="chat-history-actions">
                        <button
                          type="button"
                          aria-label="Rename conversation"
                          title="Rename"
                          onClick={() => beginRename(chat)}
                          disabled={loading}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          aria-label="Delete conversation"
                          title="Delete"
                          onClick={() => deleteConversation(chat.id)}
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}

        <div className="chat-workspace-main">
          {/* <div className="chat-toolbar">
            <button
              type="button"
              className="chat-panel-toggle"
              onClick={() => setShowChatHistory((previous) => !previous)}
              aria-label={
                showChatHistory
                  ? "Hide conversation history"
                  : "Show conversation history"
              }
              title={
                showChatHistory
                  ? "Hide conversation history"
                  : "Show conversation history"
              }
            >
              {showChatHistory ? (
                <PanelLeftClose size={19} />
              ) : (
                <PanelLeftOpen size={19} />
              )}
            </button>

            <span className="chat-toolbar-title">
              {activeConversation?.title || "AI Chat"}
            </span>

            <button
              type="button"
              className="chat-toolbar-new"
              onClick={startNewChat}
              disabled={loading}
              title="New chat"
            >
              <Plus size={17} />
              <span>New chat</span>
            </button>
          </div> */}
          <div className="chat-toolbar">
            <button
              type="button"
              className="chat-panel-toggle"
              onClick={() => setShowChatHistory((previous) => !previous)}
              aria-label={showChatHistory ? "Hide history" : "Show history"}
              title={showChatHistory ? "Hide history" : "Show history"}
            >
              {showChatHistory ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeftOpen size={18} />
              )}
            </button>

            <span className="chat-toolbar-title">
              {activeConversation?.title || "AI Chat"}
            </span>

            <button
              type="button"
              className="chat-toolbar-new"
              onClick={startNewChat}
              disabled={loading}
            >
              <Plus size={15} />
              New chat
            </button>
          </div>
          <ChatWindow
            key={activeConversation?.id}
            messages={messages}
            onSend={handleSend}
            onRegenerate={handleRegenerate}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
}

export default ChatPage;
