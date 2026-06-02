import { useState } from 'react';
import { useTokens, type TokenItem } from '../hooks/useTokens';
import { useChangelog } from '../hooks/useChangelog';

export default function TokenManager() {
  const { tokens, saveToken, deleteToken } = useTokens();
  const { addLog } = useChangelog();
  const [activeTab, setActiveTab] = useState<TokenItem['category']>('color');
  const [showForm, setShowForm] = useState(false);
  
  // For new/edit token form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TokenItem>>({
    category: 'color',
    name: '',
    value: '',
    description: ''
  });

  const handleTabClick = (tab: TokenItem['category']) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditingId(null);
  };

  const filteredTokens = tokens.filter(t => t.category === activeTab);

  const resetForm = () => {
    setFormData({ category: activeTab, name: '', value: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditClick = (token: TokenItem) => {
    setFormData(token);
    setEditingId(token.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 토큰을 삭제하시겠습니까?')) {
      deleteToken(id);
      addLog({
        id: `cl-${Date.now()}`,
        target_id: id,
        target_type: 'token',
        action: 'deprecate',
        changed_by: 'Unknown',
        note: `토큰 삭제됨`,
        date: new Date().toISOString()
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return alert('이름과 값을 입력해주세요.');

    const isNew = !editingId;
    const targetId = isNew ? `t-${Date.now()}` : editingId;
    
    const newToken: TokenItem = {
      ...(formData as TokenItem),
      id: targetId,
      updated_at: new Date().toISOString()
    };

    saveToken(newToken);
    
    addLog({
      id: `cl-${Date.now()}`,
      target_id: targetId,
      target_type: 'token',
      action: isNew ? 'create' : 'update',
      changed_by: 'Unknown',
      note: `토큰 ${isNew ? '등록' : '업데이트'}됨: ${newToken.name}`,
      date: new Date().toISOString()
    });

    resetForm();
  };

  const tabs: TokenItem['category'][] = ['color', 'typography', 'spacing', 'radius', 'shadow'];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Manager</h1>
          <p className="text-gray-500 mt-2 text-lg">디자인 시스템 토큰 관리</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Tokens</h2>
        {!showForm && (
          <button 
            onClick={() => {
              setFormData({ category: activeTab, name: '', value: '', description: '' });
              setShowForm(true);
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            + 토큰 추가
          </button>
        )}
      </div>

      {/* Inline Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-blue-200 mb-8 space-y-4">
          <h3 className="font-bold text-gray-900 mb-2">{editingId ? '토큰 수정' : '신규 토큰 추가'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">카테고리</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as TokenItem['category']})}>
                {tabs.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="ex) primary-500" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">값 <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="ex) #3B82F6 또는 1rem" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">설명</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium">취소</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">저장</button>
          </div>
        </form>
      )}

      {/* Token List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map(token => (
          <div key={token.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {token.category === 'color' && (
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: token.value }}
                    />
                  )}
                  <h3 className="font-bold text-gray-900 text-lg">{token.name}</h3>
                </div>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg font-mono text-sm text-gray-700 mb-4 inline-block">
                {token.value}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                {token.description || '설명이 없습니다.'}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">마지막 수정: {new Date(token.updated_at).toLocaleDateString('ko-KR')}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(token)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">수정</button>
                <button onClick={() => handleDelete(token.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">삭제</button>
              </div>
            </div>
          </div>
        ))}
        {filteredTokens.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
            해당 카테고리의 토큰이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
