import { Sparkles } from "lucide-react";

function SmartReplies({ onSuggest, suggestions, onPick, loading }) {
  return (
    <div className="p-3 border-b flex items-center justify-between max-w-7xl mx-auto w-full absolute top-12 left-0 right-0 z-10 bg-white/80 backdrop-blur-md">
      <div className="flex gap-2 items-center">
        <button
          onClick={onSuggest}
          disabled={loading}
          className="btn btn-sm bg-sky-500 text-white disabled:opacity-50"
          title="Get AI reply suggestions"
        >
          <Sparkles className="size-4 mr-1" />
          {loading ? "Thinking..." : "Reply like this..."}
        </button>
        <span className="text-sm text-slate-500">Gen AI Suggestions</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        {(suggestions || []).map((s, i) => (
          <button
            key={i}
            onClick={() => onPick(s)}
            className="px-2 py-1 rounded-full border text-sm hover:bg-gray-50"
            title="Insert suggestion"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SmartReplies;
