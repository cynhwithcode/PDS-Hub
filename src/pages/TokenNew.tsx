import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokens, type TokenItem } from '../hooks/useTokens';

export default function TokenNew() {
  const navigate = useNavigate();
  const { saveToken } = useTokens();

  const [tier, setTier] = useState<'core' | 'semantic'>('semantic');
  const [category, setCategory] = useState<string>('color');
  const [nameInput, setNameInput] = useState('');
  const [coreValue, setCoreValue] = useState('');
  const [lightValue, setLightValue] = useState('');
  const [darkValue, setDarkValue] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    { id: 'color', name: 'Color' },
    { id: 'typography', name: 'Typography' },
    { id: 'spacing', name: 'Spacing' },
    { id: 'radius', name: 'Radius' },
    { id: 'shadow', name: 'Shadow' },
    { id: 'iconography', name: 'Iconography' },
  ];

  const prefix = `${category}.${tier}.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullTokenName = `${prefix}${nameInput}`;
    
    let tokenValue: string | { light: string; dark: string };
    if (tier === 'core') {
      tokenValue = coreValue;
    } else {
      tokenValue = {
        light: lightValue,
        dark: darkValue
      };
    }

    const newToken: TokenItem = {
      id: `t-${Date.now()}`,
      category,
      tier,
      name: fullTokenName,
      value: tokenValue,
      description,
      updated_at: new Date().toISOString()
    };

    saveToken(newToken);
    navigate('/tokens');
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/tokens')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="뒤로 가기"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">신규 토큰 등록하기</h1>
          <p className="text-gray-500 mt-1">디자인 시스템에 새로운 디자인 토큰을 추가합니다.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Category & Tier Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">카테고리 (Category) <span className="text-red-500">*</span></label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">티어 (Tier) <span className="text-red-500">*</span></label>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setTier('semantic')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tier === 'semantic' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Semantic
              </button>
              <button
                type="button"
                onClick={() => setTier('core')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tier === 'core' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Core (Palette)
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Token Name (Prefix guide) */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">토큰 이름 (Name) <span className="text-red-500">*</span></label>
          <div className="flex shadow-sm rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
            <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 text-sm font-mono border-r border-gray-200 select-none">
              {prefix}
            </span>
            <input 
              type="text" 
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={category === 'color' && tier === 'semantic' ? 'primary.strong' : 'white'}
              className="flex-1 min-w-0 block w-full px-4 py-3 bg-white text-gray-900 font-mono text-sm border-0 focus:ring-0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">접두사(Prefix) 뒤에 들어갈 구체적인 이름만 입력해 주세요. (영소문자, 숫자, 마침표(.) 사용 권장)</p>
        </div>

        {/* Token Value */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">토큰 값 (Value) <span className="text-red-500">*</span></label>
          {tier === 'core' ? (
            <input 
              type="text" 
              required
              value={coreValue}
              onChange={(e) => setCoreValue(e.target.value)}
              placeholder={category === 'color' ? '#FFFFFF' : '16px'}
              className="w-full bg-white border border-gray-200 text-gray-900 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.929 15.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zM6.485 5.778a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" /></svg>
                  라이트 모드 (Light Mode)
                </label>
                <input 
                  type="text" 
                  required
                  value={lightValue}
                  onChange={(e) => setLightValue(e.target.value)}
                  placeholder={category === 'color' ? 'color.palette.gray.900' : ''}
                  className="w-full bg-white border border-gray-200 text-gray-900 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  다크 모드 (Dark Mode)
                </label>
                <input 
                  type="text" 
                  required
                  value={darkValue}
                  onChange={(e) => setDarkValue(e.target.value)}
                  placeholder={category === 'color' ? 'color.palette.gray.100' : ''}
                  className="w-full bg-gray-800 border border-gray-700 text-white font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm placeholder-gray-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">설명 (Description) <span className="text-gray-400 font-normal ml-1 text-xs">(선택)</span></label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 토큰이 언제 어디서 사용되어야 하는지 간단히 메모를 남겨주세요."
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 resize-none"
          ></textarea>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/tokens')}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            등록하기
          </button>
        </div>

      </form>
    </div>
  );
}
