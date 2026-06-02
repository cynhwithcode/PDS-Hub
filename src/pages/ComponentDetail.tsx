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
      case 'stable': return 'bg-green-50 text-green-700 border-green-200';
      case 'beta': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'deprecated': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8" style={{ fontFamily: 'Pretendard, -apple-system, sans-serif' }}>
      <header className="flex justify-between items-start">
        <div>
          <button onClick={() => navigate('/components')} className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1">
            &larr; 목록으로 돌아가기
          </button>
          {isEditing ? (
            <input type="text" className="text-3xl font-extrabold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          ) : (
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{formData.name}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-600">v{formData.version}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-600">{formData.owner}</span>
              </div>
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

      <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-300 ${isEditing ? 'bg-blue-50/30 border-blue-200' : 'bg-white'}`}>
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

          {/* Anatomy Section */}
          {!isEditing && formData.anatomy && formData.anatomy.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Anatomy</h3>
              
              {formData.id === 'c-buttons' && (
                <div className="bg-[#F5F5F5] rounded-xl p-8 mb-6 flex justify-center items-center relative min-h-[200px] overflow-hidden">
                  <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Container (1) */}
                    <rect x="40" y="30" width="160" height="60" rx="8" fill="#3B82F6" opacity="0.1" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Icon (3) */}
                    <circle cx="70" cy="60" r="12" fill="#9CA3AF" />
                    {/* Text Label (2) */}
                    <rect x="95" y="52" width="75" height="16" rx="4" fill="#6B7280" />
                    {/* Badge 1 (Container) */}
                    <path d="M40 30 L20 15" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="15" cy="10" r="10" fill="white" stroke="#E5E7EB" />
                    <text x="15" y="14" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    {/* Badge 2 (Text Label) */}
                    <path d="M132 52 L132 15" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="132" cy="10" r="10" fill="white" stroke="#E5E7EB" />
                    <text x="132" y="14" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                    {/* Badge 3 (Icon) */}
                    <path d="M70 72 L70 95" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="70" cy="100" r="10" fill="white" stroke="#E5E7EB" />
                    <text x="70" y="104" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>
                  </svg>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-3 font-bold">번호</th>
                      <th className="px-5 py-3 font-bold">이름</th>
                      <th className="px-5 py-3 font-bold">설명</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {formData.anatomy.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100 even:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">{item.number}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-bold">{item.name}</td>
                        <td className="px-5 py-3 text-gray-600">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Variants Section */}
          {!isEditing && formData.variants && formData.variants.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.variants.map((item, idx) => (
                  <div key={idx} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {formData.id === 'c-buttons' && (
                      <div className="bg-[#F5F5F5] h-32 flex items-center justify-center p-4 border-b border-gray-100">
                        {item.name === 'Contained' || item.name === 'Primary' ? (
                          <div className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow-sm flex items-center gap-2">
                            <span>Button</span>
                          </div>
                        ) : item.name === 'Outlined' || item.name === 'Secondary' ? (
                          <div className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg font-medium text-sm shadow-sm flex items-center gap-2">
                            <span>Button</span>
                          </div>
                        ) : item.name === 'Ghost' ? (
                          <div className="bg-transparent text-blue-600 px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2">
                            <span>Button</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">Preview Area</div>
                        )}
                      </div>
                    )}
                    <div className={`p-5 border-l-4 flex-1 ${item.type === 'do' ? 'border-green-500' : item.type === 'dont' ? 'border-red-500' : 'border-gray-400'}`}>
                      <div className="font-bold text-gray-900 mb-2">{item.name}</div>
                      <div className="text-sm text-gray-600 leading-relaxed">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Usage Guidelines Section */}
          {!isEditing && formData.usage_guidelines && formData.usage_guidelines.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Usage Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {formData.usage_guidelines.filter(g => g.type === 'do').map((item, idx) => (
                    <div key={idx} className="bg-green-50 border-t-4 border-green-500 p-5 rounded-b-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-green-200 text-green-800 rounded-full">DO</span>
                        <h4 className="font-bold text-green-900 text-sm">{item.title}</h4>
                      </div>
                      <p className="text-sm text-green-800 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {formData.usage_guidelines.filter(g => g.type === 'dont').map((item, idx) => (
                    <div key={idx} className="bg-red-50 border-t-4 border-red-500 p-5 rounded-b-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-red-200 text-red-800 rounded-full">DON'T</span>
                        <h4 className="font-bold text-red-900 text-sm">{item.title}</h4>
                      </div>
                      <p className="text-sm text-red-800 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Spec Section */}
          {!isEditing && formData.spec && (formData.spec.sizes?.length > 0 || formData.spec.notes) && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Spec</h3>
              <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-8">
                {formData.spec.sizes && formData.spec.sizes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Sizes</h4>
                    {formData.id === 'c-buttons' ? (
                      <div className="flex items-end gap-12 h-32 p-6 bg-[#F5F5F5] rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 bg-blue-400 rounded-t-md h-10 shadow-sm"></div>
                          <span className="text-xs font-bold text-gray-600">Small</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 bg-blue-500 rounded-t-md h-14 shadow-sm"></div>
                          <span className="text-xs font-bold text-gray-600">Medium</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-24 bg-blue-600 rounded-t-md h-16 shadow-sm"></div>
                          <span className="text-xs font-bold text-gray-600">Large</span>
                        </div>
                      </div>
                    ) : (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {formData.spec.sizes.map((size, idx) => (
                          <li key={idx}>{size}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {formData.spec.notes && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">{formData.spec.notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Figma Properties Section */}
          {!isEditing && formData.figma_properties && formData.figma_properties.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Figma Properties</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-3 font-bold">Property</th>
                      <th className="px-5 py-3 font-bold">Values</th>
                      <th className="px-5 py-3 font-bold">Default</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {formData.figma_properties.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100 even:bg-gray-50 transition-colors hover:bg-gray-50">
                        <td className="px-5 py-3 text-gray-900 font-bold">{item.property}</td>
                        <td className="px-5 py-3 text-gray-600">{item.values}</td>
                        <td className="px-5 py-3">
                          <span className="bg-blue-100 text-blue-700 font-mono text-xs px-2.5 py-1 rounded-full font-medium inline-block">
                            {item.default}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

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
