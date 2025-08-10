import { Lightbulb } from "lucide-react";

function TopicStarters({ onSuggest, topics, onPick, loading }) {
  return (
    <div className="p-3 border-b flex items-center justify-between max-w-7xl mx-auto w-full absolute top-24 left-0 right-0 z-10 bg-white/80 backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <button
          onClick={onSuggest}
          disabled={loading}
          className="btn btn-sm bg-cyan-400 text-white disabled:opacity-50"
          title="Suggest conversation topics"
        >
          <Lightbulb className="size-4 mr-1" />
          {loading ? "Thinking..." : "Need a topic for conversation?"}
        </button>
        <span className="text-sm text-slate-500">Topic Starters</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        {(topics || []).map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="px-2 py-1 rounded-full border text-sm hover:bg-gray-50"
            title="Insert topic"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TopicStarters;
