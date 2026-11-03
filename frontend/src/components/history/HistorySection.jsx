import {
  History,
  Sparkles,
  RotateCcw,
  Trash2,
  Clock,
  FileText,
  Trash,
} from "lucide-react";

function HistorySection({ history, onRestore, onDelete, onClear }) {
  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function confirmClearHistory() {
    if (history.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all your content history? This cannot be undone.",
    );

    if (confirmed) {
      onClear();
    }
  }

  return (
    <section className="history-page">
      {" "}
      <div className="history-page-header">
        {" "}
        <div>
          {" "}
          <div className="history-eyebrow">
            {" "}
            <Sparkles size={15} />
            YOUR WORKSPACE{" "}
          </div>
          <h1>Content History</h1>
          <p>
            Revisit your previous AI generations and continue where you left
            off.
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className="history-clear-button"
            onClick={confirmClearHistory}
          >
            <Trash size={16} />
            Clear history
          </button>
        )}
      </div>
      <div className="history-summary">
        <History size={20} />

        <div>
          <strong>{history.length}</strong>
          <span>
            {history.length === 1 ? " saved generation" : " saved generations"}
          </span>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">
            <FileText size={30} />
          </div>

          <h2>No content history yet</h2>

          <p>
            Once you generate content with NattyAI, your previous prompts and
            responses will appear here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <article className="history-card" key={entry.id}>
              <div className="history-card-header">
                <div className="history-tool">
                  <Sparkles size={17} />

                  <span>{entry.toolTitle || entry.tool}</span>
                </div>

                <div className="history-date">
                  <Clock size={14} />
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
              </div>

              <div className="history-card-body">
                <h3>{entry.prompt}</h3>

                <p className="history-preview">
                  {entry.content.length > 220
                    ? `${entry.content.slice(0, 220)}...`
                    : entry.content}
                </p>
              </div>

              <div className="history-card-actions">
                <button
                  type="button"
                  className="history-restore-button"
                  onClick={() => onRestore(entry)}
                >
                  <RotateCcw size={15} />
                  Restore content
                </button>

                <button
                  type="button"
                  className="history-delete-button"
                  aria-label="Delete this history entry"
                  title="Delete this entry"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HistorySection;
