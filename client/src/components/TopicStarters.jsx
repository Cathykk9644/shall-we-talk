import { Lightbulb } from "lucide-react";

function TopicStarters({ onSuggest, topics, onPick, loading }) {
  return (
    <div
      className="p-3 border-b max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-md z-10 rounded-md shadow-sm
                 flex flex-col gap-2 md:flex-row md:items-center md:justify-between
                 static md:absolute md:top-24 left-0 right-0"
      role="region"
      aria-label="AI topic starters"
    >
      <div className="flex gap-2 items-center min-w-0">
        <button
          onClick={onSuggest}
          disabled={loading}
          className="btn btn-sm bg-cyan-500 text-white disabled:opacity-50"
          title="Suggest conversation topics"
        >
          <Lightbulb className="size-4 mr-1" />
          {loading ? "Thinking..." : "Need a topic for conversation?"}
        </button>
        <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline">
          Topic Starters
        </span>
      </div>
      <div
        className="flex flex-col gap-2 items-stretch
                   sm:flex-row sm:flex-wrap sm:justify-end sm:items-center"
        role="list"
        aria-label="Suggested topics"
      >
        {(topics || []).map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="px-3 py-2 rounded-md border text-sm text-left w-full sm:w-auto sm:text-xs sm:py-1 sm:rounded-full hover:bg-gray-50"
            title="Insert topic"
            role="listitem"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TopicStarters;
