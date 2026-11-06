import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  LayoutDashboard,
  History,
  Settings,
  X,
  Zap,
  ChevronRight,
  MessageSquare,
  PanelLeftClose,
  Image,
} from "lucide-react";

import { tools } from "../../data/aiTools";

function Sidebar({
  activeTool,
  mobileMenu,
  sidebarCollapsed,
  onToggleSidebar,
  onSelectTool,
  onClose,
  onOpenHistory,
  showHistory,
  onOpenChat,
  showChat,
  onOpenSettings,
  showSettings,
  onOpenImageGenerator,
  showImageGenerator,
}) {
  const { user } = useAuth();
  return (
    <>
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${mobileMenu ? "sidebar-open" : ""} ${
          sidebarCollapsed ? "sidebar-desktop-hidden" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={23} />
          </div>

          <span className="brand-name">
            Natty<span className="brand-highlight">AI</span>
          </span>

          <button
            type="button"
            className="close-sidebar desktop-sidebar-toggle"
            aria-label="Collapse navigation sidebar"
            title="Collapse sidebar"
            onClick={onToggleSidebar}
          >
            <PanelLeftClose size={19} />
          </button>

          <button
            type="button"
            className="close-sidebar mobile-sidebar-toggle"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              activeTool === "social" &&
              !showChat &&
              !showHistory &&
              !showSettings
                ? "active"
                : ""
            }`}
            onClick={() => onSelectTool("social")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${showChat ? "active" : ""}`}
            onClick={onOpenChat}
          >
            <MessageSquare size={19} />
            <span>AI Chat</span>
          </button>
          <button
            className={`nav-item ${showImageGenerator ? "active" : ""}`}
            onClick={onOpenImageGenerator}
          >
            <Image size={19} />
            <span>Image Generator</span>
          </button>

          <div className="nav-section-label">AI TOOLS</div>

          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={`nav-item ${
                  activeTool === tool.id &&
                  !showChat &&
                  !showHistory &&
                  !showSettings
                    ? "tool-active"
                    : ""
                }`}
                onClick={() => onSelectTool(tool.id)}
              >
                <Icon size={19} />
                <span>{tool.title}</span>
              </button>
            );
          })}

          <div className="nav-section-label">YOUR SPACE</div>

          <button
            className={`nav-item ${showHistory ? "active" : ""}`}
            onClick={onOpenHistory}
          >
            <History size={19} />
            <span>Content History</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Zap size={18} />
            </div>

            <h3>Your ideas, amplified.</h3>

            <p>Turn your thoughts into content that stands out.</p>

            <button onClick={() => onSelectTool("blog")}>
              Explore AI tools
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "N"
              )}
            </div>

            <div className="profile-info">
              <strong>{user?.name || "NattyAI User"}</strong>
              <span>Creator workspace</span>
            </div>

            <button
              type="button"
              className={`profile-settings ${showSettings ? "active" : ""}`}
              onClick={onOpenSettings}
              title="Settings"
              aria-label="Open settings"
            >
              <Settings size={19} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
