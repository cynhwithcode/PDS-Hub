import { useState, useEffect, useMemo } from "react";
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
  const [activeTier, setActiveTier] = useState<'core' | 'semantic'>('semantic');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // 최신 토큰 데이터를 불러오기 위해 기존 로컬스토리지 삭제
    localStorage.removeItem("pds_tokens");
    setTokens(initialTokens as Token[]);
    localStorage.setItem("pds_tokens", JSON.stringify(initialTokens));
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

  // 참조 문자열(ex: "Red/500-main")을 Hex 코드로 변환하는 헬퍼 함수
  const getHexValue = (refValue: string) => {
    if (!refValue) return '#CBD5E1';
    if (refValue.startsWith('#')) return refValue;
    
    // ex) "Red/600" -> "red.600", "Coomon/White" -> "coomon.white"
    const normalizedRef = refValue.toLowerCase().replace('/', '.').replace('-main', '.500-mainmain');
    
    const coreToken = tokens.find(t => 
      t.tier === 'core' && t.name.toLowerCase().includes(normalizedRef)
    );
    
    return coreToken && typeof coreToken.value === 'string' ? coreToken.value : '#CBD5E1';
  };

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
        <div className="space-y-6">
          <div className="flex justify-between items-center pt-4">
            <h2 className="text-xl font-bold text-gray-800">Token Categories</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Description</th>
                  <th className="p-4 font-semibold text-gray-600">Tokens</th>
                  <th className="p-4 font-semibold text-gray-600 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedCategory(cat.id)}>
                    <td className="p-4 font-bold text-gray-900 capitalize flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {cat.id === 'color' ? <div className="w-4 h-4 rounded-full bg-blue-500"></div> : <span className="font-serif font-bold text-gray-500">Aa</span>}
                      </div>
                      {cat.name}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{cat.desc}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                        {tokens.filter(t => t.category === cat.id).length}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline text-sm font-medium">열기 &rarr;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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
                <th className="p-4 font-semibold text-gray-600">이름 (Name)</th>
                {activeTier === 'core' ? (
                  <th className="p-4 font-semibold text-gray-600">값 (Value)</th>
                ) : (
                  <>
                    <th className="p-4 font-semibold text-gray-600">라이트 모드 (Light)</th>
                    <th className="p-4 font-semibold text-gray-600">다크 모드 (Dark)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={activeTier === 'core' ? 2 : 3} className="p-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTokens.map(token => (
                  <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <code className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-mono text-sm border border-gray-200">
                        {token.name}
                      </code>
                    </td>
                    
                    {activeTier === 'core' ? (
                      <td className="p-4 font-mono text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                            style={{ backgroundColor: typeof token.value === 'string' ? token.value : '#fff' }}
                          ></div>
                          <span>{typeof token.value === 'string' ? token.value : '-'}</span>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="p-4 font-mono text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                              style={{ backgroundColor: typeof token.value === 'object' ? getHexValue(token.value.light) : '#fff' }}
                            ></div>
                            <span>{typeof token.value === 'object' ? token.value.light : '-'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                              style={{ backgroundColor: typeof token.value === 'object' ? getHexValue(token.value.dark) : '#fff' }}
                            ></div>
                            <span>{typeof token.value === 'object' ? token.value.dark : '-'}</span>
                          </div>
                        </td>
                      </>
                    )}
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
