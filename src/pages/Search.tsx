import { useState } from "react";
import initialTokens from "../data/tokens.json";
import initialComponents from "../data/components.json";
import initialChangelog from "../data/changelog.json";

type SearchResult = {
  id: string;
  type: "Token" | "Component" | "Log";
  title: string;
  description: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lowerQ = q.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search Tokens
    initialTokens.forEach(t => {
      let valueStr = "";
      if (typeof t.value === "string") valueStr = t.value;
      else if (t.value && typeof t.value === "object") {
        valueStr = `${(t.value as any).light} ${(t.value as any).dark}`;
      }
      
      if (t.name.toLowerCase().includes(lowerQ) || t.description.toLowerCase().includes(lowerQ) || valueStr.toLowerCase().includes(lowerQ)) {
        newResults.push({ id: t.id, type: "Token", title: t.name, description: t.description });
      }
    });

    // Search Components
    initialComponents.forEach(c => {
      if (c.name.toLowerCase().includes(lowerQ) || c.description.toLowerCase().includes(lowerQ)) {
        newResults.push({ id: c.id, type: "Component", title: c.name, description: c.description });
      }
    });

    // Search Changelog
    initialChangelog.forEach(cl => {
      if (cl.note.toLowerCase().includes(lowerQ)) {
        newResults.push({ id: cl.id, type: "Log", title: `${cl.action} - ${cl.target_type}`, description: cl.note });
      }
    });

    setResults(newResults);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <mark key={i} className="bg-yellow-200 text-black px-1 rounded font-medium">{part}</mark> : 
            part
        )}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Global Search</h1>
      
      <div className="relative mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search components, tokens, or changelog..." 
          className="w-full p-4 pl-12 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div className="space-y-4">
        {query && results.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            No results found for "{query}"
          </div>
        )}
        
        {results.map(res => (
          <div key={`${res.type}-${res.id}`} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wider ${
                res.type === 'Token' ? 'bg-purple-100 text-purple-700' :
                res.type === 'Component' ? 'bg-emerald-100 text-emerald-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {res.type}
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                {highlightText(res.title, query)}
              </h3>
            </div>
            <p className="text-gray-600">
              {highlightText(res.description, query)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
