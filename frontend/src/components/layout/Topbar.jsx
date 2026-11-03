import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar({ selectedTool, onOpenMenu }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <button
        className="menu-button"
        aria-label="Open navigation"
        onClick={onOpenMenu}
      >
        <Menu size={23} />
      </button>

      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{selectedTool.title}</strong>
      </div>

      <div className="topbar-right">
        <div className="status-indicator">
          <span className="status-dot" />
          AI workspace
        </div>

        <div className="topbar-avatar" title={user?.name || "NattyAI user"}>
          {user?.name?.charAt(0).toUpperCase() || "N"}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
