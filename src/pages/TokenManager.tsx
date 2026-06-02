import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import initialTokens from "../data/tokens.json";

type Token = {
  id: string;
  category: string;
  tier?: 'core' | 'semantic';
  name: string;
  value: string | { light: string; dark: string };
  description: string;
  updated_at: string;
};

export default function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const categories = [
    { id: 'color', name: 'Color', desc: '브랜드 핵심 색상 및 시맨틱 컬러 정의' },
    { id: 'typography', name: 'Typography', desc: '폰트 크기, 굵기, 행간 등 텍스트 스타일 정의' },
    { id: 'spacing', name: 'Spacing', desc: '컴포넌트 및 레이아웃 간격 정의' },
    { id: 'radius', name: 'Radius', desc: 'UI 요소의 모서리 둥글기 정의' },
    { id: 'shadow', name: 'Shadow', desc: '요소의 깊이감을 표현하는 그림자 정의' },
    { id: 'iconography', name: 'Iconography', desc: '시스템 공통 아이콘 및 심볼 정의' }
  ];

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const tokenTier = t.tier || 'core';
      const matchTier = tokenTier === activeTier;
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = t.category === selectedCategory;
      return matchTier && matchSearch && matchCategory;
    });
  }, [tokens, activeTier, searchTerm, selectedCategory]);

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

      {!selectedCategory ? (
        /* 카테고리 썸네일 그리드 (메인 화면) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {categories.map(cat => {
            const count = tokens.filter(t => t.category === cat.id).length;
            return (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-40 mb-6 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                  {cat.id === 'color' ? (
                    <div className="flex gap-2">
                      <div className="w-12 h-12 rounded-full bg-blue-500 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 delay-75"></div>
                      <div className="w-12 h-12 rounded-full bg-green-500 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 delay-150"></div>
                      <div className="w-12 h-12 rounded-full bg-red-500 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 delay-200"></div>
                    </div>
                  ) : cat.id === 'typography' ? (
                    <span className="text-6xl font-serif text-gray-800 font-bold tracking-tighter group-hover:scale-110 transition-transform duration-300">Aa</span>
                  ) : cat.id === 'spacing' ? (
                    <div className="flex gap-3 items-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-1.5 h-12 bg-gray-400 rounded-full"></div>
                      <div className="w-10 h-12 border-t-2 border-b-2 border-dashed border-gray-400"></div>
                      <div className="w-1.5 h-12 bg-gray-400 rounded-full"></div>
                    </div>
                  ) : cat.id === 'radius' ? (
                    <div className="w-16 h-16 border-4 border-gray-400 rounded-3xl group-hover:rounded-full transition-all duration-300"></div>
                  ) : cat.id === 'shadow' ? (
                    <div className="w-16 h-16 bg-white border border-gray-100 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 rounded-xl"></div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 mask mask-star-2 group-hover:rotate-45 transition-transform duration-300"></div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">{cat.name}</h3>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    {count} Tokens
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* 개별 토큰 리스트 (테이블) */
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              &larr; 카테고리 목록으로
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <h2 className="text-xl font-bold text-gray-800 capitalize">{selectedCategory} Tokens</h2>
          </div>

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
                          {selectedCategory === "color" && typeof token.value === "string" && (
                            <span 
                              className="w-6 h-6 rounded border border-gray-200 shrink-0 shadow-sm" 
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
                        <Link to={`/tokens/${token.id}`} className="text-blue-600 hover:underline text-sm font-medium">상세 보기</Link>
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
