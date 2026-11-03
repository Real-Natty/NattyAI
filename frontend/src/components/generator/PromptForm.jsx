import { Sparkles, ArrowUp } from "lucide-react";

function PromptForm({
  prompt,
  setPrompt,
  placeholder,
  onGenerate,
  loading = false,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
    >
      <label htmlFor="prompt" className="prompt-label">
        YOUR PROMPT
      </label>

      <div className="prompt-box">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
          rows={4}
        />

        <div className="prompt-footer">
          <span className="character-count">{prompt.length} characters</span>

          <button
            type="submit"
            className="generate-button"
            disabled={!prompt.trim() || loading}
          >
            <Sparkles size={17} />

            {loading ? "Generating..." : "Generate content"}

            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default PromptForm;
