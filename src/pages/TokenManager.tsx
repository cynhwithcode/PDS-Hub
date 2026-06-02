import { useState, useEffect, useMemo } from "react";
import initialTokens from "../data/tokens.json";

type Token = {
  id: string;
  category: string;
  tier: 'core' | 'semantic';
  name: string;
  value: string | { light: string; dark: string };
  description: string;
  updated_at: string;
};

export default function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("color");
  const [activeTier, setActiveTier] = useState<'core' | 'semantic'>('core');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pds_tokens");
    if (saved) {
      setTokens(JSON.parse(saved));
    } else {
      setTokens(initialTokens as Token[]);
      localStorage.setItem("pds_tokens", JSON.stringify(initialTokens));
    }
  }, []);

  const categories = ["color", "typography", "spacing", "radius", "shadow"];

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchCategory = t.category === activeCategory;
      const matchTier = t.tier === activeTier;
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchTier && matchSearch;
    });
  }, [tokens, activeCategory, activeTier, searchTerm]);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Manager</h1>
          <p className="text-gray-500 mt-2 text-lg">디자인 시스템 토큰 및 값 관리</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          + 신규 토큰 등록하기
        </button>
      </header>

      {/* Main Category Tabs (Registry Style) */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto px-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-4 text-sm font-bold capitalize transition-colors whitespace-nowrap ${
              activeCategory === cat 
                ? "border-b-2 border-gray-900 text-gray-900" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {cat === "color" ? "전체 (Color)" : cat}
          </button>
        ))}
      </div>

      {/* Filter Bar (Registry Style) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="토큰 이름 검색..." 
          className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTier('core')}
            className={`flex-1 md:w-32 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTier === 'core' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Palette (Core)
          </button>
          <button
            onClick={() => setActiveTier('semantic')}
            className={`flex-1 md:w-32 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTier === 'semantic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Semantic
          </button>
        </div>
      </div>

      {/* Token Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              {activeTier === 'core' ? (
                <th className="p-4 font-semibold text-gray-600">Value (Hex)</th>
              ) : (
                <>
                  <th className="p-4 font-semibold text-gray-600">Light Mode</th>
                  <th className="p-4 font-semibold text-gray-600">Dark Mode</th>
                </>
              )}
              <th className="p-4 font-semibold text-gray-600 hidden md:table-cell">Description</th>
              <th className="p-4 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={activeTier === 'core' ? 4 : 5} className="p-8 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filteredTokens.map(token => (
                <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{token.name}</td>
                  
                  {activeTier === 'core' ? (
                    <td className="p-4 font-mono text-sm text-gray-600 flex items-center gap-3">
                      {activeCategory === "color" && typeof token.value === "string" && (
                        <span 
                          className="w-6 h-6 rounded border border-gray-200 shrink-0" 
                          style={{ backgroundColor: token.value }}
                        ></span>
                      )}
                      {token.value as string}
                    </td>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-sm text-gray-600">
                        {typeof token.value === "object" ? token.value.light : "-"}
                      </td>
                      <td className="p-4 font-mono text-sm text-gray-600">
                        {typeof token.value === "object" ? token.value.dark : "-"}
                      </td>
                    </>
                  )}

                  <td className="p-4 text-gray-500 hidden md:table-cell text-sm">{token.description}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                    <button className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
