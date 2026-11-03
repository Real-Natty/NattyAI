import { ChevronRight } from "lucide-react";

import { tools } from "../../data/aiTools";

function ToolsSection({ activeTool, onSelectTool }) {
  return (
    <section className="tools-section">
      <div className="tools-section-heading">
        <div>
          <div className="section-eyebrow">YOUR CREATIVE TOOLKIT</div>

          <h2>Explore your AI tools</h2>

          <p>Everything you need to bring your ideas to life.</p>
        </div>

        <span className="tools-count">
          {String(tools.length).padStart(2, "0")} TOOLS
        </span>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => {
          const Icon = tool.icon;

          return (
            <button
              className={`tool-card ${
                activeTool === tool.id ? "card-selected" : ""
              }`}
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <div className={`tool-card-icon ${tool.color}`}>
                <Icon size={23} />
              </div>

              <span className="card-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{tool.title}</h3>

              <p>{tool.description}</p>

              <div className="card-action">
                Open tool
                <ChevronRight size={17} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ToolsSection;
