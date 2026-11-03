import { Zap, WandSparkles } from "lucide-react";

import ToolSelector from "./ToolSelector";
import PromptForm from "./PromptForm";
import GeneratedContent from "./GeneratedContent";

function GeneratorCard({
  tools,
  selectedTool,
  activeTool,
  onSelectTool,
  prompt,
  setPrompt,
  onGenerate,
  result,
  loading,
}) {
  return (
    <section className="generator-card">
      <div className="generator-header">
        <div>
          <div className="section-eyebrow">CREATE SOMETHING AMAZING</div>

          <h2>What are we creating today?</h2>
        </div>

        <div className="sparkle-decoration">
          <WandSparkles size={25} />
        </div>
      </div>

      <ToolSelector activeTool={activeTool} onSelectTool={onSelectTool} />

      <div className="selected-tool-description">
        {selectedTool.description}
      </div>

      <PromptForm
        prompt={prompt}
        setPrompt={setPrompt}
        placeholder={selectedTool.placeholder}
        onGenerate={onGenerate}
        loading={loading}
      />

      <GeneratedContent result={result} />

      <div className="privacy-note">
        <Zap size={14} />
        Your next great idea is just one prompt away.
      </div>
    </section>
  );
}

export default GeneratorCard;
