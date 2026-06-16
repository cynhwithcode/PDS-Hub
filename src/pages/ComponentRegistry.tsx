import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComponents } from '../hooks/useComponents';

export default function ComponentRegistry() {
  const navigate = useNavigate();
  const { components } = useComponents();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryTab, setCategoryTab] = useState<string>('all');

  const categoryTabs = ['전체', 'Action', 'Input', 'Display', 'Feedback', 'Navigation'];
  const tabValues = ['all', 'Action', 'Input', 'Display', 'Feedback', 'Navigation'];

  const filteredComponents = useMemo(() => {
    return components.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchCategory = categoryTab === 'all' || c.category_group === categoryTab;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [components, searchTerm, statusFilter, categoryTab]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'stable': return 'bg-green-50 text-green-700 border border-green-200';
      case 'beta': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'deprecated': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const renderThumbnailSVG = (id: string) => {
    switch (id) {
      case 'c-buttons':
        return (
          <svg className="w-32 h-16" viewBox="0 0 128 64" fill="none">
            {/* Primary */}
            <rect className="group-hover:fill-[#CC0000] transition-colors duration-300" x="16" y="16" width="28" height="32" rx="6" fill="#E8002D" />
            {/* Secondary */}
            <rect x="52" y="16" width="28" height="32" rx="6" stroke="#1A1A1A" strokeWidth="2" />
            {/* Ghost */}
            <rect x="92" y="28" width="20" height="8" rx="4" fill="#1A1A1A" opacity="0.4" />
          </svg>
        );
      case 'c-badge':
        return (
          <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
            <circle cx="36" cy="44" r="16" fill="#1A1A1A" opacity="0.1" />
            {/* Bounce animation on hover */}
            <g className="group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300 origin-center">
              <circle cx="52" cy="28" r="12" fill="#E8002D" />
              <rect x="47" y="27" width="10" height="2" rx="1" fill="white" />
            </g>
          </svg>
        );
      case 'c-chips':
        return (
          <svg className="w-32 h-16" viewBox="0 0 128 64" fill="none">
            <rect className="group-hover:scale-110 transition-transform duration-300 origin-center" x="12" y="20" width="30" height="24" rx="12" fill="#E8002D" />
            <rect x="50" y="20" width="30" height="24" rx="12" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="88" y="20" width="30" height="24" rx="12" stroke="#1A1A1A" strokeWidth="2" />
          </svg>
        );
      case 'c-textfield':
        return (
          <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
            <rect x="12" y="30" width="24" height="6" rx="3" fill="#1A1A1A" opacity="0.8" />
            <rect x="12" y="42" width="72" height="24" rx="4" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="12" y="72" width="48" height="4" rx="2" fill="#E8002D" opacity="0.8" />
          </svg>
        );
      case 'c-tab':
        return (
          <svg className="w-32 h-24" viewBox="0 0 128 96" fill="none">
            <rect x="16" y="40" width="24" height="6" rx="3" fill="#E8002D" />
            <rect x="52" y="40" width="24" height="6" rx="3" fill="#1A1A1A" opacity="0.3" />
            <rect x="88" y="40" width="24" height="6" rx="3" fill="#1A1A1A" opacity="0.3" />
            <line x1="10" y1="56" x2="118" y2="56" stroke="#1A1A1A" strokeOpacity="0.1" strokeWidth="2" />
            <rect className="group-hover:translate-x-[36px] transition-transform duration-300" x="16" y="54" width="24" height="4" fill="#E8002D" />
          </svg>
        );
      case 'c-popup':
        return (
          <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
            <rect x="16" y="20" width="64" height="56" rx="6" fill="white" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="24" y="32" width="32" height="6" rx="3" fill="#1A1A1A" />
            <rect x="24" y="46" width="48" height="4" rx="2" fill="#1A1A1A" opacity="0.3" />
            <rect x="24" y="54" width="36" height="4" rx="2" fill="#1A1A1A" opacity="0.3" />
            <rect x="42" y="66" width="16" height="10" rx="3" fill="#1A1A1A" opacity="0.1" />
            <rect x="62" y="66" width="10" height="10" rx="3" fill="#E8002D" />
          </svg>
        );
      case 'c-bottomsheet':
        return (
          <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
            <rect x="16" y="40" width="64" height="56" rx="8" fill="white" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="40" y="48" width="16" height="4" rx="2" fill="#1A1A1A" opacity="0.3" />
            <rect x="24" y="64" width="48" height="6" rx="3" fill="#1A1A1A" opacity="0.1" />
            <rect x="24" y="76" width="32" height="6" rx="3" fill="#1A1A1A" opacity="0.1" />
          </svg>
        );
      case 'c-error':
        return (
          <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="40" r="16" fill="#E8002D" opacity="0.1" stroke="#E8002D" strokeWidth="2" />
            <rect x="46" y="32" width="4" height="8" rx="2" fill="#E8002D" />
            <circle cx="48" cy="46" r="2" fill="#E8002D" />
            <rect x="28" y="68" width="40" height="6" rx="3" fill="#1A1A1A" opacity="0.4" />
          </svg>
        );
      case 'c-policy':
        return (
          <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
            <rect x="28" y="16" width="40" height="64" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="36" y="32" width="24" height="4" rx="2" fill="#1A1A1A" opacity="0.6" />
            <rect x="36" y="44" width="20" height="3" rx="1.5" fill="#1A1A1A" opacity="0.3" />
            <rect x="36" y="52" width="22" height="3" rx="1.5" fill="#1A1A1A" opacity="0.3" />
            <rect x="36" y="60" width="18" height="3" rx="1.5" fill="#1A1A1A" opacity="0.3" />
            <rect x="36" y="68" width="16" height="3" rx="1.5" fill="#1A1A1A" opacity="0.3" />
          </svg>
        );
      default:
        return <div className="text-3xl font-bold text-gray-300">{id.substring(0, 2).toUpperCase()}</div>;
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Component Registry</h1>
          <p className="text-gray-500 mt-2 text-lg">컴포넌트 목록 및 상태 관리</p>
        </div>
        <Link 
          to="/components/new" 
          className="hidden bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          + 신규 컴포넌트 등록하기
        </Link>
      </header>

      {/* Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 mb-6 gap-4">
        <div className="flex space-x-6 overflow-x-auto">
          {categoryTabs.map((tab, idx) => {
            const val = tabValues[idx];
            const isActive = categoryTab === val;
            return (
              <button
                key={val}
                onClick={() => setCategoryTab(val)}
                className={`py-3 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-2 sm:mb-0">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="컴포넌트 이름 검색..." 
          className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select 
          className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">모든 상태</option>
          <option value="stable">Stable</option>
          <option value="beta">Beta</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map(comp => (
            <div 
              key={comp.id} 
              onClick={() => navigate(`/components/${comp.id}`)}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div 
                className="h-36 flex items-center justify-center border-b border-gray-100 bg-[#F5F5F5] rounded-t-xl" 
              >
                <div className="group-hover:-translate-y-1 transition-transform duration-300">
                  {renderThumbnailSVG(comp.id)}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{comp.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(comp.status)}`}>
                    {comp.status}
                  </span>
                </div>
                
                {comp.short_description && (
                  <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">
                    {comp.short_description}
                  </p>
                )}
                
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit mb-3">
                  {comp.category_group || comp.category}
                </span>

                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
                  {comp.thumbnail_icon || comp.description}
                </p>

                <div className="text-xs text-gray-500 mb-4 font-medium">
                  담당: Phoenixdarts 디자인실 디자인기획팀
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 font-medium tracking-wide">
                    v{comp.version} • {new Date(comp.updated_at).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="flex gap-2">
                    {comp.figma_link && (
                      <a 
                        href={comp.figma_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 w-8 h-8 rounded-lg transition-colors"
                        title="Figma"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">이름</th>
                <th className="px-6 py-4">카테고리</th>
                <th className="px-6 py-4">상태</th>
                <th className="px-6 py-4">담당</th>
                <th className="px-6 py-4">수정일</th>
                <th className="px-6 py-4 text-right">링크</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComponents.map(comp => (
                <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{comp.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-semibold">
                      {comp.category_group || comp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(comp.status)}`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">Phoenixdarts 디자인실 디자인기획팀</td>
                  <td className="px-6 py-4 font-medium">{new Date(comp.updated_at).toLocaleDateString('ko-KR')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {comp.figma_link && (
                        <a href={comp.figma_link} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-gray-900 transition-colors" title="Figma">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      )}
                      <Link to={`/components/${comp.id}`} className="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="상세 보기">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredComponents.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
