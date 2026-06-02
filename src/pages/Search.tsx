import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponents } from '../hooks/useComponents';
import { useTokens } from '../hooks/useTokens';

export default function Search() {
  const navigate = useNavigate();
  const { components } = useComponents();
  const { tokens } = useTokens();

  const [query, setQuery] = useState('');

  const isSearching = query.trim().length >= 2;

  const searchResultsComponents = isSearching
    ? components.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      })
    : [];

  const searchResultsTokens = isSearching
    ? tokens.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.value.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      })
    : [];

  const hasResults = searchResultsComponents.length > 0 || searchResultsTokens.length > 0;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <header className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">통합 검색</h1>
        <div className="relative shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            className="w-full text-lg px-6 py-4 outline-none text-gray-900 bg-white placeholder-gray-400"
            placeholder="이름, 설명, 값, 카테고리로 검색하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {!isSearching ? (
        <div className="text-center py-24 text-gray-400 text-lg">
          컴포넌트와 토큰을 검색해보세요. <br />
          <span className="text-sm mt-2 block">(2글자 이상 입력 시 자동 검색됩니다)</span>
        </div>
      ) : (
        <div className="space-y-10">
          {!hasResults ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
              검색 결과가 없습니다.
            </div>
          ) : (
            <>
              {/* Component Results */}
              {searchResultsComponents.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full">{searchResultsComponents.length}</span>
                    컴포넌트 검색 결과
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResultsComponents.map((c) => (
                      <div 
                        key={c.id} 
                        onClick={() => navigate(`/components/${c.id}`)}
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{c.name}</h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">{c.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Token Results */}
              {searchResultsTokens.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-0.5 rounded-full">{searchResultsTokens.length}</span>
                    토큰 검색 결과
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResultsTokens.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => navigate('/tokens')}
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-green-500 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {t.category === 'color' && (
                              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: t.value }} />
                            )}
                            <h3 className="font-bold text-gray-900">{t.name}</h3>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">{t.category}</span>
                        </div>
                        <div className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded inline-block w-fit">
                          {t.value}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
