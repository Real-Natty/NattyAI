import { Sparkles } from "lucide-react";

function WelcomeSection() {
  return (
    <section className="welcome-section">
      <div className="welcome-badge">
        <Sparkles size={14} />
        YOUR CREATIVE AI WORKSPACE
      </div>

      <h1>
        Big ideas deserve
        <br />
        <span className="gradient-text">better words.</span>
      </h1>

      <p className="welcome-description">
        Meet your new creative partner. Turn simple thoughts into powerful
        content in seconds.
      </p>
    </section>
  );
}

export default WelcomeSection;
