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
    category: 'Action',
    status: 'stable',
    owner: '',
    description: '',
    figma_link: '',
    dev_link: '',
    usage_do: [],
    usage_dont: [],
    version: '1.0.0'
  });

  const [doInput, setDoInput] = useState('');
  const [dontInput, setDontInput] = useState('');

  const handleAddDo = () => {
    if (doInput.trim() && formData.usage_do) {
      setFormData({ ...formData, usage_do: [...formData.usage_do, doInput.trim()] });
      setDoInput('');
    }
  };

  const handleAddDont = () => {
    if (dontInput.trim() && formData.usage_dont) {
      setFormData({ ...formData, usage_dont: [...formData.usage_dont, dontInput.trim()] });
      setDontInput('');
    }
  };

  const handleRemoveDo = (index: number) => {
    if (formData.usage_do) {
      const newDo = [...formData.usage_do];
      newDo.splice(index, 1);
      setFormData({ ...formData, usage_do: newDo });
    }
  };

  const handleRemoveDont = (index: number) => {
    if (formData.usage_dont) {
      const newDont = [...formData.usage_dont];
      newDont.splice(index, 1);
      setFormData({ ...formData, usage_dont: newDont });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('이름을 입력해주세요.');

    const newId = `c-${Date.now()}`;
    const newComp: ComponentItem = {
      ...(formData as ComponentItem),
      id: newId,
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
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">신규 컴포넌트 등재</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">담당자</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Action">Action</option>
              <option value="Input">Input</option>
              <option value="Layout">Layout</option>
              <option value="Data Display">Data Display</option>
              <option value="Overlay">Overlay</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">상태</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">설명</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">사용해야 할 때 (Do)</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 border border-gray-300 rounded-lg px-4 py-2" value={doInput} onChange={e => setDoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddDo())} />
              <button type="button" onClick={handleAddDo} className="bg-gray-100 px-4 rounded-lg font-medium">추가</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.usage_do?.map((item, idx) => (
                <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {item} <button type="button" onClick={() => handleRemoveDo(idx)} className="text-green-900 font-bold ml-1">&times;</button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">사용하면 안 될 때 (Don't)</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 border border-gray-300 rounded-lg px-4 py-2" value={dontInput} onChange={e => setDontInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddDont())} />
              <button type="button" onClick={handleAddDont} className="bg-gray-100 px-4 rounded-lg font-medium">추가</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.usage_dont?.map((item, idx) => (
                <span key={idx} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {item} <button type="button" onClick={() => handleRemoveDont(idx)} className="text-red-900 font-bold ml-1">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Figma 링크</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.figma_link} onChange={e => setFormData({...formData, figma_link: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">개발 링크 (Storybook 등)</label>
            <input type="url" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={formData.dev_link} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/components')} className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
            취소
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
