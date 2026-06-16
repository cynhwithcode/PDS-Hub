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

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8" style={{ fontFamily: 'Pretendard, -apple-system, sans-serif' }}>
      <header className="flex justify-between items-start">
        <div>
          <button onClick={() => navigate('/components')} className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1">
            &larr; 목록으로 돌아가기
          </button>
          {isEditing ? (
            <input type="text" className="text-3xl font-extrabold text-gray-900 border-b-2 border-[#E8002D] focus:outline-none bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
              <button onClick={handleSave} className="px-4 py-2 bg-[#E8002D] hover:bg-[#cc0028] rounded-lg text-white font-medium">저장</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
              편집하기
            </button>
          )}
        </div>
      </header>

      <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-300 ${isEditing ? 'bg-[#FFF0F2] border-[#E8002D]/20' : 'bg-white'}`}>
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



          {/* Anatomy Section */}
          {!isEditing && formData.anatomy && formData.anatomy.length > 0 && formData.id !== 'c-buttons' && formData.id !== 'c-badge' && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Anatomy</h3>
              
              {formData.id === 'c-buttons' && (
                <div className="bg-[#F5F5F5] rounded-xl p-8 mb-6 flex justify-center items-center relative min-h-[200px] overflow-hidden">
                  <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Container (1) */}
                    <rect x="40" y="30" width="160" height="60" rx="8" fill="#E8002D" opacity="0.1" stroke="#E8002D" strokeWidth="2" strokeDasharray="4 4" />
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

          {/* ── c-buttons 전용 섹션 ── */}
          {formData.id === 'c-buttons' && !isEditing && (
            <>
              {/* Element Pattern */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Element Pattern</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  버튼의 요소 구성 패턴을 보여줍니다. 각 패턴은 콘텐츠 특성에 맞게 선택하여 사용하며, 임의로 조합하거나 변경하지 않습니다.
                </p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8">
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { label: 'Text Only', node: (
                        <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-4 py-2">버튼</button>
                      )},
                      { label: 'Icon + Text', node: (
                        <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-4 py-2 flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-white/40 flex-shrink-0" />버튼
                        </button>
                      )},
                      { label: 'Text + Icon', node: (
                        <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-4 py-2 flex items-center gap-1.5">
                          버튼<span className="w-3 h-3 rounded-full bg-white/40 flex-shrink-0" />
                        </button>
                      )},
                      { label: 'Icon Only', node: (
                        <button className="bg-[#E8002D] text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-white/50" />
                        </button>
                      )},
                    ].map(({ label, node }) => (
                      <div key={label} className="flex flex-col items-center gap-3">
                        <span className="text-xs text-gray-500">{label}</span>
                        {node}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Type */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Type</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  버튼은 사용 목적과 시각적 표현에 따라 Contained, Outlined, Ghost 타입 중 선택해 사용합니다.
                </p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs font-semibold text-gray-600">Contained</span>
                      <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-5 py-2">버튼</button>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs font-semibold text-gray-600">Outlined</span>
                      <button className="border border-[#E8002D] text-[#E8002D] rounded-lg text-xs font-medium px-5 py-2">버튼</button>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs font-semibold text-gray-600">Ghost</span>
                      <button className="text-[#E8002D] text-xs font-medium px-5 py-2">버튼 &gt;</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Button Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Button Anatomy</h3>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-10 flex items-center justify-center min-h-[180px]">
                  <svg width="260" height="80" viewBox="0 0 260 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <rect x="30" y="20" width="200" height="40" rx="8" fill="#E8002D" opacity="0.08" stroke="#E8002D" strokeWidth="1.5" strokeDasharray="5 3" />
                    <circle cx="65" cy="40" r="10" fill="#9CA3AF" />
                    <rect x="90" y="33" width="90" height="14" rx="4" fill="#6B7280" />
                    <line x1="30" y1="20" x2="10" y2="5" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="5" cy="2" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="5" y="6" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    <line x1="135" y1="33" x2="135" y2="10" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="135" cy="2" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="135" y="6" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                    <line x1="65" y1="50" x2="65" y2="68" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="65" cy="76" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="65" y="80" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>
                  </svg>
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                  <p>1. Container</p>
                  <p>2. Text Label</p>
                  <p>3. Icon (Optional)</p>
                </div>
              </section>

              {/* Emphasis */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Emphasis</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Button은 사용자의 성공적 작업 수행에 따른 시각적 계층 구조에 차이가 있습니다. 계층 구조에 따른 스타일 가이드를 유의하며, 임의의 스타일 추가 및 사용을 제한합니다.
                </p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-xl p-10 flex flex-col lg:flex-row items-center justify-center gap-12">
                  <svg width="260" height="160" viewBox="0 0 260 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible flex-shrink-0">
                    <polygon points="100,10 73,56 127,56" fill="#4B5563" />
                    <polygon points="73,56 47,103 153,103 127,56" fill="#9CA3AF" />
                    <polygon points="47,103 20,150 180,150 153,103" fill="#E5E7EB" />
                    
                    <line x1="100" y1="33" x2="210" y2="33" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="225" cy="33" r="8" fill="#1A1A1A" />
                    <text x="225" y="36.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">1</text>
                    
                    <line x1="100" y1="80" x2="210" y2="80" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="225" cy="80" r="8" fill="#1A1A1A" />
                    <text x="225" y="83.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">2</text>
                    
                    <line x1="100" y1="126" x2="210" y2="126" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="225" cy="126" r="8" fill="#1A1A1A" />
                    <text x="225" y="129.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">3</text>
                  </svg>

                  <div className="flex-1 flex flex-col gap-6 w-full max-w-lg">
                    <div className="flex items-center justify-between gap-6 border-b border-gray-200/50 pb-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">High Emphasis</span>
                        <span className="text-xs text-gray-400">Primary Button</span>
                      </div>
                      <button className="bg-[#E8002D] text-white rounded-lg text-sm font-medium w-48 h-10 flex items-center justify-center">버튼</button>
                    </div>

                    <div className="flex items-center justify-between gap-6 border-b border-gray-200/50 pb-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">Medium Emphasis</span>
                        <span className="text-xs text-gray-400">Secondary Button / Gray Button</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-[#1A1A1A] text-white rounded-lg text-sm font-medium w-24 h-10 flex items-center justify-center">버튼</button>
                        <button className="bg-gray-200 text-gray-800 rounded-lg text-sm font-medium w-24 h-10 flex items-center justify-center">버튼</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">Low Emphasis</span>
                        <span className="text-xs text-gray-400">Outline Button</span>
                      </div>
                      <button className="border border-gray-300 bg-white text-gray-800 rounded-lg text-sm font-medium w-48 h-10 flex items-center justify-center">버튼</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* State */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">State</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Button은 사용자의 성공적 작업 수행에 따른 시각적 계층 구조에 차이가 있습니다. 계층 구조에 따른 스타일 가이드를 유의하며, 임의의 스타일 추가 및 사용을 제한합니다.
                </p>
                <div className="bg-[#F5F5F5] rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200/60 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded w-fit uppercase tracking-wider">Primary</span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-4 py-2">버튼</button>
                      <button className="bg-[#1A1A1A] text-white rounded-lg text-xs font-medium px-4 py-2">버튼</button>
                      <button className="border border-gray-300 bg-white text-gray-800 rounded-lg text-xs font-medium px-4 py-2">버튼</button>
                      <button className="bg-gray-200 text-gray-800 rounded-lg text-xs font-medium px-4 py-2">버튼</button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200/60 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded w-fit uppercase tracking-wider">Disabled</span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button className="bg-[#E5E7EB] text-gray-400 rounded-lg text-xs font-medium px-4 py-2 cursor-not-allowed" disabled>버튼</button>
                      <button className="bg-[#E5E7EB] text-gray-400 rounded-lg text-xs font-medium px-4 py-2 cursor-not-allowed" disabled>버튼</button>
                      <button className="bg-[#E5E7EB] text-gray-400 rounded-lg text-xs font-medium px-4 py-2 cursor-not-allowed" disabled>버튼</button>
                      <button className="bg-[#E5E7EB] text-gray-400 rounded-lg text-xs font-medium px-4 py-2 cursor-not-allowed" disabled>버튼</button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200/60 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded w-fit uppercase tracking-wider">Pressed, Hover</span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button className="bg-[#A3001F] text-white rounded-lg text-xs font-medium px-4 py-2 shadow-inner">버튼</button>
                      <button className="bg-[#333333] text-white rounded-lg text-xs font-medium px-4 py-2 shadow-inner">버튼</button>
                      <button className="border border-gray-400 bg-gray-50 text-gray-900 rounded-lg text-xs font-medium px-4 py-2 shadow-inner">버튼</button>
                      <button className="bg-gray-300 text-gray-900 rounded-lg text-xs font-medium px-4 py-2 shadow-inner">버튼</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Size */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Size</h3>
                <p className="text-xs text-gray-400 mb-4">버튼 사이즈는 S / M / L 3가지로 구분됩니다.</p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8 flex items-end justify-center gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-lg text-[10px] font-medium px-3 h-7">버튼</button>
                    <span className="text-xs text-gray-400">S</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-4 h-9">버튼</button>
                    <span className="text-xs text-gray-400">M</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-lg text-sm font-medium px-6 h-11">버튼</button>
                    <span className="text-xs text-gray-400">L</span>
                  </div>
                </div>
              </section>

              {/* Width */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Width</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">버튼 너비는 Fixed(고정)와 Flexible(유동) 두 가지로 구분됩니다.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-6 flex flex-col gap-3 items-center">
                    <span className="text-xs font-semibold text-gray-600 self-start">Fixed</span>
                    <p className="text-xs text-gray-400 self-start">버튼 내 텍스트 길이와 관계없이 고정적인 너비를 가집니다.</p>
                    <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium w-28 py-2 mt-2">버튼</button>
                  </div>
                  <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-6 flex flex-col gap-3 items-center">
                    <span className="text-xs font-semibold text-gray-600 self-start">Flexible</span>
                    <p className="text-xs text-gray-400 self-start">버튼 내 텍스트 길이에 따라 유동적인 너비를 가집니다.</p>
                    <button className="bg-[#E8002D] text-white rounded-lg text-xs font-medium px-5 py-2 w-fit mt-2">버튼 텍스트 길이에 따라 유동</button>
                  </div>
                </div>
              </section>

              {/* Usage Guidelines */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Usage Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* DO 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: Full Width 버튼은 좌우 마진 20px 유지</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        풀사이즈 버튼 사용 시에는 Safe Area 및 홈 인디케이터를 고려하여, 좌우 마진을 항상 20px로 고정해 적용합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center p-4">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="w-36 h-28 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col justify-end p-2 pb-3 relative overflow-hidden">
                        <div className="absolute top-1 left-2 text-[8px] text-gray-300 font-mono">Safe Area (20px Margin)</div>
                        <div className="bg-[#E8002D] text-white text-[9px] py-1.5 rounded text-center font-medium mx-3">버튼</div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10"></div>
                      </div>
                    </div>
                  </div>

                  {/* DONT 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#E8002D] text-sm mb-1">Don't: 좌우 마진 없이 버튼을 꽉 채워 배치</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Full Width 버튼이라 하더라도 화면을 가득 채우는 형태로 배치하는 것은 지양하며, 좌우 마진 없이 사용하는 경우는 허용되지 않습니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center p-4">
                      <div className="absolute top-3 left-3 bg-[#E8002D] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="w-36 h-28 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col justify-end relative overflow-hidden">
                        <div className="bg-[#E8002D] text-white text-[9px] py-1.5 rounded-t text-center font-medium w-full">버튼</div>
                        <div className="h-1 bg-black/10"></div>
                      </div>
                    </div>
                  </div>

                  {/* DO 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: 버튼 레이블에 구어체 사용 가능</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        안내성 문구 또는 알림 목적의 버튼에 한해, 구어체나 특수기호를 포함한 표현을 사용하여 사용자에게 보다 친근한 느낌을 전달할 수 있습니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex flex-col items-center justify-center gap-2">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <button className="bg-[#E8002D] text-white rounded-lg text-[10px] font-medium w-36 py-1.5 text-center">신청하기</button>
                      <button className="bg-[#E8002D] text-white rounded-lg text-[10px] font-medium w-36 py-1.5 text-center">가입하기</button>
                    </div>
                  </div>

                  {/* DONT 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#E8002D] text-sm mb-1">Don't: 모든 버튼에 무분별하게 구어체 사용</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        버튼 레이블에는 기능과 직접 관련된 명확한 텍스트만 사용해야 하며, 불필요한 구어체, 특수기호, 또는 오해의 소지가 있는 단어는 사용하지 않습니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex flex-col items-center justify-center gap-2">
                      <div className="absolute top-3 left-3 bg-[#E8002D] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <button className="bg-[#E8002D] text-white rounded-lg text-[10px] font-medium w-44 py-1.5 text-center flex items-center justify-center gap-1">내가 바로 우승자! 🏆</button>
                      <button className="bg-[#E8002D] text-white rounded-lg text-[10px] font-medium w-44 py-1.5 text-center flex items-center justify-center gap-1">4건의 이벤트 확인하기~!</button>
                    </div>
                  </div>

                  {/* DO 3 (Keypad) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: 키패드와 결합 시에도 Full Width 버튼은 좌우 마진 20px 유지</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        키패드와 버튼을 함께 사용할 경우에도 전체 UI의 일관된 여백 기준을 유지하기 위해, Full Width 버튼은 항상 좌우 마진 20px를 적용하여 배치합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="w-44 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm flex flex-col gap-1.5 scale-[0.85]">
                        <div className="bg-[#E8002D] text-white text-[9px] py-1 rounded text-center font-medium mx-3.5">버튼</div>
                        <div className="grid grid-cols-3 gap-1 text-center text-[8px] font-bold text-gray-700 bg-gray-50 p-1 rounded">
                          <div>1</div><div>2</div><div>3</div>
                          <div>4</div><div>5</div><div>6</div>
                          <div>7</div><div>8</div><div>9</div>
                          <div>*</div><div>0</div><div>#</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DO 4 (Gap spacing) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: 버튼 간 간격은 배치 방향에 따라 고정값 사용</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        버튼을 수직으로 정렬할 경우 간격은 8px, 수평으로 나란히 배치할 경우 간격은 8px로 고정하여 사용합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center gap-8">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      
                      {/* Vertical stack */}
                      <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-2.5 bg-white shadow-sm scale-90">
                        <div className="flex flex-col items-center">
                          <div className="bg-[#1A1A1A] text-white text-[8px] w-20 py-1 rounded text-center">버튼</div>
                          <div className="flex flex-col items-center my-0.5">
                            <div className="w-[1px] h-1.5 bg-red-400"></div>
                            <span className="text-[7px] text-red-500 font-bold leading-none">8px</span>
                            <div className="w-[1px] h-1.5 bg-red-400"></div>
                          </div>
                          <div className="bg-[#E8002D] text-white text-[8px] w-20 py-1 rounded text-center">버튼</div>
                        </div>
                      </div>

                      {/* Horizontal stack */}
                      <div className="flex items-center justify-center border border-gray-200 rounded-lg p-2.5 bg-white shadow-sm scale-90">
                        <div className="flex items-center">
                          <div className="bg-white border border-gray-300 text-gray-800 text-[8px] w-14 py-1 rounded text-center">버튼</div>
                          <div className="flex items-center mx-1">
                            <div className="w-1.5 h-[1px] bg-red-400"></div>
                            <span className="text-[7px] text-red-500 font-bold px-0.5">8px</span>
                            <div className="w-1.5 h-[1px] bg-red-400"></div>
                          </div>
                          <div className="bg-[#1A1A1A] text-white text-[8px] w-14 py-1 rounded text-center">버튼</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Text Button Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Text Button Anatomy</h3>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-10 flex items-center justify-center min-h-[140px]">
                  <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <text x="50" y="35" fontSize="14" fill="#E8002D" fontWeight="500">버튼 &gt;</text>
                    <line x1="60" y1="22" x2="60" y2="5" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="60" cy="-3" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="60" y="1" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    <line x1="118" y1="30" x2="143" y2="30" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="151" cy="30" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="151" y="34" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                  </svg>
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                  <p>1. Label</p>
                  <p>2. Icon (Optional)</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Text Button Size</h3>
                <p className="text-xs text-gray-400 mb-4">텍스트 버튼 사이즈는 S / M / L 로 구분됩니다.</p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8 flex items-end justify-center gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <button className="text-[#E8002D] text-[10px] font-medium">버튼 &gt;</button>
                    <span className="text-xs text-gray-400">S</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="text-[#E8002D] text-xs font-medium">버튼 &gt;</button>
                    <span className="text-xs text-gray-400">M</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="text-[#E8002D] text-sm font-medium">버튼 &gt;</button>
                    <span className="text-xs text-gray-400">L</span>
                  </div>
                </div>
              </section>

              {/* Icon Button Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Icon Button Anatomy</h3>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-10 flex items-center justify-center min-h-[160px]">
                  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <circle cx="60" cy="50" r="28" fill="#E8002D" fillOpacity="0.08" stroke="#E8002D" strokeWidth="1.5" strokeDasharray="5 3" />
                    <circle cx="60" cy="50" r="10" fill="#9CA3AF" />
                    <line x1="35" y1="28" x2="15" y2="10" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="7" cy="3" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="7" y="7" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    <line x1="70" y1="60" x2="95" y2="75" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="103" cy="80" r="8" fill="white" stroke="#E5E7EB" />
                    <text x="103" y="84" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                  </svg>
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                  <p>1. Container</p>
                  <p>2. Icon</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Icon Button Type</h3>
                <p className="text-xs text-gray-400 mb-4">아이콘 버튼은 Circle과 Square 두 가지 형태로 제공됩니다.</p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs font-semibold text-gray-600">Circle</span>
                      <div className="flex gap-3">
                        <button className="bg-[#E8002D] text-white rounded-full w-9 h-9 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-white/50" />
                        </button>
                        <button className="border border-[#E8002D] text-[#E8002D] rounded-full w-9 h-9 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-[#E8002D]/40" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs font-semibold text-gray-600">Square</span>
                      <div className="flex gap-3">
                        <button className="bg-[#E8002D] text-white rounded-lg w-9 h-9 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-white/50" />
                        </button>
                        <button className="border border-[#E8002D] text-[#E8002D] rounded-lg w-9 h-9 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-[#E8002D]/40" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Icon Button Size</h3>
                <p className="text-xs text-gray-400 mb-4">아이콘 버튼 사이즈는 S / M / L 로 구분됩니다.</p>
                <div className="bg-[#F5F5F5] border border-gray-200 rounded-lg p-8 flex items-end justify-center gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-full w-7 h-7 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/50" />
                    </button>
                    <span className="text-xs text-gray-400">S</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-full w-9 h-9 flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-white/50" />
                    </button>
                    <span className="text-xs text-gray-400">M</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button className="bg-[#E8002D] text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-white/50" />
                    </button>
                    <span className="text-xs text-gray-400">L</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Variants Section */}
          {!isEditing && formData.variants && formData.variants.length > 0 && formData.id !== 'c-buttons' && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.variants.map((item, idx) => (
                  <div key={idx} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {formData.id === 'c-buttons' && (
                      <div className="bg-[#F5F5F5] h-32 flex items-center justify-center p-4 border-b border-gray-100">
                        {item.name === 'Contained' ? (
                          <button className="bg-[#E8002D] text-white rounded-lg font-medium text-base px-6 py-2.5 shadow-sm flex items-center gap-2 transform transition-transform hover:scale-105">
                            버튼
                          </button>
                        ) : item.name === 'Primary' ? (
                          <button className="bg-[#E8002D] text-white rounded-lg font-medium text-lg px-8 py-3 shadow-sm flex items-center gap-2 transform transition-transform hover:scale-105">
                            버튼
                          </button>
                        ) : item.name === 'Outlined' ? (
                          <button className="border border-[#E8002D] text-[#E8002D] rounded-lg font-medium text-base px-6 py-2.5 shadow-sm flex items-center gap-2 transform transition-transform hover:scale-105">
                            버튼
                          </button>
                        ) : item.name === 'Secondary' ? (
                          <button className="bg-gray-200 text-gray-800 rounded-lg font-medium text-base px-6 py-2.5 shadow-sm flex items-center gap-2 transform transition-transform hover:scale-105">
                            버튼
                          </button>
                        ) : item.name === 'Ghost' ? (
                          <span className="text-[#E8002D] text-sm">버튼 &gt;</span>
                        ) : item.name === 'Low' ? (
                          <span className="text-[#E8002D] text-xs">버튼</span>
                        ) : (
                          <div className="text-gray-400 text-xs">Preview Area</div>
                        )}
                      </div>
                    )}
                    {formData.id === 'c-badge' && (
                      <div className="bg-[#F5F5F5] h-32 flex items-center justify-center p-4 border-b border-gray-100">
                        {item.name === 'Dot Badge' ? (
                          <span className="w-5 h-5 rounded-full bg-[#E8002D] inline-block" />
                        ) : item.name === 'Number Badge' ? (
                          <span className="inline-flex items-center justify-center rounded-full bg-[#E8002D] text-white font-bold text-[11px] px-1.5 h-5 min-w-[1.25rem]">
                            9
                          </span>
                        ) : item.name === 'Icon Badge' ? (
                          <span className="relative inline-flex">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E8002D] border border-white" />
                          </span>
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

          {/* Badge: Anatomy SVG + Size Grid */}
          {formData.id === 'c-badge' && !isEditing && (
            <>
              {/* Badge Anatomy SVG */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Badge Anatomy</h3>
                <div className="bg-[#F5F5F5] rounded-xl p-10 flex items-center justify-center min-h-[180px]">
                  <svg width="220" height="100" viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* 번호 콜아웃 1 */}
                    <circle cx="80" cy="20" r="8" fill="#1A1A1A" />
                    <text x="80" y="23" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">1</text>
                    <path d="M80 28 L80 50" stroke="#9CA3AF" strokeWidth="1" />
                    
                    {/* 번호 콜아웃 2 */}
                    <circle cx="110" cy="20" r="8" fill="#1A1A1A" />
                    <text x="110" y="23" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">2</text>
                    <path d="M110 28 L110 50" stroke="#9CA3AF" strokeWidth="1" />

                    {/* 번호 콜아웃 3 */}
                    <circle cx="140" cy="20" r="8" fill="#1A1A1A" />
                    <text x="140" y="23" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">3</text>
                    <path d="M140 28 L140 50" stroke="#9CA3AF" strokeWidth="1" />

                    {/* 뱃지 요소 1: Container (Plain) */}
                    <circle cx="80" cy="62" r="10" fill="#E8002D" />

                    {/* 뱃지 요소 2: Digit Text (Number) */}
                    <circle cx="110" cy="62" r="10" fill="#E8002D" />
                    <text x="110" y="65.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">2</text>

                    {/* 뱃지 요소 3: Icon */}
                    <circle cx="140" cy="62" r="10" fill="#E8002D" />
                    <g transform="translate(134.5, 56.5) scale(0.45)">
                      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="white" />
                    </g>
                  </svg>
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                  <p>1. Container</p>
                  <p>2. Digit Text</p>
                  <p>3. Icon</p>
                </div>
              </section>

              {/* Badge Size Grid */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Size</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-5 bg-gray-100 border-b border-gray-200">
                    <div className="px-4 py-2 text-xs text-gray-400" />
                    {(['S', 'M', 'L', 'XL'] as const).map(s => (
                      <div key={s} className="px-4 py-2 text-xs font-bold text-gray-500 text-center">{s}</div>
                    ))}
                  </div>
                  {[1, 9, 99].map(n => (
                    <div key={n} className="grid grid-cols-5 border-b border-gray-100 items-center">
                      <div className="px-4 py-3 text-xs text-gray-400">{n}</div>
                      {[
                        { cls: 'h-4 min-w-[1rem] text-[9px]' },
                        { cls: 'h-5 min-w-[1.25rem] text-[10px]' },
                        { cls: 'h-6 min-w-[1.5rem] text-xs' },
                        { cls: 'h-7 min-w-[1.75rem] text-sm' },
                      ].map(({ cls }, i) => (
                        <div key={i} className="flex items-center justify-center py-3">
                          <span className={`inline-flex items-center justify-center rounded-full bg-[#E8002D] text-white font-bold px-1 ${cls}`}>
                            {n > 99 ? '99+' : n}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="grid grid-cols-5 items-center">
                    <div className="px-4 py-3 text-xs text-gray-400">dot</div>
                    {[
                      'w-3 h-3',
                      'w-4 h-4',
                      'w-5 h-5',
                      'w-6 h-6',
                    ].map((cls, i) => (
                      <div key={i} className="flex items-center justify-center py-3">
                        <span className={`rounded-full bg-[#E8002D] inline-block ${cls}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}




          {/* Usage Guidelines Section */}
          {!isEditing && formData.usage_guidelines && formData.usage_guidelines.length > 0 && formData.id !== 'c-buttons' && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Usage Guidelines</h3>
              {formData.id === 'c-badge' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* DO 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: 서비스 컬러에 맞게 Badge 색상 변경 가능</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Badge는 상황에 따라 색상 변경이 가능하며, 서비스의 주요 컬러 또는 레드 계열의 컬러 사용을 권장합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center gap-6">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="relative w-14 h-14 bg-white border border-gray-300 border-dashed rounded-xl flex items-center justify-center">
                        <span className="absolute -top-1.5 -right-1.5 bg-[#E8002D] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">2</span>
                      </div>
                      <div className="relative w-14 h-14 bg-white border border-gray-300 border-dashed rounded-xl flex items-center justify-center">
                        <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">2</span>
                      </div>
                      <div className="relative w-14 h-14 bg-white border border-gray-300 border-dashed rounded-xl flex items-center justify-center">
                        <span className="absolute -top-1.5 -right-1.5 bg-[#0066FF] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">2</span>
                      </div>
                    </div>
                  </div>

                  {/* DONT 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#E8002D] text-sm mb-1">Don't: 제공된 사이즈 외 임의로 크기를 변경</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Badge는 S, M, L, XL, XXL로 제공된 사이즈 범위 내에서만 사용해야 하며, 이외의 사이즈로 임의 조정하여 사용하는 것은 지양합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center gap-6 pt-4">
                      <div className="absolute top-3 left-3 bg-[#E8002D] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-10 h-10 bg-white border border-gray-300 border-dashed rounded-lg flex items-center justify-center">
                          <span className="absolute -top-1 -right-1 bg-[#E8002D] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">2</span>
                        </div>
                        <span className="text-[10px] text-gray-400">17</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-12 h-12 bg-white border border-gray-300 border-dashed rounded-lg flex items-center justify-center">
                          <span className="absolute -top-1 -right-1 bg-[#E8002D] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">2</span>
                        </div>
                        <span className="text-[10px] text-gray-400">23</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative w-16 h-16 bg-white border border-gray-300 border-dashed rounded-xl flex items-center justify-center">
                          <span className="absolute -top-1.5 -right-1.5 bg-[#E8002D] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">2</span>
                        </div>
                        <span className="text-[10px] text-gray-400">41</span>
                      </div>
                    </div>
                  </div>

                  {/* DO 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#10B981] text-sm mb-1">Do: 카운트 값이 없을 경우 뱃지 비노출</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        의미 없는 정보 노출을 방지하고 사용자에게 명확한 상태를 전달하기 위해, 카운팅 값이 없는 경우에는 뱃지를 비노출 처리합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center">
                      <div className="absolute top-3 left-3 bg-[#10B981] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="relative">
                        <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* DONT 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-[#E8002D] text-sm mb-1">Don't: 카운트 값이 없는 경우, badge에 '0'을 표시하지 않도록 설정</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        불필요한 정보 전달을 방지하고 직관적인 UI 상태를 유지하기 위해, 값이 없을 경우 뱃지 컴포넌트는 미표시 처리합니다.
                      </p>
                    </div>
                    <div className="relative bg-[#F8F9FA] border border-gray-200 rounded-xl h-44 flex items-center justify-center">
                      <div className="absolute top-3 left-3 bg-[#E8002D] text-white w-6 h-6 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="relative inline-block">
                        <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-[#E8002D] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
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
                          <div className="w-16 bg-[#E8002D] opacity-40 rounded-t-md h-10 shadow-sm"></div>
                          <span className="text-xs font-bold text-gray-600">Small</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 bg-[#E8002D] opacity-70 rounded-t-md h-14 shadow-sm"></div>
                          <span className="text-xs font-bold text-gray-600">Medium</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-24 bg-[#E8002D] rounded-t-md h-16 shadow-sm"></div>
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
                          <span className="bg-[#FFF0F2] text-[#E8002D] font-mono text-xs px-2.5 py-1 rounded-full font-medium inline-block">
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
                  formData.figma_link ? <a href={formData.figma_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#FFF0F2] hover:bg-[#E8002D] text-[#E8002D] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Figma 링크</a> : <span className="text-gray-400 italic text-sm">링크 없음</span>
                )}
              </div>
              
              {!isEditing && <span className="w-px h-6 bg-gray-200 hidden md:block"></span>}
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Dev Link:</span>
                {isEditing ? (
                  <input type="url" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64" value={formData.dev_link || ''} onChange={e => setFormData({...formData, dev_link: e.target.value})} />
                ) : (
                  formData.dev_link ? <a href={formData.dev_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#FFF0F2] hover:bg-[#E8002D] text-[#E8002D] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>개발 문서</a> : <span className="text-gray-400 italic text-sm">링크 없음</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
