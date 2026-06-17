import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTokens, type TokenItem } from '../hooks/useTokens';
import { useChangelog } from '../hooks/useChangelog';

export default function TokenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tokens, saveToken } = useTokens();
  const { addLog } = useChangelog();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TokenItem | null>(null);
  
  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');

  useEffect(() => {
    const token = tokens.find(t => t.id === id);
    if (token) {
      setFormData(token);
    }
  }, [id, tokens]);

  if (!formData) return <div className="p-10 text-center text-gray-500">토큰을 찾을 수 없습니다.</div>;

  const handleSave = () => {
    const updatedToken = { 
      ...formData, 
      updated_at: new Date().toISOString() 
    };
    saveToken(updatedToken);
    
    addLog({
      id: `cl-${Date.now()}`,
      target_id: updatedToken.id,
      target_type: 'token',
      action: 'update',
      changed_by: updatedToken.owner || 'Unknown',
      note: `${updatedToken.name} 토큰 상세 정보 업데이트`,
      date: new Date().toISOString()
    });

    setIsEditing(false);
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'stable': return 'bg-green-50 text-green-700 border-green-200';
      case 'beta': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'deprecated': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <header className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Token Registry</h1>
            <p className="text-gray-500 mt-2 text-sm">디자인 시스템 토큰 목록 및 상세 관리</p>
          </div>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">취소</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">저장</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                편집하기
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="border-b border-gray-200 pb-4">
            <input 
              type="text" 
              className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
        ) : (
          <div className="flex items-center flex-wrap gap-4 text-sm pb-4 border-b border-gray-200">
            <button onClick={() => navigate('/tokens')} className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors">
              &larr; 토큰 목록으로
            </button>
            <div className="w-px h-5 bg-gray-300"></div>
            <span className="text-xl font-bold text-gray-900">{formData.name}</span>
            <div className="flex items-center gap-2.5 ml-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(formData.status || 'stable')}`}>
                {formData.status || 'stable'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium text-gray-600">v{formData.version || '1.0.0'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium text-gray-600">{formData.owner || '담당자 미지정'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-bold text-blue-600 capitalize">{formData.tier || 'core'}</span>
            </div>
          </div>
        )}
      </header>

      <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-300 ${isEditing ? 'bg-blue-50/30 border-blue-200' : 'bg-white'}`}>
        <div className="p-6 border-b border-gray-100 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">상태</span>
            {isEditing ? (
              <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.status || 'stable'} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="deprecated">Deprecated</option>
              </select>
            ) : (
              <span className="text-gray-900 font-medium capitalize">{formData.status || 'stable'}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">카테고리</span>
            {isEditing ? (
              <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm capitalize" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="color">Color</option>
                <option value="typography">Typography</option>
                <option value="spacing">Spacing</option>
                <option value="radius">Radius</option>
                <option value="shadow">Shadow</option>
              </select>
            ) : (
              <span className="text-gray-900 font-medium capitalize">{formData.category}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">담당자</span>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.owner || ''} onChange={e => setFormData({...formData, owner: e.target.value})} />
            ) : (
              <span className="text-gray-900 font-medium">{formData.owner || '-'}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">버전</span>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.version || ''} onChange={e => setFormData({...formData, version: e.target.value})} />
            ) : (
              <span className="text-gray-900 font-medium">{formData.version || '1.0.0'}</span>
            )}
          </div>
        </div>

        <div className="p-8 space-y-10">
          
          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">토큰 값 (Value)</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 font-mono text-sm">
              {formData.tier === 'core' || !formData.tier ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">Value:</span>
                  <span className="font-bold text-gray-900">{typeof formData.value === 'string' ? formData.value : '-'}</span>
                  {formData.category === 'color' && typeof formData.value === 'string' && (
                    <span className="w-6 h-6 rounded border border-gray-200 ml-2" style={{ backgroundColor: formData.value }}></span>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 w-24">Light Mode:</span>
                    <span className="font-bold text-gray-900">{typeof formData.value === 'object' ? formData.value.light : '-'}</span>
                    {formData.category === 'color' && typeof formData.value === 'object' && (
                      <span className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: formData.value.light }}></span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 w-24">Dark Mode:</span>
                    <span className="font-bold text-gray-900">{typeof formData.value === 'object' ? formData.value.dark : '-'}</span>
                    {formData.category === 'color' && typeof formData.value === 'object' && (
                      <span className="w-6 h-6 rounded border border-gray-600" style={{ backgroundColor: formData.value.dark }}></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">설명 (Description)</h3>
            {isEditing ? (
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            ) : (
              <p className="text-gray-700 leading-relaxed">{formData.description || '설명이 없습니다.'}</p>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
                <span className="text-green-500">✓</span> Do (사용해야 할 때)
              </h3>
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" value={doInput} onChange={e => setDoInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (doInput.trim()) { setFormData({...formData, usage_do: [...(formData.usage_do||[]), doInput.trim()]}); setDoInput(''); } } }} />
                    <button type="button" className="bg-gray-100 px-3 rounded text-sm" onClick={() => { if (doInput.trim()) { setFormData({...formData, usage_do: [...(formData.usage_do||[]), doInput.trim()]}); setDoInput(''); } }}>추가</button>
                  </div>
                  <ul className="space-y-2">
                    {formData.usage_do?.map((item, idx) => (
                      <li key={idx} className="flex justify-between bg-green-50 px-3 py-2 rounded text-sm text-green-900">
                        {item} <button onClick={() => setFormData({...formData, usage_do: formData.usage_do?.filter((_, i) => i !== idx)})} className="text-green-700 font-bold">&times;</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {formData.usage_do && formData.usage_do.length > 0 ? formData.usage_do.map((item, idx) => (
                    <li key={idx} className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 rounded-full px-4 py-1.5 text-sm font-medium">
                      <span className="font-bold">✓</span> {item}
                    </li>
                  )) : <li className="text-gray-400 italic text-sm">내용이 없습니다.</li>}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
                <span className="text-red-500">✕</span> Don't (사용하면 안 될 때)
              </h3>
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" value={dontInput} onChange={e => setDontInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (dontInput.trim()) { setFormData({...formData, usage_dont: [...(formData.usage_dont||[]), dontInput.trim()]}); setDontInput(''); } } }} />
                    <button type="button" className="bg-gray-100 px-3 rounded text-sm" onClick={() => { if (dontInput.trim()) { setFormData({...formData, usage_dont: [...(formData.usage_dont||[]), dontInput.trim()]}); setDontInput(''); } }}>추가</button>
                  </div>
                  <ul className="space-y-2">
                    {formData.usage_dont?.map((item, idx) => (
                      <li key={idx} className="flex justify-between bg-red-50 px-3 py-2 rounded text-sm text-red-900">
                        {item} <button onClick={() => setFormData({...formData, usage_dont: formData.usage_dont?.filter((_, i) => i !== idx)})} className="text-red-700 font-bold">&times;</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {formData.usage_dont && formData.usage_dont.length > 0 ? formData.usage_dont.map((item, idx) => (
                    <li key={idx} className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 rounded-full px-4 py-1.5 text-sm font-medium">
                      <span className="font-bold">✕</span> {item}
                    </li>
                  )) : <li className="text-gray-400 italic text-sm">내용이 없습니다.</li>}
                </ul>
              )}
            </section>
          </div>

          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Links</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Figma:</span>
                {isEditing ? (
                  <input type="url" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64" value={formData.figma_link || ''} onChange={e => setFormData({...formData, figma_link: e.target.value})} />
                ) : (
                  formData.figma_link ? <a href={formData.figma_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"><svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Figma 링크</a> : <span className="text-gray-400 italic text-sm">링크 없음</span>
                )}
              </div>
              
              {!isEditing && <span className="w-px h-6 bg-gray-200 hidden md:block"></span>}
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Dev Link:</span>
                {isEditing ? (
                  <input type="url" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64" value={formData.dev_link || ''} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
                ) : (
                  formData.dev_link ? <a href={formData.dev_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"><svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>개발 문서</a> : <span className="text-gray-400 italic text-sm">링크 없음</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
