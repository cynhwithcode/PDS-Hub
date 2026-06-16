import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponents, type ComponentItem } from '../hooks/useComponents';
import { useChangelog } from '../hooks/useChangelog';

export default function ComponentNew() {
  const navigate = useNavigate();
  const { saveComponent } = useComponents();
  const { addLog } = useChangelog();

  const [formData, setFormData] = useState<Partial<ComponentItem>>({
    name: '',
    category_group: 'Action',
    status: 'stable',
    owner: '디자인실 디자인기획팀',
    short_description: '',
    description: '',
    figma_link: '',
    dev_link: '',
    version: '1.0.0',
    anatomy: [],
    variants: [],
    usage_guidelines: [],
    spec: { sizes: [], notes: '' },
    figma_properties: [],
    version_history: [{ version: '1.0.0', date: new Date().toISOString().split('T')[0], note: '최초 컴포넌트 등록' }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('이름을 입력해주세요.');

    const newId = `c-${Date.now()}`;
    const newComp: ComponentItem = {
      ...(formData as ComponentItem),
      id: newId,
      category: formData.category_group || 'Action', // fallback
      updated_at: new Date().toISOString(),
    };

    saveComponent(newComp);
    
    addLog({
      id: `cl-${Date.now()}`,
      target_id: newId,
      target_type: 'component',
      action: 'create',
      changed_by: formData.owner || 'Unknown',
      note: `신규 컴포넌트 ${formData.name} 등록`,
      date: new Date().toISOString()
    });

    navigate('/components');
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">신규 컴포넌트 등록하기</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-12">
        
        {/* Basic Info */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Button, DatePicker..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">버전</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">카테고리 그룹</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.category_group} onChange={e => setFormData({...formData, category_group: e.target.value as any})}>
                <option value="Action">Action</option>
                <option value="Input">Input</option>
                <option value="Display">Display</option>
                <option value="Feedback">Feedback</option>
                <option value="Navigation">Navigation</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">상태</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">짧은 설명 (리스트용 1~2줄)</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" rows={2} value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="컴포넌트의 핵심 용도를 간결하게 적어주세요."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">상세 설명 (Overview)</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="상세한 설명이나 도입 배경 등을 작성할 수 있습니다."></textarea>
            </div>
          </div>
        </section>

        {/* Anatomy */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Anatomy (해부학적 구조)</h2>
          <div className="space-y-4">
            {formData.anatomy?.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <input type="number" className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.number} onChange={e => {
                  const newAnatomy = [...(formData.anatomy || [])];
                  newAnatomy[idx].number = parseInt(e.target.value);
                  setFormData({...formData, anatomy: newAnatomy});
                }} />
                <input type="text" className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.name} placeholder="영역 이름 (예: Container)" onChange={e => {
                  const newAnatomy = [...(formData.anatomy || [])];
                  newAnatomy[idx].name = e.target.value;
                  setFormData({...formData, anatomy: newAnatomy});
                }} />
                <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.description} placeholder="설명" onChange={e => {
                  const newAnatomy = [...(formData.anatomy || [])];
                  newAnatomy[idx].description = e.target.value;
                  setFormData({...formData, anatomy: newAnatomy});
                }} />
                <button type="button" onClick={() => {
                  const newAnatomy = [...(formData.anatomy || [])];
                  newAnatomy.splice(idx, 1);
                  setFormData({...formData, anatomy: newAnatomy});
                }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
              </div>
            ))}
            <button type="button" onClick={() => setFormData({...formData, anatomy: [...(formData.anatomy || []), { number: (formData.anatomy?.length || 0) + 1, name: '', description: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 구조 항목 추가</button>
          </div>
        </section>

        {/* Variants */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Variants (파생형)</h2>
          <div className="space-y-4">
            {formData.variants?.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start border-b pb-4 mb-4">
                <select className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.type} onChange={e => {
                  const newVariants = [...(formData.variants || [])];
                  newVariants[idx].type = e.target.value as any;
                  setFormData({...formData, variants: newVariants});
                }}>
                  <option value="do">Do (권장)</option>
                  <option value="dont">Don't (금지)</option>
                  <option value="neutral">Neutral (기본)</option>
                </select>
                <input type="text" className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.name} placeholder="Variant 이름 (예: Primary)" onChange={e => {
                  const newVariants = [...(formData.variants || [])];
                  newVariants[idx].name = e.target.value;
                  setFormData({...formData, variants: newVariants});
                }} />
                <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.description} placeholder="설명" onChange={e => {
                  const newVariants = [...(formData.variants || [])];
                  newVariants[idx].description = e.target.value;
                  setFormData({...formData, variants: newVariants});
                }} />
                <button type="button" onClick={() => {
                  const newVariants = [...(formData.variants || [])];
                  newVariants.splice(idx, 1);
                  setFormData({...formData, variants: newVariants});
                }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
              </div>
            ))}
            <button type="button" onClick={() => setFormData({...formData, variants: [...(formData.variants || []), { name: '', description: '', type: 'neutral' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ Variant 추가</button>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Usage Guidelines (사용 가이드라인)</h2>
          <div className="space-y-4">
            {formData.usage_guidelines?.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start border-b pb-4 mb-4">
                <select className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.type} onChange={e => {
                  const newUsage = [...(formData.usage_guidelines || [])];
                  newUsage[idx].type = e.target.value as any;
                  setFormData({...formData, usage_guidelines: newUsage});
                }}>
                  <option value="do">Do</option>
                  <option value="dont">Don't</option>
                </select>
                <input type="text" className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.title} placeholder="규칙 제목" onChange={e => {
                  const newUsage = [...(formData.usage_guidelines || [])];
                  newUsage[idx].title = e.target.value;
                  setFormData({...formData, usage_guidelines: newUsage});
                }} />
                <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.description} placeholder="상세 설명" onChange={e => {
                  const newUsage = [...(formData.usage_guidelines || [])];
                  newUsage[idx].description = e.target.value;
                  setFormData({...formData, usage_guidelines: newUsage});
                }} />
                <button type="button" onClick={() => {
                  const newUsage = [...(formData.usage_guidelines || [])];
                  newUsage.splice(idx, 1);
                  setFormData({...formData, usage_guidelines: newUsage});
                }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
              </div>
            ))}
            <button type="button" onClick={() => setFormData({...formData, usage_guidelines: [...(formData.usage_guidelines || []), { type: 'do', title: '', description: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ 가이드라인 추가</button>
          </div>
        </section>

        {/* Spec & Figma Properties */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Spec & Figma Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Size Spec (쉼표로 구분)</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.spec?.sizes.join(', ') || ''} onChange={e => {
                const sizes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFormData({...formData, spec: { ...formData.spec, sizes, notes: formData.spec?.notes || '' }});
              }} placeholder="예: Small: h-32, Medium: h-40" />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Spec Notes</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm h-20" value={formData.spec?.notes || ''} onChange={e => {
                setFormData({...formData, spec: { ...formData.spec, sizes: formData.spec?.sizes || [], notes: e.target.value }});
              }} placeholder="그 외 기타 특이사항 작성" />
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Figma 속성 테이블</h3>
            {formData.figma_properties?.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input type="text" className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.property} placeholder="Property (예: Type)" onChange={e => {
                  const newProps = [...(formData.figma_properties || [])];
                  newProps[idx].property = e.target.value;
                  setFormData({...formData, figma_properties: newProps});
                }} />
                <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.values} placeholder="Values (예: Primary, Secondary)" onChange={e => {
                  const newProps = [...(formData.figma_properties || [])];
                  newProps[idx].values = e.target.value;
                  setFormData({...formData, figma_properties: newProps});
                }} />
                <input type="text" className="w-1/4 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={item.default} placeholder="Default (예: Primary)" onChange={e => {
                  const newProps = [...(formData.figma_properties || [])];
                  newProps[idx].default = e.target.value;
                  setFormData({...formData, figma_properties: newProps});
                }} />
                <button type="button" onClick={() => {
                  const newProps = [...(formData.figma_properties || [])];
                  newProps.splice(idx, 1);
                  setFormData({...formData, figma_properties: newProps});
                }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">&times;</button>
              </div>
            ))}
            <button type="button" onClick={() => setFormData({...formData, figma_properties: [...(formData.figma_properties || []), { property: '', values: '', default: '' }]})} className="text-sm text-blue-600 font-medium hover:underline">+ Figma 속성 추가</button>
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Figma 링크</label>
              <input type="url" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.figma_link} onChange={e => setFormData({...formData, figma_link: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">개발 문서 링크</label>
              <input type="url" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" value={formData.dev_link} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/components')} className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
            취소
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
