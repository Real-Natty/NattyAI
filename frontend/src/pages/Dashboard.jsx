import { useState } from "react";
import { PanelLeft, Image as ImageIcon } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Footer from "../components/layout/Footer";

import WelcomeSection from "../components/generator/WelcomeSection";
import GeneratorCard from "../components/generator/GeneratorCard";

import ToolsSection from "../components/tools/ToolsSection";
import HistorySection from "../components/history/HistorySection";

import ChatPage from "./ChatPage";
import SettingsPage from "./Settings";
import { tools } from "../data/aiTools";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";
import ImageGenerator from "../components/imageGenerator/ImageGenerator";

const HISTORY_KEY = "nattyai-history";
const MAX_HISTORY = 50;

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load content history:", error);
    return [];
  }
}

function Dashboard() {
  const { token } = useAuth();
  const [activeTool, setActiveTool] = useState("social");
  const [prompt, setPrompt] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const selectedTool = tools.find((tool) => tool.id === activeTool);

  function saveHistory(entry) {
    setHistory((previousHistory) => {
      const updatedHistory = [
        entry,
        ...previousHistory.filter((item) => item.id !== entry.id),
      ].slice(0, MAX_HISTORY);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Could not save content history:", error);
      }

      return updatedHistory;
    });
  }

  function selectTool(toolId) {
    setActiveTool(toolId);
    setPrompt("");
    setResult("");
    setMobileMenu(false);
    setShowHistory(false);
    setShowChat(false);
    setShowSettings(false);
    setShowImageGenerator(false);
  }

  async function handleGenerate() {
    if (!prompt.trim() || loading) {
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tool: activeTool,
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate content.");
      }

      setResult(data.content);

      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        tool: activeTool,
        toolTitle: selectedTool?.title || activeTool,
        prompt: prompt.trim(),
        content: data.content,
        createdAt: new Date().toISOString(),
      };

      saveHistory(entry);
    } catch (error) {
      console.error("NattyAI generation error:", error);

      setResult(
        error.message ||
          "Unable to connect to NattyAI. Please check that your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  function openHistory() {
    setShowHistory(true);
    setShowChat(false);
    setShowSettings(false);
    setMobileMenu(false);
  }

  function restoreHistory(entry) {
    setActiveTool(entry.tool);
    setPrompt(entry.prompt);
    setResult(entry.content);
    setShowHistory(false);
    setShowChat(false);
    setMobileMenu(false);
  }

  function deleteHistory(id) {
    setHistory((previousHistory) => {
      const updatedHistory = previousHistory.filter((entry) => entry.id !== id);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Could not update content history:", error);
      }

      return updatedHistory;
    });
  }

  function clearHistory() {
    setHistory([]);

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    } catch (error) {
      console.error("Could not clear content history:", error);
    }
  }

  function openChat() {
    setShowChat(true);
    setShowHistory(false);
    setShowSettings(false);
    setMobileMenu(false);
  }
  function openSettings() {
    setShowSettings(true);
    setShowChat(false);
    setShowHistory(false);
    setMobileMenu(false);
  }
  function openImageGenerator() {
    setShowImageGenerator(true);
    setShowChat(false);
    setShowHistory(false);
    setShowSettings(false);
    setMobileMenu(false);
  }

  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      setMobileMenu((previous) => !previous);
    } else {
      setSidebarCollapsed((previous) => !previous);
    }
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        activeTool={activeTool}
        mobileMenu={mobileMenu}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((previous) => !previous)}
        onSelectTool={selectTool}
        onClose={() => setMobileMenu(false)}
        onOpenHistory={openHistory}
        showHistory={showHistory}
        onOpenChat={openChat}
        showChat={showChat}
        onOpenSettings={openSettings}
        showSettings={showSettings}
        onOpenImageGenerator={openImageGenerator}
        showImageGenerator={showImageGenerator}
      />

      <main className="main-content">
        {" "}
        <Topbar selectedTool={selectedTool} onOpenMenu={toggleSidebar} />
        {sidebarCollapsed && (
          <button
            type="button"
            className="dashboard-sidebar-reopen"
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Open navigation sidebar"
            title="Open navigation sidebar"
          >
            <PanelLeft size={19} />
          </button>
        )}
        <div className="page-content">
          {showSettings ? (
            <SettingsPage />
          ) : showChat ? (
            <ChatPage />
          ) : showImageGenerator ? (
            <ImageGenerator />
          ) : showHistory ? (
            <HistorySection
              history={history}
              onRestore={restoreHistory}
              onDelete={deleteHistory}
              onClear={clearHistory}
            />
          ) : (
            <>
              <WelcomeSection />

              <GeneratorCard
                selectedTool={selectedTool}
                activeTool={activeTool}
                onSelectTool={selectTool}
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                result={result}
                loading={loading}
              />

              <ToolsSection activeTool={activeTool} onSelectTool={selectTool} />
            </>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
