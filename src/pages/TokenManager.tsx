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
  const [activeCategory, setActiveCategory] = useState<string>("overview");
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

  const categories = ["overview", "color", "typography", "spacing", "radius", "shadow"];

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
            {cat === "color" ? "전체 (Color)" : cat === "overview" ? "Overview" : cat}
          </button>
        ))}
      </div>

      {activeCategory === "overview" ? (
        <OverviewSection />
      ) : (
        <div className="space-y-6">
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
      )}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 mt-2">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Tokens overview</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
          Design tokens represent repeated decisions throughout a system and provide an avenue to apply them consistently. They replace raw values with meaningful labels that convey intention.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Column: Token Groups */}
        <div className="w-full lg:w-1/3">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Token groups</h3>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Tokens progress in specificity from raw values to core tokens, semantic tokens, and component tokens.
          </p>
          <ul className="space-y-3">
            {["Color", "Typography", "Spacing", "Sizing", "Radius", "Opacity", "Stroke width", "Effects"].map(group => (
              <li key={group} className="flex items-center text-gray-700 font-medium before:content-['•'] before:mr-3 before:text-blue-600">
                {group}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Architecture Diagram */}
        <div className="w-full lg:w-2/3 bg-gray-50/50 rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center">
          
          <div className="flex flex-col relative z-10">
            {/* Raw */}
            <div className="flex items-center gap-8">
              <span className="text-gray-400 font-medium w-20 text-right text-xs uppercase tracking-widest">Raw</span>
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 w-72 transition-transform hover:-translate-y-0.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 shrink-0 shadow-inner"></span>
                <span className="font-mono text-gray-700 text-sm font-medium">#2563EB</span>
              </div>
            </div>

            {/* Line */}
            <div className="flex items-center gap-8">
              <span className="w-20"></span>
              <div className="w-72 pl-[25px] py-1"><div className="w-0.5 h-10 bg-gray-200"></div></div>
            </div>

            {/* Core */}
            <div className="flex items-center gap-8">
              <span className="text-gray-400 font-medium w-20 text-right text-xs uppercase tracking-widest">Core</span>
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 w-72 transition-transform hover:-translate-y-0.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 shrink-0 shadow-inner"></span>
                <span className="font-mono text-gray-700 text-sm font-medium">color.palette.blue.600</span>
              </div>
            </div>

            {/* Line */}
            <div className="flex items-center gap-8">
              <span className="w-20"></span>
              <div className="w-72 pl-[25px] py-1"><div className="w-0.5 h-10 bg-gray-200"></div></div>
            </div>

            {/* Semantic */}
            <div className="flex items-center gap-8">
              <span className="text-gray-400 font-medium w-20 text-right text-xs uppercase tracking-widest">Semantic</span>
              <div className="bg-gray-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-4 w-72 text-white transition-transform hover:-translate-y-0.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 shrink-0 border-2 border-gray-800"></span>
                <span className="font-mono text-sm font-semibold">color.semantic.primary</span>
              </div>
            </div>

            {/* Line */}
            <div className="flex items-center gap-8">
              <span className="w-20"></span>
              <div className="w-72 pl-[25px] py-1"><div className="w-0.5 h-10 bg-gray-200"></div></div>
            </div>

            {/* Component */}
            <div className="flex items-center gap-8">
              <span className="w-20"></span>
              <div className="w-72 flex justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-full shadow-lg transition-transform hover:-translate-y-1 w-full max-w-[200px]">
                  Add to cart
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
