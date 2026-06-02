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
  const [activeTier, setActiveTier] = useState<'core' | 'semantic'>('semantic');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 최신 토큰 데이터를 불러오기 위해 기존 로컬스토리지 삭제
    localStorage.removeItem("pds_tokens");
    setTokens(initialTokens as Token[]);
    localStorage.setItem("pds_tokens", JSON.stringify(initialTokens));
  }, []);

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const tokenTier = t.tier || 'core';
      const matchTier = tokenTier === activeTier;
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTier && matchSearch && t.category === 'color';
    });
  }, [tokens, activeTier, searchTerm]);

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

      <div className="space-y-6">
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
            <thead className="bg-gray-800 text-white border-b border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-100">이름 (Name)</th>
                {activeTier === 'core' ? (
                  <th className="p-4 font-semibold text-gray-100">값 (Value)</th>
                ) : (
                  <>
                    <th className="p-4 font-semibold text-gray-100">라이트 모드 (Light)</th>
                    <th className="p-4 font-semibold text-gray-100">다크 모드 (Dark)</th>
                  </>
                )}
                <th className="p-4 font-semibold text-gray-100 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={activeTier === 'core' ? 3 : 4} className="p-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTokens.map(token => (
                  <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <code className="bg-[#1E1E1E] text-yellow-500 px-3 py-1.5 rounded-lg font-mono text-sm shadow-sm border border-gray-800">
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

                    <td className="p-4">
                      <Link to={`/tokens/${token.id}`} className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium">상세 보기</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
