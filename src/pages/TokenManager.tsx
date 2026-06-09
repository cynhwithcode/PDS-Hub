import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTokens } from "../hooks/useTokens";

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
  const navigate = useNavigate();
  const { tokens } = useTokens();
  
  const [activeTier, setActiveTier] = useState<'core' | 'semantic'>('semantic');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`'${text}' 복사되었습니다!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

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
    
    let normalizedRef = refValue.toLowerCase().replace('/', '.');
    
    const coreToken = tokens.find(t => 
      t.tier === 'core' && t.name.toLowerCase().endsWith(normalizedRef)
    );
    
    return coreToken && typeof coreToken.value === 'string' ? coreToken.value : '#CBD5E1';
  };

  // 타이포그래피 미리보기 렌더링 헬퍼 함수
  const renderTypographyPreview = (token: Token) => {
    if (token.category !== 'typography') return null;
    let size = '16px';
    let weight = '400';
    let lineHeight = '1.5';
    
    const valStr = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : '');
    
    if (token.tier === 'semantic') {
      const parts = valStr.split('/').map(s => s.trim());
      if (parts.length >= 1) size = parts[0];
      if (parts.length >= 2) {
        const w = parts[1].toLowerCase();
        weight = w.includes('bold') ? (w.includes('semi') ? '600' : '700') : '500';
      }
      if (parts.length >= 3) lineHeight = parts[2];
    } else {
      if (token.name.includes('.size.')) size = valStr;
      else if (token.name.includes('.weight.')) weight = valStr;
      else if (token.name.includes('.lineHeight.')) lineHeight = valStr;
    }

    return (
      <div className="flex items-center justify-center overflow-hidden">
        <span 
          className="text-gray-900 truncate"
          style={{ 
            fontSize: size, 
            fontWeight: weight, 
            lineHeight: lineHeight, 
            fontFamily: "'Pretendard', 'Inter', sans-serif" 
          }}
        >
          Aa
        </span>
      </div>
    );
  };

  // 스페이싱 미리보기 렌더링 헬퍼 함수
  const renderSpacingPreview = (token: Token) => {
    if (token.category !== 'spacing') return null;
    let sizePx = '0px';
    const valStr = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : '0px');
    sizePx = valStr;

    return (
      <div className="flex items-center justify-center overflow-hidden py-2">
        <div 
          className="bg-red-500 rounded-sm shadow-sm transition-all duration-300"
          style={{ width: sizePx, height: sizePx }}
          title={`Spacing: ${sizePx}`}
        ></div>
      </div>
    );
  };

  // 레디우스(Radius) 미리보기 렌더링 헬퍼 함수
  const renderRadiusPreview = (token: Token) => {
    if (token.category !== 'radius') return null;
    let radiusPx = '0px';
    const valStr = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : '0px');
    radiusPx = valStr;

    return (
      <div className="flex items-center justify-center overflow-hidden py-2">
        <div 
          className="w-12 h-12 bg-blue-50 border-2 border-blue-400 shadow-sm transition-all duration-300"
          style={{ borderRadius: radiusPx }}
          title={`Radius: ${radiusPx}`}
        ></div>
      </div>
    );
  };

  // 섀도우(Shadow) 미리보기 렌더링 헬퍼 함수
  const renderShadowPreview = (token: Token) => {
    if (token.category !== 'shadow') return null;
    let shadowVal = 'none';
    const valStr = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : 'none');
    shadowVal = valStr;

    return (
      <div className="flex items-center justify-center overflow-visible py-4">
        <div 
          className="w-16 h-16 bg-white border border-gray-100 rounded-lg transition-all duration-300"
          style={{ boxShadow: shadowVal }}
          title={`Shadow: ${shadowVal}`}
        ></div>
      </div>
    );
  };

  // 아이콘(Iconography) 미리보기 렌더링 헬퍼 함수
  const renderIconographyPreview = (token: Token) => {
    if (token.category !== 'iconography') return null;
    
    if (token.tier === 'core' && token.name.includes('.size.')) {
      const sizePx = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : '24px');
      return (
        <div className="flex items-center justify-center overflow-hidden py-2 text-gray-800">
          <svg style={{ width: sizePx, height: sizePx }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      );
    }
    
    // Semantic Domains
    const domainText = typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : 'Domain');
    return (
      <div className="flex items-center justify-center overflow-hidden py-2">
        <span className="bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-md">{domainText}</span>
      </div>
    );
  };

  const currentCategoryTokens = useMemo(() => {
    return tokens.filter(t => t.category === selectedCategory);
  }, [tokens, selectedCategory]);

  const hasSemantic = currentCategoryTokens.some(t => t.tier === 'semantic');
  const hasCore = currentCategoryTokens.some(t => t.tier === 'core');

  useEffect(() => {
    if (selectedCategory) {
      if (!hasSemantic) {
        setActiveTier('core');
      } else if (!hasCore) {
        setActiveTier('semantic');
      } else {
        setActiveTier('semantic');
      }
    }
  }, [selectedCategory, hasSemantic, hasCore]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const getGroupName = (token: Token): string => {
    const parts = token.name.split('.');
    if (token.tier === 'core' && parts.length >= 4) {
      const topGroup = parts[2];
      if (['status', 'secondary'].includes(topGroup)) {
        return `${capitalize(topGroup)} / ${capitalize(parts[3])}`;
      }
      return capitalize(topGroup);
    } else if (token.tier === 'semantic' && parts.length >= 4) {
      const topGroup = parts[2];
      if (topGroup === 'status') {
        if (parts[3] === 'ptos' && parts.length >= 5) {
          return `Status / PTOS / ${capitalize(parts[4])}`;
        }
        return `Status / ${capitalize(parts[3])}`;
      }
      return capitalize(topGroup);
    }
    return 'Other';
  };

  const groupedTokens = useMemo(() => {
    const groups: Record<string, Token[]> = {};
    filteredTokens.forEach(t => {
      const groupName = getGroupName(t);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(t);
    });
    return groups;
  }, [filteredTokens]);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 relative pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 z-50 transition-all">
          <div className="bg-green-500 rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Registry</h1>
          <p className="text-gray-500 mt-2 text-lg">디자인 시스템 토큰 목록 및 상세 관리</p>
        </div>
        <button 
          onClick={() => navigate('/tokens/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          + 신규 토큰 등록하기
        </button>
      </header>

      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center pt-4">
            <h2 className="text-xl font-bold text-gray-800">Token Categories</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                title="그리드 뷰"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                title="리스트 뷰"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <svg className="w-12 h-12 text-gray-300 group-hover:text-yellow-400 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
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
                          {cat.id === 'color' ? (
                            <div className="flex gap-0.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            </div>
                          ) : cat.id === 'typography' ? (
                            <span className="font-serif font-bold text-gray-700 text-sm">Aa</span>
                          ) : cat.id === 'spacing' ? (
                            <div className="flex gap-1 items-center">
                              <div className="w-0.5 h-3 bg-gray-400"></div>
                              <div className="w-2 h-0 border-t border-dashed border-gray-400"></div>
                              <div className="w-0.5 h-3 bg-gray-400"></div>
                            </div>
                          ) : cat.id === 'radius' ? (
                            <div className="w-4 h-4 border-[1.5px] border-gray-400 rounded-md"></div>
                          ) : cat.id === 'shadow' ? (
                            <div className="w-4 h-4 bg-white border border-gray-200 shadow-md rounded-sm"></div>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
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
          )}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {hasSemantic && hasCore && (
              <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                <button 
                  onClick={() => setActiveTier('semantic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTier === 'semantic' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Semantic
                </button>
                <button 
                  onClick={() => setActiveTier('core')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTier === 'core' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Palette (Core)
                </button>
              </div>
            )}
          </div>

          <div className="space-y-12">
            {Object.keys(groupedTokens).length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              Object.entries(groupedTokens).map(([groupName, groupTokens]) => (
                <div key={groupName} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">{groupName}</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left table-fixed">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className={`p-4 font-semibold text-gray-600 ${['typography', 'spacing', 'radius', 'shadow', 'iconography'].includes(selectedCategory) ? 'w-2/5' : 'w-1/2'}`}>이름 (Name)</th>
                          {activeTier === 'core' || selectedCategory !== 'color' ? (
                            <th className={`p-4 font-semibold text-gray-600 ${['typography', 'spacing', 'radius', 'shadow', 'iconography'].includes(selectedCategory) ? 'w-2/5' : 'w-1/2'}`}>값 (Value)</th>
                          ) : (
                            <>
                              <th className="p-4 font-semibold text-gray-600 w-1/4">라이트 모드 (Light)</th>
                              <th className="p-4 font-semibold text-gray-600 w-1/4">다크 모드 (Dark)</th>
                            </>
                          )}
                          {['typography', 'spacing', 'radius', 'shadow', 'iconography'].includes(selectedCategory) && (
                            <th className="p-4 font-semibold text-gray-600 w-1/5 text-center border-l border-gray-100 bg-gray-100/50">미리보기 (Preview)</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {groupTokens.map(token => (
                          <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono text-sm text-gray-800 truncate">
                              <code 
                                onClick={() => handleCopy(token.name)}
                                className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-200 hover:text-blue-600 transition-colors"
                                title="클릭하여 복사"
                              >
                                {token.name}
                              </code>
                            </td>
                            {activeTier === 'core' || selectedCategory !== 'color' ? (
                              <td className="p-4 font-mono text-sm text-gray-700 truncate">
                                <div className="flex items-center gap-3">
                                  {selectedCategory === 'color' && (
                                    <div 
                                      className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                                      style={{ backgroundColor: typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? getHexValue(token.value.light) : '#fff') }}
                                    ></div>
                                  )}
                                  <span 
                                    onClick={() => handleCopy(typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : ''))}
                                    className="cursor-pointer hover:text-blue-600 transition-colors truncate"
                                    title="클릭하여 복사"
                                  >
                                    {typeof token.value === 'string' ? token.value : (typeof token.value === 'object' ? token.value.light : '-')}
                                  </span>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="p-4 font-mono text-sm text-gray-700 truncate">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                                      style={{ backgroundColor: typeof token.value === 'object' ? getHexValue(token.value.light) : '#fff' }}
                                    ></div>
                                    <span 
                                      onClick={() => handleCopy(typeof token.value === 'object' ? token.value.light : '')}
                                      className="cursor-pointer hover:text-blue-600 transition-colors truncate"
                                      title="클릭하여 복사"
                                    >
                                      {typeof token.value === 'object' ? token.value.light : '-'}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-sm text-gray-700 truncate">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-5 h-5 rounded border border-gray-200 shadow-sm shrink-0" 
                                      style={{ backgroundColor: typeof token.value === 'object' ? getHexValue(token.value.dark) : '#fff' }}
                                    ></div>
                                    <span 
                                      onClick={() => handleCopy(typeof token.value === 'object' ? token.value.dark : '')}
                                      className="cursor-pointer hover:text-blue-600 transition-colors truncate"
                                      title="클릭하여 복사"
                                    >
                                      {typeof token.value === 'object' ? token.value.dark : '-'}
                                    </span>
                                  </div>
                                </td>
                              </>
                            )}
                            {['typography', 'spacing', 'radius', 'shadow', 'iconography'].includes(selectedCategory) && (
                              <td className="p-4 text-center border-l border-gray-100 bg-gray-50/50">
                                {selectedCategory === 'typography' ? renderTypographyPreview(token) : 
                                 selectedCategory === 'spacing' ? renderSpacingPreview(token) :
                                 selectedCategory === 'radius' ? renderRadiusPreview(token) :
                                 selectedCategory === 'shadow' ? renderShadowPreview(token) :
                                 renderIconographyPreview(token)}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
