import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComponents } from '../hooks/useComponents';

export default function ComponentRegistry() {
  const { components } = useComponents();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(components.map(c => c.category));
    return Array.from(cats);
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [components, searchTerm, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'deprecated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Component Registry</h1>
          <p className="text-gray-500 mt-2 text-lg">컴포넌트 목록 및 상태 관리</p>
        </div>
        <Link 
          to="/components/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          + 신규 컴포넌트 등재
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
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

        <select 
          className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">모든 카테고리</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map(comp => (
          <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{comp.name}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(comp.status)}`}>
                {comp.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-2">
              {comp.description}
            </p>

            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>카테고리:</span>
                <span className="font-medium text-gray-900">{comp.category}</span>
              </div>
              <div className="flex justify-between">
                <span>담당자:</span>
                <span className="font-medium text-gray-900">{comp.owner}</span>
              </div>
              <div className="flex justify-between">
                <span>최근 수정:</span>
                <span className="font-medium text-gray-900">{new Date(comp.updated_at).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {comp.figma_link && (
                <a 
                  href={comp.figma_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Figma
                </a>
              )}
              <Link 
                to={`/components/${comp.id}`} 
                className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                상세 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredComponents.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
