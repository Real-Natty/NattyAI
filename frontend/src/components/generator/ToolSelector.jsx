import { tools } from "../../data/aiTools";

function ToolSelector({ activeTool, onSelectTool }) {
  return (
    <>
      <div className="tool-selector">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              className={`tool-option ${
                activeTool === tool.id ? "selected" : ""
              }`}
              onClick={() => onSelectTool(tool.id)}
            >
              <span className={`tool-icon ${tool.color}`}>
                <Icon size={19} />
              </span>

              <span className="tool-option-text">{tool.title}</span>

              {activeTool === tool.id && (
                <span className="selected-indicator" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default ToolSelector;
