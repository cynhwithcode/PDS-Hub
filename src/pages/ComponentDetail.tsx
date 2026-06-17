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
            <button onClick={() => setIsEditing(true)} className="hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
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
          {((!isEditing && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet') || isEditing) && (
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">설명 (Description)</h3>
              {isEditing ? (
                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              ) : (
                <p className="text-gray-700 leading-relaxed">{formData.description || '설명이 없습니다.'}</p>
              )}
            </section>
          )}



          {/* Anatomy Section */}
          {!isEditing && formData.anatomy && formData.anatomy.length > 0 && formData.id !== 'c-buttons' && formData.id !== 'c-badge' && formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet' && (
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

          {/* ── c-chips 전용 섹션 ── */}
          {formData.id === 'c-chips' && !isEditing && (
            <>
              {/* Chips Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Chips Anatomy</h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8 flex justify-center items-center relative min-h-[220px]">
                  <svg width="300" height="130" viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Chip Container */}
                    <rect x="75" y="45" width="150" height="40" rx="20" fill="white" stroke="#1A1A1A" strokeWidth="1.5" />
                    
                    {/* Left Icon (Chevron-like) */}
                    <path d="M 98 60 L 93 65 L 98 70" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    
                    {/* Text Label */}
                    <text x="148" y="70" fontSize="12" fontWeight="700" fill="#1A1A1A" fontFamily="Pretendard, -apple-system, sans-serif" textAnchor="middle">Status</text>
                    
                    {/* Right Icon (Cross-like) */}
                    <path d="M 197 60 L 205 68 M 205 60 L 197 68" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

                    {/* Callout Lines */}
                    {/* Callout 1: Container */}
                    <line x1="150" y1="45" x2="150" y2="25" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="150" cy="16" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="150" y="19.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    
                    {/* Callout 2: Left Icon */}
                    <line x1="95" y1="73" x2="95" y2="105" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="95" cy="114" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="95" y="117.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                    
                    {/* Callout 3: Text Label */}
                    <line x1="148" y1="80" x2="148" y2="105" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="148" cy="114" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="148" y="117.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>
                    
                    {/* Callout 4: Right Icon */}
                    <line x1="201" y1="73" x2="201" y2="105" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="201" cy="114" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="201" y="117.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">4</text>
                  </svg>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Container</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Left Icon (Optional)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Text Label</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>Right Icon (Optional)</span>
                  </div>
                </div>
              </section>

              {/* Element Pattern */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Element Pattern</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  칩(Chips)의 구성 요소와 아이콘 속성에 따라 네 가지 Element Pattern으로 구분하여 활용합니다.<br />
                  특히, 컴포넌트 내에 사용되는 아이콘의 경우 좌측 아이콘(Left Icon) 혹은 우측 아이콘(Right Icon)으로 구분하여 사용됩니다.
                </p>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Text Only', node: (
                        <span className="bg-[#1A1A1A] text-white px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[32px]">
                          Label
                        </span>
                      )},
                      { label: 'Side Icon', node: (
                        <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      )},
                      { label: 'Left Icon', node: (
                        <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                      )},
                      { label: 'Right Icon', node: (
                        <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                          Label
                          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      )},
                    ].map(({ label, node }) => (
                      <div key={label} className="flex flex-col items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                        <div className="flex items-center justify-center min-h-[44px]">
                          {node}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Types */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Types</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  칩(Chips)의 형태는 시각적 강조 레벨에 따라 Container Type을 다르게 구성할 수 있습니다.<br />
                  크게 배경색이 가득 찬 형태인 Fill Type과, 외곽선 스타일인 Outline Type 두 가지를 제공합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fill Type */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Fill</span>
                    <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 flex flex-wrap items-center justify-center gap-3 min-h-[80px]">
                      <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[32px]">
                        Label
                      </span>
                      <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                      </span>
                      <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        Label
                        <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="bg-[#1A1A1A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                        <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                    </div>
                  </div>

                  {/* Outline Type */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Outline</span>
                    <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 flex flex-wrap items-center justify-center gap-3 min-h-[80px]">
                      <span className="bg-white border border-gray-300 text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[32px]">
                        Label
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[32px]">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* State */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">State</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Chips의 각 컴포넌트는 세 가지 상태를 갖습니다. 상태별 디자인 기준에 따라 각각 선택(Select), 선택 해제(Unselect), 비활성(Disabled) 상태로 사용해야 합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Select State */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 flex flex-col gap-4 shadow-sm items-center">
                    <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start">Select</span>
                    <div className="flex flex-col gap-3.5 items-center w-full py-2">
                      <span className="bg-white border-2 border-gray-900 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center min-h-[32px] w-fit">
                        Label
                      </span>
                      <span className="bg-white border-2 border-gray-900 text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                      </span>
                      <span className="bg-white border-2 border-gray-900 text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="bg-white border-2 border-gray-900 text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                    </div>
                  </div>

                  {/* Unselect State */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 flex flex-col gap-4 shadow-sm items-center">
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start">Unselect</span>
                    <div className="flex flex-col gap-3.5 items-center w-full py-2">
                      <span className="bg-white border border-gray-300 text-gray-500 px-4 py-1.5 rounded-full text-xs font-medium inline-flex items-center justify-center min-h-[32px] w-fit">
                        Label
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-500 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-500 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="bg-white border border-gray-300 text-gray-500 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                    </div>
                  </div>

                  {/* Disabled State */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 flex flex-col gap-4 shadow-sm items-center">
                    <span className="bg-gray-200 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start">Disabled</span>
                    <div className="flex flex-col gap-3.5 items-center w-full py-2 opacity-50">
                      <span className="bg-gray-100 border border-gray-200 text-gray-400 px-4 py-1.5 rounded-full text-xs font-medium inline-flex items-center justify-center min-h-[32px] w-fit cursor-not-allowed">
                        Label
                      </span>
                      <span className="bg-gray-100 border border-gray-200 text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit cursor-not-allowed">
                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                      </span>
                      <span className="bg-gray-100 border border-gray-200 text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit cursor-not-allowed">
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="bg-gray-100 border border-gray-200 text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 justify-center min-h-[32px] w-fit cursor-not-allowed">
                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Label
                        <svg className="w-2.5 h-2.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Size */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Size</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Chips의 사이즈 정보입니다. 주로 모바일 스크린 환경과 웹/태블릿 환경에 맞춰 적합한 크기를 선택하여 활용합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Size S */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-4 flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start pl-1">S (Small)</span>
                    <div className="flex flex-col gap-3 items-center w-full py-2">
                      {/* Fill S */}
                      <div className="flex flex-nowrap gap-1.5 justify-center w-full">
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center justify-center min-h-[24px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 justify-center min-h-[24px] whitespace-nowrap">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 justify-center min-h-[24px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                      {/* Outline S */}
                      <div className="flex flex-nowrap gap-1.5 justify-center w-full">
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center justify-center min-h-[24px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 justify-center min-h-[24px] whitespace-nowrap">
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 justify-center min-h-[24px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size M */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-4 flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start pl-1">M (Medium)</span>
                    <div className="flex flex-col gap-3 items-center w-full py-2">
                      {/* Fill M */}
                      <div className="flex flex-nowrap gap-1.5 justify-center w-full">
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[28px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[28px] whitespace-nowrap">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[28px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                      {/* Outline M */}
                      <div className="flex flex-nowrap gap-1.5 justify-center w-full">
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[28px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[28px] whitespace-nowrap">
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 justify-center min-h-[28px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size L */}
                  <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-4 flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start pl-1">L (Large)</span>
                    <div className="flex flex-col gap-3 items-center w-full py-2">
                      {/* Fill L */}
                      <div className="flex flex-nowrap gap-1 justify-center w-full">
                        <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[32px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 justify-center min-h-[32px] whitespace-nowrap">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 justify-center min-h-[32px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                      {/* Outline L */}
                      <div className="flex flex-nowrap gap-1 justify-center w-full">
                        <span className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center min-h-[32px] whitespace-nowrap">
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 justify-center min-h-[32px] whitespace-nowrap">
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          Label
                        </span>
                        <span className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 justify-center min-h-[32px] whitespace-nowrap">
                          Label
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── c-textfield 전용 섹션 ── */}
          {formData.id === 'c-textfield' && !isEditing && (
            <>
              {/* === SECTION 1: TEXT FIELD === */}
              <div className="pt-4 border-b border-gray-200 pb-4 mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Text Field</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  텍스트 필드(Text Field)는 사용자가 한 줄의 텍스트를 입력할 수 있는 UI 컴포넌트입니다.<br />
                  드롭다운, 삭제 버튼 등의 요소와 함께 사용하여 입력 편의성과 기능성을 높일 수 있습니다.
                </p>
              </div>

              {/* Text Field Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Anatomy</h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8 flex justify-center items-center relative min-h-[220px]">
                  <svg width="340" height="150" viewBox="0 0 340 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Label with * and ? */}
                    <text x="60" y="24" fontSize="11" fontWeight="700" fill="#1A1A1A" fontFamily="Pretendard, -apple-system, sans-serif">Label</text>
                    <text x="90" y="22" fontSize="11" fontWeight="700" fill="#E8002D" fontFamily="Pretendard, -apple-system, sans-serif">*</text>
                    <circle cx="102" cy="20" r="5" fill="#E5E7EB" />
                    <text x="102" y="23" fontSize="8" fontWeight="bold" fill="#6B7280" textAnchor="middle">?</text>

                    {/* Input Container */}
                    <rect x="60" y="36" width="220" height="38" rx="6" fill="white" stroke="#D1D5DB" strokeWidth="1.5" />
                    <text x="70" y="59" fontSize="12" fill="#9CA3AF" fontFamily="Pretendard, -apple-system, sans-serif">Placeholder</text>

                    {/* Clear Icon (x) */}
                    <circle cx="236" cy="55" r="6" fill="#E5E7EB" />
                    <path d="M 233 52 L 239 58 M 239 52 L 233 58" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" />

                    {/* Search Icon (Q) */}
                    <circle cx="258" cy="55" r="4.5" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                    <line x1="261.5" y1="58.5" x2="266" y2="63" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Help text */}
                    <text x="60" y="90" fontSize="10" fill="#9CA3AF" fontFamily="Pretendard, -apple-system, sans-serif">Help text</text>

                    {/* Callouts */}
                    {/* Callout 1: Label Text */}
                    <line x1="75" y1="20" x2="35" y2="20" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="25" cy="20" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="25" y="23.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>

                    {/* Callout 2: Info icon */}
                    <polyline points="102,12 102,2 135,2" stroke="#9CA3AF" strokeWidth="1" fill="none" />
                    <circle cx="145" cy="2" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="145" y="5.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>

                    {/* Callout 3: Input area */}
                    <line x1="170" y1="36" x2="170" y2="10" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="170" cy="2" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="170" y="5.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>

                    {/* Callout 4: Value Text */}
                    <line x1="100" y1="55" x2="20" y2="55" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="10" cy="55" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="10" y="58.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">4</text>

                    {/* Callout 5: Help text */}
                    <line x1="80" y1="90" x2="80" y2="115" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="80" cy="124" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="80" y="127.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">5</text>

                    {/* Callout 6: Clear Icon */}
                    <line x1="236" y1="63" x2="236" y2="115" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="236" cy="124" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="236" y="127.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">6</text>

                    {/* Callout 7: Tailing Icon */}
                    <line x1="262" y1="55" x2="305" y2="55" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="315" cy="55" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="315" y="58.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">7</text>
                  </svg>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Label Text</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Info icon (Optional)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Input area</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>Value Text</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">5</span>
                    <span>Help text (Optional)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">6</span>
                    <span>Clear Icon</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">7</span>
                    <span>Tailing Icon (Optional)</span>
                  </div>
                </div>
              </section>

              {/* Text Field State */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">State</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  텍스트 필드(Text Fields)는 InActive, Active, Disabled, Focused, Error로 분류됩니다. 사용자에게 최종적으로 보여지는 형상은 InActived와 Actived 상태입니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/50">
                  {/* Normal */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Normal</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-900">Label</label>
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-400 bg-white">
                        Placeholder
                      </div>
                    </div>
                  </div>

                  {/* Complete */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Complete</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-900">Label</label>
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white">
                        Value text
                      </div>
                    </div>
                  </div>

                  {/* InActived (Focused/Active) */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">InActived</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-900">Label</label>
                      <div className="border border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white flex justify-between items-center">
                        <span>Placeholder<span className="animate-pulse font-normal text-[#E8002D]">|</span></span>
                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-900 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Read Only */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Read Only</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-900">Label</label>
                      <div className="border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-900 bg-gray-50/50">
                        Value text
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Error</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-900">Label</label>
                      <div className="border border-red-500 rounded-lg px-3 py-2 text-xs text-red-500 bg-white">
                        Value text
                      </div>
                    </div>
                  </div>

                  {/* Disabled */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Disabled</span>
                    <div className="space-y-1 mt-1">
                      <label className="block text-xs font-bold text-gray-300">Label</label>
                      <div className="border border-gray-150 rounded-lg px-3 py-2 text-xs text-gray-300 bg-gray-50/50 cursor-not-allowed">
                        Value text
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Spacer */}
              <div className="py-6 border-b border-gray-200/80 mb-10" />

              {/* === SECTION 2: TEXT AREA === */}
              <div className="pt-4 border-b border-gray-200 pb-4 mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Text Area</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Text Area는 텍스트 영역은 한 줄 이상, 즉 여러 줄 텍스트를 입력하기 위한 컴포넌트입니다.<br />
                  텍스트양이 넘을 경우 줄 바꿈 되어, 높이는 고정되고 커서가 필드 최하단에 도착 시 고정 높이에서 스크롤 됩니다.<br /><br />
                  <span className="font-semibold text-gray-700">텍스트 영역 기본 케이스인 Overflow 예시입니다.</span>
                </p>
              </div>

              {/* Text Area Overflow Example */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Overflow Case Example</h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8 flex justify-center items-center">
                  <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1.5">
                    <label className="block text-xs font-bold text-gray-900">동호회 평가 작성</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-white text-xs text-gray-800 font-medium relative h-[120px] flex flex-col justify-between">
                      <div className="overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
                        <p>안녕하세요.</p>
                        <p>다트 동호회 가입 한지 1년이 되었습니다.</p>
                        <p>초보자인 저를 환영해 주셔서 정말 감사합니다!</p>
                        <p>망설이시는 초보자 분들도 얼른 가입하세요.</p>
                        <p>추천 :)</p>
                      </div>
                      <span className="text-[10px] text-gray-400 self-end mt-1">7 / 150</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Text Area Anatomy */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">Text Area Anatomy</h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8 flex justify-center items-center relative min-h-[220px]">
                  <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Label */}
                    <text x="70" y="24" fontSize="11" fontWeight="700" fill="#1A1A1A" fontFamily="Pretendard, -apple-system, sans-serif">Label</text>

                    {/* Text Area Container */}
                    <rect x="70" y="34" width="160" height="80" rx="6" fill="white" stroke="#D1D5DB" strokeWidth="1.5" />
                    <text x="80" y="52" fontSize="11" fill="#9CA3AF" fontFamily="Pretendard, -apple-system, sans-serif">text</text>

                    {/* Scrollbar line on right inside box */}
                    <line x1="222" y1="40" x2="222" y2="108" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
                    <rect x="221" y="50" width="2" height="30" rx="1" fill="#9CA3AF" />

                    {/* Help text */}
                    <text x="70" y="128" fontSize="9" fill="#9CA3AF" fontFamily="Pretendard, -apple-system, sans-serif">Help text</text>

                    {/* Count */}
                    <text x="210" y="106" fontSize="8" fill="#9CA3AF" fontFamily="Pretendard, -apple-system, sans-serif" textAnchor="end">7 / 150</text>

                    {/* Callouts */}
                    {/* Callout 1: Label text */}
                    <line x1="85" y1="20" x2="40" y2="20" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="30" cy="20" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="30" y="23.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>

                    {/* Callout 2: Input area */}
                    <line x1="150" y1="34" x2="150" y2="10" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="150" cy="2" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="150" y="5.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>

                    {/* Callout 3: Place holder */}
                    <line x1="85" y1="49" x2="35" y2="49" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="25" cy="49" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="25" y="52.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>

                    {/* Callout 4: Scroll icon */}
                    <line x1="222" y1="65" x2="265" y2="65" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="275" cy="65" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="275" y="68.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">4</text>

                    {/* Callout 5: Count */}
                    <polyline points="195,104 195,132 235,132" stroke="#9CA3AF" strokeWidth="1" fill="none" />
                    <circle cx="245" cy="132" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="245" y="135.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">5</text>
                  </svg>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Label text</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Input area</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Place holder</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>Scroll icon</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">5</span>
                    <span>Count</span>
                  </div>
                </div>
              </section>

              {/* Text Area State */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1 border-b pb-2">State</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  텍스트 필드(Text Fields)는 InActive, Active, Disabled, Focused, Error로 분류됩니다. 사용자에게 최종적으로 보여지는 형상은 InActived와 Actived 상태입니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/50">
                  {/* Normal */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Normal</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Label</label>
                        <div className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-400 bg-white h-[80px]">
                          text
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 self-end mt-1">7 / 150</span>
                    </div>
                  </div>

                  {/* Complete */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Complete</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Label</label>
                        <div className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white h-[80px]">
                          text
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 self-end mt-1">7 / 150</span>
                    </div>
                  </div>

                  {/* InActived */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">InActived</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Label</label>
                        <div className="border border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white h-[80px]">
                          text<span className="animate-pulse font-normal text-[#E8002D]">|</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 self-end mt-1">7 / 150</span>
                    </div>
                  </div>

                  {/* Read Only */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Read Only</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Label</label>
                        <div className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 bg-gray-50/50 h-[80px]">
                          Value text
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 self-end mt-1">7 / 150</span>
                    </div>
                  </div>

                  {/* Error */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Error</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1">Label</label>
                        <div className="border border-red-500 rounded-lg px-3 py-2 text-xs text-red-500 bg-white h-[80px]">
                          text
                        </div>
                      </div>
                      <span className="text-[10px] text-red-500 self-end mt-1 font-semibold">7 / 150</span>
                    </div>
                  </div>

                  {/* Disabled */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">Disabled</span>
                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Label</label>
                        <div className="border border-gray-150 rounded-lg px-3 py-2 text-xs text-gray-300 bg-gray-50/50 h-[80px] cursor-not-allowed">
                          text
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-300 self-end mt-1">7 / 150</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── c-tab 전용 섹션 ── */}
          {formData.id === 'c-tab' && !isEditing && (
            <>
              {/* === SECTION 1: TAB HEADER === */}
              <div className="pt-6 border-b border-gray-200 pb-6 mb-12">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Tab</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  탭(Tab)은 동일한 위계의 서로 다른 콘텐츠 섹션을 그룹화하고 간편하게 섹션 간을 이동할 수 있도록 안내하는 내비게이션 UI 컴포넌트입니다.<br />
                  현재 선택된 상태를 시각적으로 명확히 표시하여 사용자가 현재 위치를 직관적으로 파악하게 돕습니다.
                </p>
              </div>

              {/* Anatomy Section */}
              <section className="space-y-6 pt-12 border-t border-gray-100 mt-12">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b pb-2">Anatomy</h3>
                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-8 flex justify-center items-center relative min-h-[220px]">
                  <svg width="420" height="180" viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    {/* Tab Container (Tabs) */}
                    <rect x="50" y="70" width="320" height="48" rx="0" fill="white" stroke="#E5E7EB" strokeWidth="1" />
                    
                    {/* Tab Items */}
                    {/* Selected Item (Tab 1) */}
                    <text x="103" y="99" fontSize="14" fontWeight="bold" fill="#1A1A1A" textAnchor="middle" fontFamily="Pretendard, sans-serif">랭킹</text>
                    {/* Active Indicator */}
                    <rect x="73" y="115" width="60" height="3" fill="#E8002D" />
                    
                    {/* Unselected Items (Tab 2, Tab 3) */}
                    <text x="210" y="99" fontSize="14" fontWeight="medium" fill="#9CA3AF" textAnchor="middle" fontFamily="Pretendard, sans-serif">이벤트</text>
                    <text x="317" y="99" fontSize="14" fontWeight="medium" fill="#9CA3AF" textAnchor="middle" fontFamily="Pretendard, sans-serif">마이페이지</text>
                    
                    {/* Callout Connections & Badges */}
                    {/* 1. Tabs (Container) */}
                    <path d="M50 70 L30 40" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="20" cy="30" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="20" y="33.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">1</text>
                    
                    {/* 2. Tab Item (Selected) */}
                    <path d="M103 85 L103 40" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="103" cy="30" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="103" y="33.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">2</text>
                    
                    {/* 3. Tab Item */}
                    <path d="M210 85 L210 40" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="210" cy="30" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="210" y="33.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">3</text>
                    
                    {/* 4. Selection Indicator */}
                    <path d="M103 116.5 L103 145 L135 145" stroke="#9CA3AF" strokeWidth="1" fill="none" />
                    <circle cx="145" cy="145" r="9" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                    <text x="145" y="148.5" fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">4</text>
                  </svg>
                </div>
                
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
                      <tr className="border-t border-gray-100 even:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">1</span>
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-bold">Tabs</td>
                        <td className="px-5 py-3 text-gray-600">탭 컴포넌트의 전체 영역 및 컨테이너</td>
                      </tr>
                      <tr className="border-t border-gray-100 even:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">2</span>
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-bold">Tab Item (Selected)</td>
                        <td className="px-5 py-3 text-gray-600">현재 활성화(선택)되어 화면에 표시되고 있는 탭 요소</td>
                      </tr>
                      <tr className="border-t border-gray-100 even:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">3</span>
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-bold">Tab Item</td>
                        <td className="px-5 py-3 text-gray-600">비활성화(선택되지 않은) 상태의 탭 요소</td>
                      </tr>
                      <tr className="border-t border-gray-100 even:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">4</span>
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-bold">Selection Indicator</td>
                        <td className="px-5 py-3 text-gray-600">현재 선택된 탭을 시각적으로 나타내는 하단 강조 라인 (Brand Red 사용)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Variants Section */}
              <section className="space-y-8 py-12 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b pb-2">Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Default vs Scroll Style */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-6">
                    <h4 className="font-bold text-gray-900 text-sm border-b pb-2 mb-6">Style: Default vs Scroll</h4>
                    
                    {/* Default (Fixed) Model */}
                    <div className="space-y-2">
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded tracking-wider uppercase">Default Style (고정형)</span>
                      <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                        <div className="bg-white border border-gray-200 flex w-full">
                          <div className="flex-1 text-center py-3 text-xs font-bold text-[#E8002D] cursor-pointer" style={{ borderBottom: '2px solid #E8002D' }}>추천</div>
                          <div className="flex-1 text-center py-3 text-xs font-medium text-gray-400 cursor-pointer">랭킹</div>
                          <div className="flex-1 text-center py-3 text-xs font-medium text-gray-400 cursor-pointer">이벤트</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-1">탭의 개수가 적고 화면 폭 내에서 균등하게 고정 분할하여 표시할 때 사용합니다.</p>
                    </div>

                    {/* Scroll Model */}
                    <div className="space-y-2">
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded tracking-wider uppercase">Scroll Style (스크롤형)</span>
                      <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 overflow-hidden">
                        <div className="bg-white border-b border-gray-200 flex overflow-x-auto scrollbar-none relative">
                          <div className="px-4 py-3 text-xs font-bold text-[#E8002D] whitespace-nowrap cursor-pointer" style={{ borderBottom: '2px solid #E8002D' }}>추천</div>
                          <div className="px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap cursor-pointer">랭킹</div>
                          <div className="px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap cursor-pointer">이벤트</div>
                          <div className="px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap cursor-pointer">신곡</div>
                          <div className="px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap cursor-pointer">인기</div>
                          <div className="px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap cursor-pointer">장르</div>
                          {/* Fade Overlay effect at right side */}
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-1">탭이 다수이거나 화면 폭을 초과할 때 스크롤이 가능하도록 사용하며, 하단 전체에 연한 경계선이 제공됩니다.</p>
                    </div>
                  </div>

                  {/* Selected vs Unselected State */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-6">
                    <h4 className="font-bold text-gray-900 text-sm border-b pb-2 mb-6">State: Selected vs Unselected</h4>
                    
                    <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                      {/* Selected State Card */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center gap-2">
                        <span className="text-[10px] bg-red-50 text-[#E8002D] border border-red-100 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Selected</span>
                        <div className="bg-white border border-gray-200 w-full py-3 text-center text-sm font-bold text-[#E8002D]" style={{ borderBottom: '2px solid #E8002D' }}>
                          Active Tab
                        </div>
                        <p className="text-[11px] text-gray-500 text-center leading-relaxed mt-2">글자 색상이 강조되고, 하단에 Brand Red(#E8002D) Indicator 라인이 표시됩니다.</p>
                      </div>

                      {/* Unselected State Card */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Unselected</span>
                        <div className="bg-white border border-gray-200 w-full py-3 text-center text-sm font-medium text-gray-400">
                          Inactive Tab
                        </div>
                        <p className="text-[11px] text-gray-500 text-center leading-relaxed mt-2">글자 색상이 회색톤으로 비활성화 느낌을 주며, 하단 라인이 비노출 상태입니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Behaviors: Transition Animation */}
              <section className="space-y-6 pt-12 border-t border-gray-100 mt-12">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b pb-2">Behaviors: 이동 시 애니메이션</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    사용자가 탭을 전환하여 탭 영역이 이동할 때, 하단의 Selection Indicator 바가 부드럽게 늘어났다가 줄어들며 이동하는 인터랙션 효과를 가집니다.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Stage 1 */}
                    <div className="bg-gray-50 border border-gray-200/50 rounded-lg p-4 flex flex-col items-center gap-4">
                      <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">1. 시작 지점 (Start)</span>
                      <div className="bg-white border border-gray-200 rounded px-2 py-3 w-full relative h-16 flex items-center justify-around overflow-hidden">
                        <span className="text-xs font-bold text-gray-900">Tab A</span>
                        <span className="text-xs font-medium text-gray-400">Tab B</span>
                        <div className="absolute bottom-0 left-[20%] w-[25%] h-1 bg-[#E8002D] rounded-t-full transition-all duration-300" />
                      </div>
                      <span className="text-[11px] text-gray-500 text-center">Tab A 탭 아래에 인디케이터가 머무름</span>
                    </div>

                    {/* Stage 2 */}
                    <div className="bg-gray-50 border border-gray-200/50 rounded-lg p-4 flex flex-col items-center gap-4">
                      <span className="text-[10px] bg-red-50 text-[#E8002D] font-bold px-2 py-0.5 rounded uppercase tracking-wider">2. 이동 중 (Stretching)</span>
                      <div className="bg-white border border-gray-200 rounded px-2 py-3 w-full relative h-16 flex items-center justify-around overflow-hidden">
                        <span className="text-xs font-bold text-gray-600">Tab A</span>
                        <span className="text-xs font-bold text-gray-600">Tab B</span>
                        {/* stretched indicator */}
                        <div className="absolute bottom-0 left-[20%] w-[60%] h-1 bg-[#E8002D] rounded-t-full transition-all duration-300" />
                      </div>
                      <span className="text-[11px] text-gray-500 text-center">이동 방향으로 바가 길게 늘어나 슬라이딩</span>
                    </div>

                    {/* Stage 3 */}
                    <div className="bg-gray-50 border border-gray-200/50 rounded-lg p-4 flex flex-col items-center gap-4">
                      <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">3. 도착 지점 (End)</span>
                      <div className="bg-white border border-gray-200 rounded px-2 py-3 w-full relative h-16 flex items-center justify-around overflow-hidden">
                        <span className="text-xs font-medium text-gray-400">Tab A</span>
                        <span className="text-xs font-bold text-gray-900">Tab B</span>
                        <div className="absolute bottom-0 left-[55%] w-[25%] h-1 bg-[#E8002D] rounded-t-full transition-all duration-300" />
                      </div>
                      <span className="text-[11px] text-gray-500 text-center">Tab B에 완전히 안착하고 두께와 크기 복원</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Behaviors: Scroll Sticky Action */}
              <section className="space-y-6 pt-12 border-t border-gray-100 mt-12">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b pb-2">Behaviors: 스크롤시 액션 (Sticky Header)</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    모바일 및 웹 브라우저 내에서 스크롤을 조작할 때, 내비게이션 바와 탭의 고정/노출 상태가 능동적으로 제어됩니다.
                  </p>
                  
                  <div className="flex flex-col md:flex-row justify-center items-center gap-16">
                    {/* Screen 1: Scroll Down */}
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Scroll Down (스크롤 내릴 시)
                      </span>
                      <div className="relative">
                        <svg width="180" height="280" viewBox="0 0 180 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                          {/* Notch/Status Bar */}
                          <rect x="0" y="0" width="180" height="15" fill="#F9FAFB" />
                          <circle cx="90" cy="7" r="3" fill="#1A1A1A" />
                          
                          {/* Tab Bar (Sticky at y=15, because Header is hidden/slid up) */}
                          <rect x="0" y="15" width="180" height="32" fill="white" stroke="#F3F4F6" strokeWidth="1" />
                          <text x="30" y="34" fontSize="9" fontWeight="bold" fill="#E8002D" fontFamily="Pretendard, sans-serif">랭킹</text>
                          <rect x="15" y="45" width="30" height="2" fill="#E8002D" />
                          <text x="90" y="34" fontSize="9" fontWeight="medium" fill="#9CA3AF" fontFamily="Pretendard, sans-serif">이벤트</text>
                          <text x="150" y="34" fontSize="9" fontWeight="medium" fill="#9CA3AF" fontFamily="Pretendard, sans-serif">MY</text>
                          
                          {/* Content Area (starts immediately at y=47) */}
                          <rect x="10" y="57" width="160" height="210" rx="4" fill="#F9FAFB" />
                          {/* Content text lines inside content area */}
                          <rect x="20" y="70" width="120" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="85" width="140" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="100" width="80" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="120" width="120" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="135" width="140" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="150" width="80" height="8" rx="2" fill="#E5E7EB" />
                        </svg>
                        
                        {/* Red Arrow overlay indicating swipe/scroll gesture direction */}
                        <div className="absolute right-[-30px] top-[100px] flex flex-col items-center gap-1">
                          <svg width="20" height="50" viewBox="0 0 20 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 5 L10 45 M5 40 L10 45 L15 40" stroke="#E8002D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[10px] text-[#E8002D] font-bold">Scroll Down</span>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-gray-800">Header 숨김 + Tab 고정</p>
                        <p className="text-[11px] text-gray-500">화면을 스크롤 다운(아래로 내리면)할 때는<br/>상단 헤더는 사라지고 Tab만 최상단에 고정됩니다.</p>
                      </div>
                    </div>

                    {/* Screen 2: Scroll Up */}
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Scroll Up (스크롤 올릴 시)
                      </span>
                      <div className="relative">
                        <svg width="180" height="280" viewBox="0 0 180 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                          {/* Notch/Status Bar */}
                          <rect x="0" y="0" width="180" height="15" fill="#F9FAFB" />
                          <circle cx="90" cy="7" r="3" fill="#1A1A1A" />
                          
                          {/* Header (Visible at y=15) */}
                          <rect x="0" y="15" width="180" height="36" fill="white" stroke="#F3F4F6" strokeWidth="1" />
                          <text x="90" y="38" fontSize="11" fontWeight="bold" fill="#1A1A1A" textAnchor="middle" fontFamily="Pretendard, sans-serif">Phoenix Dart</text>
                          
                          {/* Tab Bar (Visible at y=51) */}
                          <rect x="0" y="51" width="180" height="32" fill="white" stroke="#F3F4F6" strokeWidth="1" />
                          <text x="30" y="70" fontSize="9" fontWeight="bold" fill="#E8002D" fontFamily="Pretendard, sans-serif">랭킹</text>
                          <rect x="15" y="81" width="30" height="2" fill="#E8002D" />
                          <text x="90" y="70" fontSize="9" fontWeight="medium" fill="#9CA3AF" fontFamily="Pretendard, sans-serif">이벤트</text>
                          <text x="150" y="70" fontSize="9" fontWeight="medium" fill="#9CA3AF" fontFamily="Pretendard, sans-serif">MY</text>
                          
                          {/* Content Area (starts at y=83) */}
                          <rect x="10" y="93" width="160" height="174" rx="4" fill="#F9FAFB" />
                          {/* Content text lines inside content area */}
                          <rect x="20" y="106" width="120" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="121" width="140" height="8" rx="2" fill="#E5E7EB" />
                          <rect x="20" y="136" width="80" height="8" rx="2" fill="#E5E7EB" />
                        </svg>
                        
                        {/* Red Arrow overlay indicating swipe/scroll gesture direction */}
                        <div className="absolute right-[-30px] top-[100px] flex flex-col items-center gap-1">
                          <svg width="20" height="50" viewBox="0 0 20 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 45 L10 5 M5 10 L10 5 L15 10" stroke="#E8002D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[10px] text-[#E8002D] font-bold">Scroll Up</span>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-gray-800">Header 노출 + Tab 노출</p>
                        <p className="text-[11px] text-gray-500">화면을 스크롤 업(위로 올리면)할 때는<br/>헤더와 Tab 영역이 함께 상단에서 슬라이드 다운되어 노출됩니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── c-popup 전용 섹션 ── */}
          {formData.id === 'c-popup' && !isEditing && (
            <>
              {/* === SECTION 1: POPUP HEADER === */}
              <div className="pt-6 pb-6 mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase mb-4" style={{ fontFamily: 'Outfit, Pretendard, sans-serif' }}>POPUP</h1>
                <p className="text-sm text-gray-900 leading-relaxed font-semibold">
                  Grid는 일관성을 유지하고 일관성 있는 디자인 경험을 만드는 데 필수적입니다.<br />
                  피닉스다트에서 사용되는 모든 스크린과 컴포넌트 사이의 Margin을 정의합니다.
                </p>
                <hr className="border-gray-200 mt-8 mb-12" />
              </div>

              {/* Alert Poup Anatomy */}
              <section className="space-y-6 pt-12 mt-12">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6" style={{ fontFamily: 'Pretendard, sans-serif' }}>Alert Poup Anatomy</h3>
                <div className="bg-[#F5F5F5] rounded-xl p-12 flex justify-center items-center relative min-h-[260px] border border-gray-200/30">
                  <svg width="420" height="200" viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <defs>
                      <filter id="popup-shadow" x="100" y="40" width="220" height="130" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#000000" floodOpacity="0.06" />
                      </filter>
                    </defs>

                    {/* Popup Card Container */}
                    <g filter="url(#popup-shadow)">
                      <rect x="110" y="50" width="200" height="110" rx="8" fill="white" />
                    </g>

                    {/* Title */}
                    <text x="210" y="78" fontSize="13" fontWeight="bold" fill="#1D1F22" textAnchor="middle" fontFamily="Pretendard, sans-serif">Title</text>
                    
                    {/* Sub Text */}
                    <text x="210" y="96" fontSize="9" fill="#717680" textAnchor="middle" fontFamily="Pretendard, sans-serif">text text</text>
                    <text x="210" y="108" fontSize="9" fill="#717680" textAnchor="middle" fontFamily="Pretendard, sans-serif">text text</text>

                    {/* Buttons */}
                    {/* Cancel Button */}
                    <rect x="122" y="126" width="82" height="24" rx="4" fill="#F3F4F6" />
                    <text x="163" y="141" fontSize="9" fontWeight="medium" fill="#374151" textAnchor="middle" fontFamily="Pretendard, sans-serif">취소</text>

                    {/* Confirm Button */}
                    <rect x="216" y="126" width="82" height="24" rx="4" fill="#1A1A1A" />
                    <text x="257" y="141" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">확인</text>

                    {/* Callouts */}
                    {/* 1. Title */}
                    <path d="M210 50 L210 24" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="210" cy="50" r="2.5" fill="#1A1A1A" />
                    <circle cx="210" cy="15" r="9" fill="#1A1A1A" />
                    <text x="210" y="18.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">1</text>
                    
                    {/* 2. Sub Text */}
                    <path d="M235 102 L290 102" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="235" cy="102" r="2.5" fill="#1A1A1A" />
                    <circle cx="299" cy="102" r="9" fill="#1A1A1A" />
                    <text x="299" y="105.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">2</text>
                    
                    {/* 3. Button */}
                    <path d="M257 138 L290 138" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="257" cy="138" r="2.5" fill="#1A1A1A" />
                    <circle cx="299" cy="138" r="9" fill="#1A1A1A" />
                    <text x="299" y="141.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">3</text>
                  </svg>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 space-y-1.5 pl-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  <p>1. Title : 팝업 타이틀이 들어갑니다.</p>
                  <p>2. Sub Text : 서브 문구가 들어갑니다.</p>
                  <p>3. Button : 버튼이 들어갑니다.</p>
                </div>
              </section>

              {/* Alert Popup Variants & Spacing */}
              <section className="space-y-6 pt-12 border-t border-gray-100 mt-12">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>Alert Popup</h3>
                <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-6">
                  Confirm 역할을 하는 버튼은 1개 또는 2개에 한해 사용하며, Popup의 넓이는 270px입니다.
                </p>

                <div className="flex flex-wrap gap-8 justify-center bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-10 items-start">
                  
                  {/* 1 Button Card */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-900">1 Button</span>
                    <div className="bg-white rounded-lg p-5 shadow-lg w-[270px] flex flex-col items-center relative border border-gray-100/50" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.03))' }}>
                      
                      {/* Width Guide: 270px */}
                      <div className="absolute -top-6 left-0 right-0 flex items-center justify-between pointer-events-none">
                        <div className="w-px h-2.5 bg-red-500" />
                        <div className="flex-1 h-px bg-red-500" />
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded mx-1 leading-none">270px</span>
                        <div className="flex-1 h-px bg-red-500" />
                        <div className="w-px h-2.5 bg-red-500" />
                      </div>

                      {/* 8px Spacing Guide */}
                      <div className="absolute top-[40px] left-[185px] w-[16px] h-[8px] flex items-center pointer-events-none">
                        <div className="h-[3px] w-px bg-red-500" />
                        <div className="h-px w-full bg-red-500" />
                        <div className="h-[3px] w-px bg-red-500" />
                        <span className="absolute left-[18px] text-[8px] font-bold text-white bg-red-500 px-1 rounded scale-90 whitespace-nowrap">8px</span>
                      </div>

                      {/* 16px Spacing Guide */}
                      <div className="absolute top-[84px] left-[185px] w-[16px] h-[16px] flex items-center pointer-events-none">
                        <div className="h-[3px] w-px bg-red-500" />
                        <div className="h-px w-full bg-red-500" />
                        <div className="h-[3px] w-px bg-red-500" />
                        <span className="absolute left-[18px] text-[8px] font-bold text-white bg-red-500 px-1 rounded scale-90 whitespace-nowrap">16px</span>
                      </div>

                      {/* 20px Padding Guide */}
                      <div className="absolute right-0 top-[112px] w-[20px] flex items-center pointer-events-none">
                        <div className="h-2 w-px bg-red-500" />
                        <div className="h-px w-full bg-red-500" />
                        <div className="h-2 w-px bg-red-500" />
                        <span className="absolute right-[12px] text-[8px] font-bold text-white bg-red-500 px-1 rounded scale-90 whitespace-nowrap">20px</span>
                      </div>

                      {/* Actual Content Layout */}
                      <span className="font-bold text-sm text-gray-900 mb-2">Title</span>
                      <div className="text-center text-xs text-gray-400 leading-normal mb-4">
                        text text<br/>text text
                      </div>
                      <button className="bg-black hover:bg-neutral-800 text-white text-xs font-bold w-full py-2.5 rounded-lg transition-colors">확인</button>
                    </div>
                  </div>

                  {/* 2 Button Card */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-900">2 Button</span>
                    <div className="bg-white rounded-lg p-5 shadow-lg w-[270px] flex flex-col items-center relative border border-gray-100/50" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.03))' }}>
                      <span className="font-bold text-sm text-gray-900 mb-2">Title</span>
                      <div className="text-center text-xs text-gray-400 leading-normal mb-4">
                        text text<br/>text text
                      </div>
                      <div className="flex gap-2 w-full">
                        <button className="bg-[#F3F4F6] hover:bg-gray-200 text-[#374151] text-xs font-medium flex-1 py-2.5 rounded-lg transition-colors">취소</button>
                        <button className="bg-black hover:bg-neutral-800 text-white text-xs font-bold flex-1 py-2.5 rounded-lg transition-colors">확인</button>
                      </div>
                    </div>
                  </div>

                  {/* 1 Button + Text Button Card */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold text-gray-900">1 Button + Text Button</span>
                    <div className="bg-white rounded-lg p-5 shadow-lg w-[270px] flex flex-col items-center relative border border-gray-100/50" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.03))' }}>
                      <span className="font-bold text-sm text-gray-900 mb-2">Title</span>
                      <div className="text-center text-xs text-gray-400 leading-normal mb-4">
                        texttext<br/>texttext
                      </div>
                      <button className="bg-black hover:bg-neutral-800 text-white text-xs font-bold w-full py-2.5 rounded-lg mb-2 transition-colors">확인</button>
                      <button className="text-gray-400 hover:text-gray-600 text-[9px] hover:underline py-1">texttexttext</button>
                    </div>
                  </div>

                </div>

                {/* Popup Types Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 mt-8">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Type</th>
                        <th className="px-5 py-3.5 font-bold">Button Combination</th>
                        <th className="px-5 py-3.5 font-bold">Example Usage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">Information (정보 제공)</td>
                        <td className="px-5 py-3.5 text-gray-600">확인 / 닫기</td>
                        <td className="px-5 py-3.5 text-gray-600">업데이트가 완료되었습니다.</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">Action Confirmation (작업 수행 여부)</td>
                        <td className="px-5 py-3.5 text-gray-600">예 / 아니오</td>
                        <td className="px-5 py-3.5 text-gray-600">파일을 삭제하시겠습니까?</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">Cancelable Action (취소 가능한 작업)</td>
                        <td className="px-5 py-3.5 text-gray-600">확인 / 취소</td>
                        <td className="px-5 py-3.5 text-gray-600">변경사항을 저장하시겠습니까?</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">Dangerous Action Warning (위험 작업 경고)</td>
                        <td className="px-5 py-3.5 text-gray-600">삭제 / 취소</td>
                        <td className="px-5 py-3.5 text-gray-600">이 데이터를 완전히 삭제하시겠습니까?</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">User Navigation (사용자 이동)</td>
                        <td className="px-5 py-3.5 text-gray-600">나가기 / 취소</td>
                        <td className="px-5 py-3.5 text-gray-600">이 페이지에서 나가시겠습니까?</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">Retry Action (작업 재시도)</td>
                        <td className="px-5 py-3.5 text-gray-600">재시도 / 취소</td>
                        <td className="px-5 py-3.5 text-gray-600">업로드에 실패했습니다. 다시 시도하시겠습니까?</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Toast Anatomy & Types */}
              <section className="space-y-6 pt-12 border-t border-gray-100 mt-12">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>Toast Anatomy</h3>
                <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-6">
                  피닉스다트 내 시스템 폰트는 각 OS에 최적화하여 사용하며 쓰임새에 따라 타입 페이스를 최적화합니다.
                </p>

                {/* Toast Capsules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-10 justify-items-center justify-center max-w-[640px] mx-auto">
                  
                  {/* Toast 성공 */}
                  <div className="flex flex-col items-center gap-3 w-full max-w-[250px]">
                    <span className="text-xs font-bold text-gray-900">성공</span>
                    <div className="bg-gradient-to-r from-[#37655E] to-[#4B5059] text-white rounded-lg px-4 py-3 flex items-center gap-2.5 shadow-lg w-full border border-gray-800/40">
                      <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✓</div>
                      <span className="font-medium text-[11px] whitespace-nowrap" style={{ fontFamily: 'Pretendard, sans-serif' }}>성공 문구가 들어갑니다.</span>
                    </div>
                  </div>

                  {/* Toast 안내 */}
                  <div className="flex flex-col items-center gap-3 w-full max-w-[250px]">
                    <span className="text-xs font-bold text-gray-900">안내</span>
                    <div className="bg-gradient-to-r from-[#334669] to-[#4B5059] text-white rounded-lg px-4 py-3 flex items-center gap-2.5 shadow-lg w-full border border-gray-800/40">
                      <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-[10px] font-bold font-serif flex-shrink-0">i</div>
                      <span className="font-medium text-[11px] whitespace-nowrap" style={{ fontFamily: 'Pretendard, sans-serif' }}>안내성 문구가 들어갑니다.</span>
                    </div>
                  </div>

                  {/* Toast 오류 */}
                  <div className="flex flex-col items-center gap-3 w-full max-w-[250px]">
                    <span className="text-xs font-bold text-gray-900">오류</span>
                    <div className="bg-gradient-to-r from-[#5C3036] to-[#4B5059] text-white rounded-lg px-4 py-3 flex items-center gap-2.5 shadow-lg w-full border border-gray-800/40">
                      <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✕</div>
                      <span className="font-medium text-[11px] whitespace-nowrap" style={{ fontFamily: 'Pretendard, sans-serif' }}>오류 문구가 들어갑니다.</span>
                    </div>
                  </div>

                  {/* Toast 경고 */}
                  <div className="flex flex-col items-center gap-3 w-full max-w-[250px]">
                    <span className="text-xs font-bold text-gray-900">경고</span>
                    <div className="bg-gradient-to-r from-[#675A34] to-[#4B5059] text-white rounded-lg px-4 py-3 flex items-center gap-2.5 shadow-lg w-full border border-gray-800/40">
                      <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">!</div>
                      <span className="font-medium text-[11px] whitespace-nowrap" style={{ fontFamily: 'Pretendard, sans-serif' }}>경고 문구가 들어갑니다.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500 space-y-1.5 pl-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  <p>1. Margin : 외부 기둥의 가장자리와 프레임 사이의 여백입니다.</p>
                  <p>2. Column : 그리드의 기둥 블록이며 요소를 배치해야 하는 위치를 표시합니다.</p>
                  <p>3. Gutter : 기둥 사이의 공간이며 너비는 기본 단위의 배수여야 합니다.</p>
                </div>

                {/* Toast Positions Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 mt-8">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Position</th>
                        <th className="px-5 py-3.5 font-bold">Condition</th>
                        <th className="px-5 py-3.5 font-bold">Example</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">상단</td>
                        <td className="px-5 py-3.5 text-gray-600">하단에 중요 UI가 있는 화면</td>
                        <td className="px-5 py-3.5 text-gray-600">바텀시트, 하단 버튼, 하단 탭바</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">하단</td>
                        <td className="px-5 py-3.5 text-gray-600">상단에 중요 UI가 있는 화면</td>
                        <td className="px-5 py-3.5 text-gray-600">입력 폼, 상단 액션 영역</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-900 font-bold">하단 (기본값)</td>
                        <td className="px-5 py-3.5 text-gray-600">특별한 조건 없을 때</td>
                        <td className="px-5 py-3.5 text-gray-600">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* ── c-bottomsheet 전용 섹션 ── */}
          {formData.id === 'c-bottomsheet' && !isEditing && (
            <>
              {/* === SECTION 1: BOTTOM SHEET HEADER === */}
              <div className="pt-4 pb-2 mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase mb-3" style={{ fontFamily: 'Outfit, Pretendard, sans-serif' }}>BOTTOM SHEET</h1>
                <p className="text-sm text-gray-900 leading-relaxed font-semibold">
                  바텀시트(Bottom Sheet)는 화면 하단에 고정되어 현재 또는 이전 화면과 관련된 콘텐츠를 표시하는 UI 요소입니다.<br />
                  페이지를 이탈하지 않고도 중요한 정보 전달이나 복잡한 정보 입력을 요청할 수 있는 대화 상자의 대안으로 사용되며, 활성화되면 사용자와 기존 페이지 콘텐츠의 상호작용은 차단됩니다.<br />
                  따라서 시트는 사용자가 작업을 완료하거나 시트를 닫기 전까지는 이전 페이지로 돌아갈 수 없기 때문에, 반드시 필요한 상황에서만 사용되어야 합니다.
                </p>
                <hr className="border-gray-200 mt-6 mb-6" />
              </div>

              {/* Bottom Sheet Anatomy */}
              <section className="space-y-4 pt-2 mt-2">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4" style={{ fontFamily: 'Pretendard, sans-serif' }}>Bottom Sheet Anatomy</h3>
                <div className="bg-[#F5F5F5] rounded-xl p-10 flex justify-center items-center relative min-h-[360px] border border-gray-200/30">
                  <svg width="460" height="340" viewBox="0 0 460 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <defs>
                      <filter id="bs-shadow" x="140" y="160" width="180" height="170" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000000" floodOpacity="0.08" />
                      </filter>
                    </defs>

                    {/* Phone Screen Mockup Container (Slender 150x320 ratio) */}
                    <rect x="155" y="10" width="150" height="320" rx="0" fill="#2E2F32" stroke="#D1D5DB" strokeWidth="2" />
                    
                    {/* Dimmed Scrim (2) */}
                    <path d="M156 11 H304 V170 H156 Z" fill="#2E2F32" opacity="0.12" />
                    
                    {/* Bottom Sheet Card Container (1) */}
                    <g filter="url(#bs-shadow)">
                      <path d="M156 329 L156 190 C156 179, 166 170, 176 170 H284 C294 170, 304 179, 304 190 V329 Z" fill="white" />
                    </g>

                    {/* Handlebar (7) */}
                    <rect x="215" y="178" width="30" height="3" rx="1.5" fill="#E5E7EB" />

                    {/* Header Title (3) */}
                    <text x="168" y="200" fontSize="10" fontWeight="bold" fill="#1D1F22" fontFamily="Pretendard, sans-serif">Title</text>
                    
                    {/* Close Button (4) */}
                    <path d="M285 193 L291 199 M291 193 L285 199" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Grid Columns Overlay (5) - covers mockup entire content width */}
                    <g opacity="0.3">
                      <rect x="167" y="10" width="26" height="320" fill="#FFF0F2" />
                      <rect x="200" y="10" width="26" height="320" fill="#FFF0F2" />
                      <rect x="233" y="10" width="26" height="320" fill="#FFF0F2" />
                      <rect x="266" y="10" width="26" height="320" fill="#FFF0F2" />
                    </g>

                    {/* Contents Area Placeholders */}
                    <rect x="167" y="225" width="125" height="3" rx="1.5" fill="#E5E7EB" />
                    <rect x="167" y="238" width="100" height="3" rx="1.5" fill="#E5E7EB" />
                    <rect x="167" y="251" width="115" height="3" rx="1.5" fill="#E5E7EB" />

                    {/* Button (6) */}
                    <rect x="167" y="290" width="126" height="24" rx="6" fill="#E8002D" />
                    <text x="230" y="305" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">Text</text>

                    {/* Callouts */}
                    {/* 1. Sheet */}
                    <path d="M156 240 L80 240" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="156" cy="240" r="2.5" fill="#1A1A1A" />
                    <circle cx="70" cy="240" r="9" fill="#1A1A1A" />
                    <text x="70" y="243.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">1</text>

                    {/* 2. Scrim */}
                    <path d="M250 80 L380 80" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="250" cy="80" r="2.5" fill="#1A1A1A" />
                    <circle cx="390" cy="80" r="9" fill="#1A1A1A" />
                    <text x="390" y="83.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">2</text>

                    {/* 3. Header Title */}
                    <path d="M172 198 L80 198" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="172" cy="198" r="2.5" fill="#1A1A1A" />
                    <circle cx="70" cy="198" r="9" fill="#1A1A1A" />
                    <text x="70" y="201.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">3</text>

                    {/* 4. Close Button */}
                    <path d="M288 196 L380 196" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="288" cy="196" r="2.5" fill="#1A1A1A" />
                    <circle cx="390" cy="196" r="9" fill="#1A1A1A" />
                    <text x="390" y="199.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">4</text>

                    {/* 5. Contents area */}
                    <path d="M280 240 L380 240" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="280" cy="240" r="2.5" fill="#1A1A1A" />
                    <circle cx="390" cy="240" r="9" fill="#1A1A1A" />
                    <text x="390" y="243.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">5</text>

                    {/* 6. Button */}
                    <path d="M285 302 L380 302" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="285" cy="302" r="2.5" fill="#1A1A1A" />
                    <circle cx="390" cy="302" r="9" fill="#1A1A1A" />
                    <text x="390" y="305.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">6</text>

                    {/* 7. Draggable (Handlebar) */}
                    <path d="M230 178 L380 178" stroke="#9CA3AF" strokeWidth="1" />
                    <circle cx="230" cy="178" r="2.5" fill="#1A1A1A" />
                    <circle cx="390" cy="178" r="9" fill="#1A1A1A" />
                    <text x="390" y="181.5" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Pretendard, sans-serif">7</text>
                  </svg>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 space-y-1.5 pl-2" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  <p>1. Sheet : 바텀시트 전체 영역</p>
                  <p>2. Scrim : 활성화 시 기존 화면을 덮어 상호작용을 막아주는 어두운 반투명 배경 영역</p>
                  <p>3. Header Title (Option) : 바텀시트의 콘텐츠 정보를 요약하는 제목</p>
                  <p>4. Close Button (Option) : 바텀시트를 명시적으로 닫을 수 있는 X 버튼</p>
                  <p>5. Contents area : 입력 양식, 리스트, 상세 내용 등 실제 콘텐츠가 배치되는 영역</p>
                  <p>6. Button (Option) : 사용자의 핵심 최종 액션을 실행하는 고정 버튼</p>
                  <p>7. Draggable : 바텀시트 높이를 조절하거나 스와이프다운으로 닫을 수 있는 드래그 가능 영역 (핸들바)</p>
                </div>
              </section>

              {/* Components */}
              <section className="space-y-6 pt-8 border-t border-gray-100 mt-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>Components</h3>
                <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-4">
                  Sheet는 용도에 따라 A.Basic, B. Banner, C.Nudging, D. Nudging + Close로 구분됩니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-8 justify-items-center justify-center">
                  
                  {/* A. Basic */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">A. Basic</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Bottom Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        {/* Drag Handle */}
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        {/* Header */}
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Content Area placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* B. Banner */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">B. Banner</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Bottom Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        {/* Banner content */}
                        <div className="flex-1 bg-[#FFF0F2] m-2.5 rounded-lg relative overflow-hidden flex flex-col items-center justify-center text-center p-2 z-10">
                          <div className="w-full h-full bg-red-100/30 border border-dashed border-red-200/50 rounded flex flex-col items-center justify-center gap-1">
                            <span className="text-[9px] font-extrabold text-[#E8002D] leading-none">BANNER CONTENT</span>
                            <span className="text-[7px] text-red-400 font-medium">이벤트 / 알림 배너</span>
                          </div>
                          
                          {/* Banner Page Indicator */}
                          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 scale-90">
                            <span>1 / 3</span>
                            <span className="w-1.5 h-1.5 flex items-center justify-center font-mono text-[5px]">‖</span>
                          </div>
                        </div>
                        
                        {/* Bottom Option Bar */}
                        <div className="px-3 py-2 bg-white border-t border-gray-100 flex justify-between items-center text-[8px] font-bold text-gray-500 z-10">
                          <button className="hover:text-gray-950 transition-colors">오늘만 그만보기</button>
                          <button className="hover:text-gray-950 transition-colors">닫기</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* C. Nudging */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">C. Nudging</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Bottom Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-6 h-0.5 bg-gray-200 rounded-full mx-auto my-1.5 flex-shrink-0" />
                        
                        <div className="flex-1 px-3 py-1 space-y-1 overflow-hidden z-10 text-center flex flex-col justify-center">
                          <span className="text-[8px] font-bold text-gray-900">텍스트만 들어가는 템플릿입니다.</span>
                          <span className="text-[7px] text-gray-400 leading-tight">상세 길이는 텍스트에 맞춰 자동 조절됩니다.</span>
                        </div>
                        
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* D. Nudging + Close */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">D. Nudging + Close</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Bottom Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-6 h-0.5 bg-gray-200 rounded-full mx-auto my-1.5 flex-shrink-0" />
                        
                        {/* Close button icon */}
                        <div className="absolute top-1.5 right-2 flex items-center justify-center w-3 h-3 rounded-full z-30">
                          <span className="text-[8px] text-gray-400 font-bold leading-none">✕</span>
                        </div>
                        
                        <div className="flex-1 px-3 py-1 space-y-1 overflow-hidden z-10 text-center flex flex-col justify-center">
                          <span className="text-[8px] font-bold text-gray-955">텍스트만 들어가는 템플릿입니다.</span>
                          <span className="text-[7px] text-gray-400 leading-tight">상세 길이는 텍스트에 맞춰 자동 조절됩니다.</span>
                        </div>
                        
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Interaction */}
              <section className="space-y-6 pt-8 border-t border-gray-100 mt-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>Interaction</h3>
                <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-4">
                  Draggable은 화면을 자유롭게 확장하거나 축소하여 콘텐츠를 유연하게 탐색할 수 있는 인터랙션입니다.<br/>
                  Draggable은 기본적으로 Half 높이로 시작하며, 사용자가 핸들을 위로 끌거나 콘텐츠를 스크롤하면 Full 뷰로 확장됩니다.
                </p>

                <div className="flex flex-wrap gap-8 justify-center bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-10">
                  
                  {/* Step 1: Half View */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Half View (시작 상태)</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-md">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Contents area placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <div className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md text-center">Text</div>
                        </div>
                      </div>

                      {/* Gesture Overlay */}
                      <div className="absolute top-[125px] left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center">
                        <svg width="12" height="20" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
                          <path d="M6 22 L6 2 M2 6 L6 2 L10 6" stroke="#E8002D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                          <path d="M12 2v10m0 0a3 3 0 0 0 3-3V7M12 12a3 3 0 0 1-3-3V8" stroke="#E8002D" strokeWidth="2" strokeLinecap="round" />
                          <rect x="7" y="9" width="10" height="11" rx="2" fill="white" stroke="#E8002D" strokeWidth="2" />
                          <circle cx="12" cy="14" r="1.5" fill="#E8002D" />
                        </svg>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Dragging Up */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Dragging Up (이동 상태)</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-md">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Sheet */}
                      <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Contents area placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                          <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <div className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md text-center">Text</div>
                        </div>
                      </div>

                      {/* Gesture Overlay */}
                      <div className="absolute top-[35px] left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="7" y="10" width="10" height="10" rx="2" fill="white" stroke="#E8002D" strokeWidth="2" />
                          <path d="M9 10V8a1 1 0 0 1 2 0v2M13 10V7a1 1 0 0 1 2 0v3" stroke="#E8002D" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="12" cy="15" r="1.5" fill="#E8002D" />
                        </svg>
                        <svg width="12" height="30" viewBox="0 0 12 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                          <path d="M6 28 L6 2 M2 6 L6 2 L10 6" stroke="#E8002D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Full View */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Full View (확장 완료)</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-md">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Status bar spacer */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-black flex items-center justify-center text-white text-[6px] font-bold z-35">
                        Status Bar
                      </div>
                      <div className="absolute top-4 left-0 right-0 h-4 bg-[#10B981]/20 border-b border-dashed border-[#10B981] flex items-center justify-center z-25">
                        <span className="bg-[#10B981] text-white text-[6px] font-bold px-0.5 rounded leading-none scale-75">16px</span>
                      </div>
                      
                      {/* Sheet */}
                      <div className="absolute top-[32px] bottom-0 left-0 right-0 bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Contents area placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                          <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <div className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md text-center">Text</div>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Spacing & Interactive Behaviors Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                    <span className="text-sm font-bold text-[#E8002D] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D]" /> Handlebar (핸들바)
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      바텀시트 상단에 핸들바는 반드시 표시됩니다. 사용자는 핸들바를 통해 바텀시트를 드래그하여 확장하거나 닫을 수 있습니다.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                    <span className="text-sm font-bold text-[#E8002D] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D]" /> Close Button (닫기 버튼)
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      상단 우측에 X 버튼을 제공하는 것이 권장됩니다. 닫기 버튼은 항상 사용자가 명확하게 인지 가능해야 합니다.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                    <span className="text-sm font-bold text-[#E8002D] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D]" /> Dismiss (닫기 동작)
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      - 액션을 실행하는 내부 아이템(컨텐츠)을 탭하면 시트가 자동으로 닫힙니다.<br/>
                      - 시트 바깥의 딤드 배경 영역(Scrim)을 탭하면 닫힙니다.<br/>
                      - 바텀시트를 핸들바 기준으로 아래로 스와이프하면 닫힙니다.<br/>
                      - 상단 우측의 닫기(X) 버튼을 누르면 닫힙니다.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                    <span className="text-sm font-bold text-[#E8002D] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D]" /> Expand (확장 동작)
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      - 핸들바를 기본 높이(Half)에서 위로 드래그하여 임계값을 넘기면 Full 높이까지 확장됩니다. 콘텐츠 양에 따라 전체 화면까지 확장될 수 있습니다.<br/>
                      - 시트 내부 콘텐츠 영역을 최상단(스크롤 0)에서 위로 드래그하면 핸들바와 동일한 드래그 확장 동작을 수행할 수 있습니다 (선택 사항).
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 md:col-span-2">
                    <span className="text-sm font-bold text-[#E8002D] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8002D]" /> Scroll & Dismiss (스크롤 & 닫기)
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      시트 내부 콘텐츠 스크롤이 최상단(offset 0)에 있는 상태에서, 콘텐츠 영역을 추가적으로 아래 방향으로 쓸어내려 드래그하면 바텀시트가 자연스럽게 닫히는 인터랙션이 제공됩니다.
                    </p>
                  </div>
                </div>
              </section>

              {/* With Keyboard */}
              <section className="space-y-6 pt-8 border-t border-gray-100 mt-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>With Keyboard</h3>
                
                {/* Non-Scrollable Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>Non-Scrollable</h4>
                  <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-4">
                    하단 시트의 작업 중 키보드를 가져올 경우, 키보드 높이에 맞춰 시트가 위로 이동합니다.
                  </p>

                  <div className="flex flex-wrap gap-12 justify-center bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-8">
                    
                    {/* Keyboard Closed */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Keyboard Closed</span>
                      <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                        {/* Scrim */}
                        <div className="absolute inset-0 bg-black/12 z-10" />
                        
                        {/* Sheet */}
                        <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                          
                          <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                            <span className="text-[10px] font-bold text-gray-900">Title</span>
                            <span className="text-[10px] font-medium text-gray-400">✕</span>
                          </div>
                          
                          {/* Contents placeholder */}
                          <div className="flex-1 px-3 py-1.5 space-y-2 overflow-hidden z-10">
                            <div className="h-6 bg-gray-50 border border-gray-200 rounded px-1.5 flex items-center text-[7px] text-gray-400 select-none">텍스트를 입력해주세요</div>
                          </div>
                          
                          {/* Button */}
                          <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                            <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                          </div>
                        </div>

                        {/* Layout Grid Overlay */}
                        <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                        </div>
                      </div>
                    </div>

                    {/* Keyboard Open */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Keyboard Open</span>
                      <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                        {/* Scrim */}
                        <div className="absolute inset-0 bg-black/12 z-10" />
                        
                        {/* Sheet */}
                        <div className="absolute bottom-[90px] left-0 right-0 h-[150px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                          
                          <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                            <span className="text-[10px] font-bold text-gray-900">Title</span>
                            <span className="text-[10px] font-medium text-gray-400">✕</span>
                          </div>
                          
                          {/* Contents placeholder */}
                          <div className="flex-1 px-3 py-1.5 space-y-2 overflow-hidden z-10">
                            <div className="h-6 bg-white border border-[#E8002D] rounded px-1.5 flex items-center text-[7px] text-gray-900 select-none relative">
                              타이핑 중
                              <span className="w-0.5 h-3 bg-[#E8002D] ml-0.5 animate-pulse" />
                            </div>
                          </div>
                          
                          {/* Button */}
                          <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                            <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                          </div>
                        </div>

                        {/* Keyboard */}
                        <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-[#EAEBED] border-t border-gray-300 z-30 p-1 flex flex-col justify-between font-sans">
                          <div className="flex justify-between gap-0.5">
                            {['q','w','e','r','t','y','u','i','o','p'].map(k => (
                              <div key={k} className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                          </div>
                          <div className="flex justify-center gap-0.5 px-2">
                            {['a','s','d','f','g','h','j','k','l'].map(k => (
                              <div key={k} className="w-[13px] bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                          </div>
                          <div className="flex justify-between gap-0.5 px-0.5">
                            <div className="w-[18px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">⇧</div>
                            {['z','x','c','v','b','n','m'].map(k => (
                              <div key={k} className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                            <div className="w-[18px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">⌫</div>
                          </div>
                          <div className="flex justify-between gap-1 px-1">
                            <div className="w-[26px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[5px] font-bold shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-950">ABC</div>
                            <div className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[5px] text-gray-400 font-bold shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">space</div>
                            <div className="w-[30px] bg-[#3B82F6] h-4.5 rounded flex items-center justify-center text-[5px] font-bold text-white shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">return</div>
                          </div>
                        </div>

                        {/* Layout Grid Overlay */}
                        <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Scrollable Section */}
                <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
                  <h4 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Pretendard, sans-serif' }}>Scrollable</h4>
                  <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-4">
                    키보드의 높이로 인해 하단 시트의 전체 높이를 표시할 수 없는 경우, 시트 내의 내용을 확인하기 위해 콘텐츠 영역에서 스크롤이 활성화됩니다.
                  </p>

                  <div className="flex flex-wrap gap-12 justify-center bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-8">
                    
                    {/* Scrollable: Keyboard Closed */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Normal Scrollable</span>
                      <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                        {/* Scrim */}
                        <div className="absolute inset-0 bg-black/12 z-10" />
                        
                        {/* Sheet */}
                        <div className="absolute bottom-0 left-0 right-0 h-[210px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                          
                          <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                            <span className="text-[10px] font-bold text-gray-900">Title</span>
                            <span className="text-[10px] font-medium text-gray-400">✕</span>
                          </div>
                          
                          {/* Scrollable Contents Area */}
                          <div className="flex-1 px-3 py-1 space-y-2 overflow-y-auto relative z-10">
                            {Array.from({ length: 8 }).map((_, idx) => (
                              <div key={idx} className="h-1.5 bg-gray-100 rounded w-full" />
                            ))}
                            {/* Virtual Scrollbar */}
                            <div className="absolute right-1 top-2 bottom-2 w-0.5 bg-gray-300 rounded-full" />
                          </div>
                          
                          {/* Button */}
                          <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                            <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                          </div>
                        </div>

                        {/* Layout Grid Overlay */}
                        <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                        </div>
                      </div>
                    </div>

                    {/* Scrollable: Keyboard Open */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Keyboard Open</span>
                      <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-sm">
                        {/* Scrim */}
                        <div className="absolute inset-0 bg-black/12 z-10" />
                        
                        {/* Sheet (pushed up by 90px) */}
                        <div className="absolute bottom-[90px] left-0 right-0 h-[210px] bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                          
                          <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                            <span className="text-[10px] font-bold text-gray-900">Title</span>
                            <span className="text-[10px] font-medium text-gray-400">✕</span>
                          </div>
                          
                          {/* Scrollable Contents Area */}
                          <div className="flex-1 px-3 py-1 space-y-2 overflow-y-auto relative z-10">
                            {Array.from({ length: 8 }).map((_, idx) => (
                              <div key={idx} className="h-1.5 bg-gray-100 rounded w-full" />
                            ))}
                            {/* Virtual Scrollbar */}
                            <div className="absolute right-1 top-2 bottom-2 w-0.5 bg-gray-300 rounded-full" />
                          </div>
                          
                          {/* Button */}
                          <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                            <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                          </div>
                        </div>

                        {/* Keyboard */}
                        <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-[#EAEBED] border-t border-gray-300 z-30 p-1 flex flex-col justify-between font-sans">
                          <div className="flex justify-between gap-0.5">
                            {['q','w','e','r','t','y','u','i','o','p'].map(k => (
                              <div key={k} className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                          </div>
                          <div className="flex justify-center gap-0.5 px-2">
                            {['a','s','d','f','g','h','j','k','l'].map(k => (
                              <div key={k} className="w-[13px] bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                          </div>
                          <div className="flex justify-between gap-0.5 px-0.5">
                            <div className="w-[18px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">⇧</div>
                            {['z','x','c','v','b','n','m'].map(k => (
                              <div key={k} className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">{k}</div>
                            ))}
                            <div className="w-[18px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[6px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-900">⌫</div>
                          </div>
                          <div className="flex justify-between gap-1 px-1">
                            <div className="w-[26px] bg-gray-300 h-4.5 rounded flex items-center justify-center text-[5px] font-bold shadow-[0_0.5px_0_rgba(0,0,0,0.15)] text-gray-955">ABC</div>
                            <div className="flex-1 bg-white h-4.5 rounded flex items-center justify-center text-[5px] text-gray-400 font-bold shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">space</div>
                            <div className="w-[30px] bg-[#3B82F6] h-4.5 rounded flex items-center justify-center text-[5px] font-bold text-white shadow-[0_0.5px_0_rgba(0,0,0,0.15)]">return</div>
                          </div>
                        </div>

                        {/* Layout Grid Overlay */}
                        <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                          <div className="flex-1 bg-[#FFF0F2] h-full" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* Spacing */}
              <section className="space-y-6 pt-8 border-t border-gray-100 mt-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>Spacing</h3>
                <p className="text-xs text-gray-500 leading-relaxed pl-1 mb-4">
                  Full 높이는 Status Bar 기준으로 Fixed는 48px, Draggable은 16px 간격까지 확장되며, Half 높이는 두 타입 모두 전체 화면 높이의 60%를 사용합니다.
                </p>

                <div className="flex flex-wrap gap-12 justify-center bg-[#F5F5F5] border border-gray-200/30 rounded-xl p-10">
                  
                  {/* Fixed-Full */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">Fixed-Full</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-md">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-[20px] bg-black text-white text-[5px] font-bold flex items-center justify-center z-30">
                        Status Bar
                      </div>
                      
                      {/* Green Spacer 48px */}
                      <div className="absolute top-[20px] left-0 right-0 h-[48px] bg-[#10B981]/25 border-b border-dashed border-[#10B981] flex items-center justify-center z-20">
                        <span className="bg-[#10B981] text-white text-[7px] font-extrabold px-1 py-0.5 rounded leading-none scale-75">48</span>
                      </div>
                      
                      {/* Sheet */}
                      <div className="absolute top-[68px] bottom-0 left-0 right-0 bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Contents placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                  {/* Draggable-Full */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">Draggable-Full</span>
                    <div className="relative w-[150px] h-[320px] border border-gray-300 rounded-[28px] bg-[#3E3E3E] overflow-hidden shadow-md">
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-black/12 z-10" />
                      
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-[20px] bg-black text-white text-[5px] font-bold flex items-center justify-center z-30">
                        Status Bar
                      </div>
                      
                      {/* Green Spacer 16px */}
                      <div className="absolute top-[20px] left-0 right-0 h-[16px] bg-[#10B981]/25 border-b border-dashed border-[#10B981] flex items-center justify-center z-20">
                        <span className="bg-[#10B981] text-white text-[6px] font-extrabold px-0.5 rounded leading-none scale-75">16</span>
                      </div>
                      
                      {/* Sheet */}
                      <div className="absolute top-[36px] bottom-0 left-0 right-0 bg-white rounded-t-[20px] flex flex-col z-20 overflow-hidden">
                        <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto my-2 flex-shrink-0" />
                        
                        <div className="px-3 pb-1.5 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-bold text-gray-900">Title</span>
                          <span className="text-[10px] font-medium text-gray-400">✕</span>
                        </div>
                        
                        {/* Contents placeholder */}
                        <div className="flex-1 px-3 py-1 space-y-1.5 overflow-hidden z-10">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                        </div>
                        
                        {/* Button */}
                        <div className="p-2 bg-white flex-shrink-0 z-10 border-t border-gray-50">
                          <button className="w-full bg-[#E8002D] text-white text-[9px] font-bold py-1.5 rounded-md">Text</button>
                        </div>
                      </div>

                      {/* Layout Grid Overlay */}
                      <div className="absolute inset-0 px-3 flex gap-[7px] pointer-events-none opacity-30 z-25">
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                        <div className="flex-1 bg-[#FFF0F2] h-full" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </>
          )}

          {/* Variants Section */}
          {!isEditing && formData.variants && formData.variants.length > 0 && formData.id !== 'c-buttons' && formData.id !== 'c-chips' && formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet' && (
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
          {!isEditing && formData.usage_guidelines && formData.usage_guidelines.length > 0 && formData.id !== 'c-buttons' && formData.id !== 'c-chips' && formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet' && (
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
          {!isEditing && formData.spec && (formData.spec.sizes?.length > 0 || formData.spec.notes) && formData.id !== 'c-chips' && formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && (
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
          {!isEditing && formData.figma_properties && formData.figma_properties.length > 0 && formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet' && (
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

          {formData.id !== 'c-textfield' && formData.id !== 'c-tab' && formData.id !== 'c-popup' && formData.id !== 'c-bottomsheet' && (
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
          )}
        </div>
      </div>
    </div>
  );
}
