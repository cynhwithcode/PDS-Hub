import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComponents, type ComponentItem } from '../hooks/useComponents';
import { useChangelog } from '../hooks/useChangelog';

export default function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { components, saveComponent } = useComponents();
  const { addLog } = useChangelog();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ComponentItem | null>(null);
  
  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');

  useEffect(() => {
    const comp = components.find(c => c.id === id);
    if (comp) {
      setFormData(comp);
    }
  }, [id, components]);

  if (!formData) return <div className="p-10 text-center text-gray-500">컴포넌트를 찾을 수 없습니다.</div>;

  const handleSave = () => {
    const updatedComp = { ...formData, updated_at: new Date().toISOString() };
    saveComponent(updatedComp);
    
    addLog({
      id: `cl-${Date.now()}`,
      target_id: updatedComp.id,
      target_type: 'component',
      action: 'update',
      changed_by: updatedComp.owner || 'Unknown',
      note: `${updatedComp.name} 상세 정보 업데이트`,
      date: new Date().toISOString()
    });

    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'stable': return 'bg-green-100 text-green-800 border-green-200';
      case 'beta': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deprecated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <button onClick={() => navigate('/components')} className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1">
            &larr; 목록으로 돌아가기
          </button>
          {isEditing ? (
            <input type="text" className="text-3xl font-extrabold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          ) : (
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{formData.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize border ${getStatusColor(formData.status)}`}>
                {formData.status}
              </span>
            </div>
          )}
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
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">상태</span>
            {isEditing ? (
              <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="deprecated">Deprecated</option>
              </select>
            ) : (
              <span className="text-gray-900 font-medium capitalize">{formData.status}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">카테고리</span>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            ) : (
              <span className="text-gray-900 font-medium">{formData.category}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">담당자</span>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
            ) : (
              <span className="text-gray-900 font-medium">{formData.owner}</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">버전</span>
            {isEditing ? (
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
            ) : (
              <span className="text-gray-900 font-medium">{formData.version}</span>
            )}
          </div>
        </div>

        <div className="p-8 space-y-10">
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
                <ul className="space-y-3">
                  {formData.usage_do && formData.usage_do.length > 0 ? formData.usage_do.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700"><span className="text-green-500 font-bold">✓</span> {item}</li>
                  )) : <li className="text-gray-400 italic">내용이 없습니다.</li>}
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
                <ul className="space-y-3">
                  {formData.usage_dont && formData.usage_dont.length > 0 ? formData.usage_dont.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700"><span className="text-red-500 font-bold">✕</span> {item}</li>
                  )) : <li className="text-gray-400 italic">내용이 없습니다.</li>}
                </ul>
              )}
            </section>
          </div>

          <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Links</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Figma</span>
                {isEditing ? (
                  <input type="url" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" value={formData.figma_link || ''} onChange={e => setFormData({...formData, figma_link: e.target.value})} />
                ) : (
                  formData.figma_link ? <a href={formData.figma_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{formData.figma_link}</a> : <span className="text-gray-400 italic">링크 없음</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-gray-500">Dev Link</span>
                {isEditing ? (
                  <input type="url" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" value={formData.dev_link || ''} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
                ) : (
                  formData.dev_link ? <a href={formData.dev_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{formData.dev_link}</a> : <span className="text-gray-400 italic">링크 없음</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
