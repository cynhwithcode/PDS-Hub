import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  const [activeTier, setActiveTier] = useState<'core' | 'semantic'>('core');
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const saved = localStorage.getItem("pds_tokens");
    if (saved) {
      setTokens(JSON.parse(saved));
    } else {
      setTokens(initialTokens as Token[]);
      localStorage.setItem("pds_tokens", JSON.stringify(initialTokens));
    }
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(tokens.map(t => t.category));
    return Array.from(cats);
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const matchTier = t.tier === activeTier;
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchTier && matchSearch && matchCategory;
    });
  }, [tokens, activeTier, searchTerm, categoryFilter]);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Registry</h1>
          <p className="text-gray-500 mt-2 text-lg">디자인 시스템 토큰 목록 및 상세 관리</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          + 신규 토큰 등록하기
        </button>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="토큰 이름 검색..." 
          className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">모든 카테고리</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

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

      {/* Token Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTokens.map(token => (
          <div key={token.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full hover:border-blue-400 hover:shadow-md transition-all group">
            
            {/* Thumbnail Area */}
            <div className="h-32 mb-5 bg-gray-50/50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
              {token.category === 'color' && typeof token.value === 'string' ? (
                <div 
                  className="w-16 h-16 rounded-full shadow-inner border border-gray-200 group-hover:scale-110 transition-transform duration-300" 
                  style={{ backgroundColor: token.value }}
                ></div>
              ) : token.category === 'color' && typeof token.value === 'object' ? (
                <div className="flex w-16 h-16 rounded-full shadow-inner border border-gray-200 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="w-1/2 h-full" style={{ backgroundColor: token.value.light }}></div>
                  <div className="w-1/2 h-full" style={{ backgroundColor: token.value.dark }}></div>
                </div>
              ) : token.category === 'typography' ? (
                <span className="text-4xl font-serif text-gray-800 font-bold tracking-tighter group-hover:scale-110 transition-transform duration-300">Aa</span>
              ) : token.category === 'spacing' ? (
                <div className="flex gap-2 items-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
                  <div className="w-6 h-8 border-t-2 border-b-2 border-dashed border-gray-400"></div>
                  <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
                </div>
              ) : token.category === 'radius' ? (
                <div className="w-12 h-12 border-4 border-gray-400 rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md group-hover:scale-110 transition-transform duration-300"></div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-bold text-gray-900 truncate pr-2" title={token.name}>{token.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 shrink-0">
                {token.category}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 flex-1 line-clamp-2">
              {token.description || "설명이 없습니다."}
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
              <div className="font-mono text-xs font-medium text-gray-600 truncate max-w-[120px]">
                {typeof token.value === 'string' ? token.value : `${token.value.light} / ${token.value.dark}`}
              </div>
              <Link 
                to={`/tokens/${token.id}`} 
                className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors whitespace-nowrap"
              >
                상세 보기 &rarr;
              </Link>
            </div>
            
          </div>
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
