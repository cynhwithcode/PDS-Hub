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

  const renderThumbnailSVG = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('button')) {
      return <svg className="w-24 h-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="6" width="18" height="12" rx="4" /></svg>;
    } else if (lower.includes('input') || lower.includes('textfield')) {
      return <svg className="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="8" width="18" height="8" rx="2" /><path strokeLinecap="round" d="M6 10v4" /></svg>;
    } else if (lower.includes('modal') || lower.includes('dialog')) {
      return <svg className="w-24 h-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="4" width="16" height="16" rx="2" /><path strokeLinecap="round" d="M4 10h16M10 4v16" /></svg>;
    } else if (lower.includes('badge')) {
      return <svg className="w-24 h-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="6" y="8" width="12" height="8" rx="4" /></svg>;
    } else if (lower.includes('date') || lower.includes('calendar')) {
      return <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4m8-4v4" /></svg>;
    } else if (lower.includes('dropdown')) {
      return <svg className="w-24 h-24 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="8" width="18" height="8" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11l-3 3-3-3" /></svg>;
    }
    return <div className="text-4xl font-bold text-gray-300">{name.substring(0,2).toUpperCase()}</div>;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'anatomy', label: 'Anatomy' },
    { id: 'variants', label: 'Variants' },
    { id: 'usage', label: 'Usage Guidelines' },
    { id: 'spec', label: 'Spec & Figma Properties' },
    { id: 'version', label: '버전 이력' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <button onClick={() => navigate('/components')} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            &larr; 목록으로 돌아가기
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">취소</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">저장</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                편집하기
              </button>
            )}
          </div>
        </div>

        <div>
          {isEditing ? (
            <div className="space-y-4 max-w-2xl">
              <input type="text" className="text-3xl font-extrabold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="컴포넌트 이름" />
              <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600" value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="짧은 설명 (1~2줄)" rows={2} />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">상태</span>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="stable">Stable</option>
                    <option value="beta">Beta</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">버전</span>
                  <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">카테고리 그룹</span>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={formData.category_group || ''} onChange={e => setFormData({...formData, category_group: e.target.value as any})}>
                    <option value="Action">Action</option>
                    <option value="Input">Input</option>
                    <option value="Display">Display</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Navigation">Navigation</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{formData.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-600">v{formData.version}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-600">Phoenixdarts 디자인실 디자인기획팀</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-600">{formData.category_group || formData.category}</span>
              </div>
              <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">{formData.short_description}</p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            {isEditing ? (
              <div className="flex gap-4 w-full max-w-2xl">
                <input type="url" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="Figma 링크" value={formData.figma_link || ''} onChange={e => setFormData({...formData, figma_link: e.target.value})} />
                <input type="url" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="Dev 링크" value={formData.dev_link || ''} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
              </div>
            ) : (
              <>
                {formData.figma_link && (
                  <a href={formData.figma_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Figma
                  </a>
                )}
                {formData.dev_link && (
                  <a href={formData.dev_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    개발 문서
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-[#FAFAFA] pt-4 pb-2 border-b border-gray-200">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className="py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sections Container */}
      <div className={`space-y-16 pb-32 transition-colors duration-300 ${isEditing ? 'bg-blue-50/20 p-6 rounded-2xl border border-blue-100' : ''}`}>
        
        {/* Overview */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Overview</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 flex items-center justify-center bg-[#F5F5F5] border-b border-gray-100 relative">
              {renderThumbnailSVG(formData.name)}
              {isEditing && (
                <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
                  썸네일은 컴포넌트 이름 기반 자동 렌더링
                </div>
              )}
            </div>
            <div className="p-8">
              {isEditing ? (
                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="상세한 컴포넌트 용도 및 설명을 작성하세요." />
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{formData.description || '상세 설명이 없습니다.'}</p>
              )}
            </div>
          </div>
        </section>

        {/* Anatomy */}
        <section id="anatomy" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Anatomy</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {isEditing ? (
              <div className="space-y-4">
                {formData.anatomy?.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <input type="number" className="w-16 border border-gray-300 rounded px-3 py-2 text-sm" value={item.number} onChange={e => {
                      const newAnatomy = [...(formData.anatomy || [])];
                      newAnatomy[idx].number = parseInt(e.target.value);
                      setFormData({...formData, anatomy: newAnatomy});
                    }} />
                    <input type="text" className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm" value={item.name} placeholder="구조 이름" onChange={e => {
                      const newAnatomy = [...(formData.anatomy || [])];
                      newAnatomy[idx].name = e.target.value;
                      setFormData({...formData, anatomy: newAnatomy});
                    }} />
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" value={item.description} placeholder="설명" onChange={e => {
                      const newAnatomy = [...(formData.anatomy || [])];
                      newAnatomy[idx].description = e.target.value;
                      setFormData({...formData, anatomy: newAnatomy});
                    }} />
                    <button onClick={() => {
                      const newAnatomy = [...(formData.anatomy || [])];
                      newAnatomy.splice(idx, 1);
                      setFormData({...formData, anatomy: newAnatomy});
                    }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
                  </div>
                ))}
                <button onClick={() => setFormData({...formData, anatomy: [...(formData.anatomy || []), { number: (formData.anatomy?.length || 0) + 1, name: '', description: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 항목 추가</button>
              </div>
            ) : (
              <ul className="space-y-6">
                {formData.anatomy && formData.anatomy.length > 0 ? formData.anatomy.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">{item.number}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </li>
                )) : <div className="text-gray-400 italic text-sm">해부학적 구조 정보가 없습니다.</div>}
              </ul>
            )}
          </div>
        </section>

        {/* Variants */}
        <section id="variants" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Variants</h2>
          {isEditing ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
              {formData.variants?.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b pb-4 mb-4">
                  <select className="w-32 border border-gray-300 rounded px-3 py-2 text-sm" value={item.type} onChange={e => {
                    const newVariants = [...(formData.variants || [])];
                    newVariants[idx].type = e.target.value as any;
                    setFormData({...formData, variants: newVariants});
                  }}>
                    <option value="do">Do (권장)</option>
                    <option value="dont">Don't (금지)</option>
                    <option value="neutral">Neutral (기본)</option>
                  </select>
                  <input type="text" className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm" value={item.name} placeholder="Variant 이름" onChange={e => {
                    const newVariants = [...(formData.variants || [])];
                    newVariants[idx].name = e.target.value;
                    setFormData({...formData, variants: newVariants});
                  }} />
                  <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" value={item.description} placeholder="설명" onChange={e => {
                    const newVariants = [...(formData.variants || [])];
                    newVariants[idx].description = e.target.value;
                    setFormData({...formData, variants: newVariants});
                  }} />
                  <button onClick={() => {
                    const newVariants = [...(formData.variants || [])];
                    newVariants.splice(idx, 1);
                    setFormData({...formData, variants: newVariants});
                  }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
                </div>
              ))}
              <button onClick={() => setFormData({...formData, variants: [...(formData.variants || []), { name: '', description: '', type: 'neutral' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ Variant 추가</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.variants && formData.variants.length > 0 ? formData.variants.map((item, idx) => {
                let borderClass = 'border-gray-200';
                let badge = null;
                if (item.type === 'do') {
                  borderClass = 'border-l-4 border-l-green-500 border-gray-200';
                  badge = <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Do</span>;
                } else if (item.type === 'dont') {
                  borderClass = 'border-l-4 border-l-red-500 border-gray-200';
                  badge = <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Don't</span>;
                }

                return (
                  <div key={idx} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-2 ${borderClass}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      {badge}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                );
              }) : <div className="text-gray-400 italic text-sm">Variants 정보가 없습니다.</div>}
            </div>
          )}
        </section>

        {/* Usage Guidelines */}
        <section id="usage" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Usage Guidelines</h2>
          {isEditing ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
              {formData.usage_guidelines?.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b pb-4 mb-4">
                  <select className="w-24 border border-gray-300 rounded px-3 py-2 text-sm" value={item.type} onChange={e => {
                    const newUsage = [...(formData.usage_guidelines || [])];
                    newUsage[idx].type = e.target.value as any;
                    setFormData({...formData, usage_guidelines: newUsage});
                  }}>
                    <option value="do">Do</option>
                    <option value="dont">Don't</option>
                  </select>
                  <input type="text" className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm" value={item.title} placeholder="규칙 제목" onChange={e => {
                    const newUsage = [...(formData.usage_guidelines || [])];
                    newUsage[idx].title = e.target.value;
                    setFormData({...formData, usage_guidelines: newUsage});
                  }} />
                  <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" value={item.description} placeholder="상세 규칙 설명" onChange={e => {
                    const newUsage = [...(formData.usage_guidelines || [])];
                    newUsage[idx].description = e.target.value;
                    setFormData({...formData, usage_guidelines: newUsage});
                  }} />
                  <button onClick={() => {
                    const newUsage = [...(formData.usage_guidelines || [])];
                    newUsage.splice(idx, 1);
                    setFormData({...formData, usage_guidelines: newUsage});
                  }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
                </div>
              ))}
              <button onClick={() => setFormData({...formData, usage_guidelines: [...(formData.usage_guidelines || []), { type: 'do', title: '', description: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 규칙 추가</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {formData.usage_guidelines && formData.usage_guidelines.length > 0 ? formData.usage_guidelines.map((item, idx) => {
                const isDo = item.type === 'do';
                const pillClass = isDo ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-400 text-red-700';
                const icon = isDo ? '✓ Do' : '✕ Don\'t';
                
                return (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${pillClass}`}>
                      {icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                );
              }) : <div className="text-gray-400 italic text-sm">가이드라인이 없습니다.</div>}
            </div>
          )}
        </section>

        {/* Spec & Figma Properties */}
        <section id="spec" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Spec & Figma Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="font-bold text-gray-900 mb-4">Size Specifications</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Sizes (쉼표로 구분)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={formData.spec?.sizes.join(', ') || ''} onChange={e => {
                      const sizes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setFormData({...formData, spec: { ...formData.spec, sizes, notes: formData.spec?.notes || '' }});
                    }} placeholder="Small: h-32, Medium: h-40..." />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                    <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24" value={formData.spec?.notes || ''} onChange={e => {
                      setFormData({...formData, spec: { ...formData.spec, sizes: formData.spec?.sizes || [], notes: e.target.value }});
                    }} placeholder="기타 특이사항" />
                  </div>
                </div>
              ) : (
                <>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-6">
                    {formData.spec?.sizes && formData.spec.sizes.length > 0 ? formData.spec.sizes.map((s, i) => (
                      <li key={i}>{s}</li>
                    )) : <li className="text-gray-400 italic list-none">사이즈 정보 없음</li>}
                  </ul>
                  {formData.spec?.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600">
                      <strong>Note:</strong> {formData.spec.notes}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-hidden">
              <h3 className="font-bold text-gray-900 mb-4">Figma Component Properties</h3>
              {isEditing ? (
                <div className="space-y-4">
                  {formData.figma_properties?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <input type="text" className="w-1/4 border border-gray-300 rounded px-2 py-1.5 text-sm" value={item.property} placeholder="Property" onChange={e => {
                        const newProps = [...(formData.figma_properties || [])];
                        newProps[idx].property = e.target.value;
                        setFormData({...formData, figma_properties: newProps});
                      }} />
                      <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={item.values} placeholder="Values (쉼표 구분)" onChange={e => {
                        const newProps = [...(formData.figma_properties || [])];
                        newProps[idx].values = e.target.value;
                        setFormData({...formData, figma_properties: newProps});
                      }} />
                      <input type="text" className="w-1/4 border border-gray-300 rounded px-2 py-1.5 text-sm" value={item.default} placeholder="Default" onChange={e => {
                        const newProps = [...(formData.figma_properties || [])];
                        newProps[idx].default = e.target.value;
                        setFormData({...formData, figma_properties: newProps});
                      }} />
                      <button onClick={() => {
                        const newProps = [...(formData.figma_properties || [])];
                        newProps.splice(idx, 1);
                        setFormData({...formData, figma_properties: newProps});
                      }} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">&times;</button>
                    </div>
                  ))}
                  <button onClick={() => setFormData({...formData, figma_properties: [...(formData.figma_properties || []), { property: '', values: '', default: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 속성 추가</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="pb-2 font-medium">Property</th>
                        <th className="pb-2 font-medium">Values</th>
                        <th className="pb-2 font-medium">Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.figma_properties && formData.figma_properties.length > 0 ? formData.figma_properties.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-semibold text-gray-900">{item.property}</td>
                          <td className="py-3 text-gray-600">{item.values}</td>
                          <td className="py-3 text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.default}</span></td>
                        </tr>
                      )) : <tr><td colSpan={3} className="py-4 text-center text-gray-400 italic">속성 정보가 없습니다.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Version History */}
        <section id="version" className="scroll-mt-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-t pt-6">Version History</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {isEditing ? (
              <div className="space-y-4">
                {formData.version_history?.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start border-b pb-4 mb-4">
                    <input type="text" className="w-24 border border-gray-300 rounded px-3 py-2 text-sm" value={item.version} placeholder="v1.0.0" onChange={e => {
                      const newHist = [...(formData.version_history || [])];
                      newHist[idx].version = e.target.value;
                      setFormData({...formData, version_history: newHist});
                    }} />
                    <input type="date" className="w-40 border border-gray-300 rounded px-3 py-2 text-sm" value={item.date} onChange={e => {
                      const newHist = [...(formData.version_history || [])];
                      newHist[idx].date = e.target.value;
                      setFormData({...formData, version_history: newHist});
                    }} />
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" value={item.note} placeholder="변경 내용" onChange={e => {
                      const newHist = [...(formData.version_history || [])];
                      newHist[idx].note = e.target.value;
                      setFormData({...formData, version_history: newHist});
                    }} />
                    <button onClick={() => {
                      const newHist = [...(formData.version_history || [])];
                      newHist.splice(idx, 1);
                      setFormData({...formData, version_history: newHist});
                    }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
                  </div>
                ))}
                <button onClick={() => setFormData({...formData, version_history: [...(formData.version_history || []), { version: '', date: new Date().toISOString().split('T')[0], note: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 기록 추가</button>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {formData.version_history && formData.version_history.length > 0 ? [...formData.version_history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">v{item.version}</h4>
                        <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.note}</p>
                    </div>
                  </div>
                )) : <div className="text-center text-gray-400 italic text-sm">버전 이력이 없습니다.</div>}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
