import { useNavigate } from "react-router-dom";
import { User, Mail, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "N";

  return (
    <main className="settings-page">
      <div className="settings-heading">
        <span className="settings-eyebrow">PREFERENCES</span>
        <h1>Settings</h1>
        <p>Manage your account and workspace.</p>
      </div>

      <section className="settings-card">
        <div className="settings-card-heading">
          <User size={20} />
          <div>
            <h2>Profile information</h2>
            <p>Your personal account details.</p>
          </div>
        </div>

        <div className="settings-profile">
          <div className="settings-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              initial
            )}
          </div>

          <div>
            <h3>{user?.name || "NattyAI User"}</h3>
            <span>NattyAI account</span>
          </div>
        </div>

        <div className="settings-detail">
          <Mail size={18} />
          <div>
            <span>Email address</span>
            <strong>{user?.email || "Not available"}</strong>
          </div>
        </div>

        <div className="settings-detail">
          <ShieldCheck size={18} />
          <div>
            <span>Account status</span>
            <strong>Authenticated</strong>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <ShieldCheck size={20} />
          <div>
            <h2>Account security</h2>
            <p>Your account is protected by NattyAI authentication.</p>
          </div>
        </div>
      </section>

      <section className="settings-card settings-logout-card">
        <div>
          <h2>Sign out</h2>
          <p>Sign out of your NattyAI account on this device.</p>
        </div>

        <button className="settings-logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Log out
        </button>
      </section>
    </main>
  );
}

export default SettingsPage;
