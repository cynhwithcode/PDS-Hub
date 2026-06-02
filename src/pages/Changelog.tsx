import { useState } from 'react';
import { useChangelog, type ChangelogItem } from '../hooks/useChangelog';
import { useComponents } from '../hooks/useComponents';
import { useTokens } from '../hooks/useTokens';

export default function Changelog() {
  const { changelog } = useChangelog();
  const { components } = useComponents();
  const { tokens } = useTokens();

  const [typeFilter, setTypeFilter] = useState<'all' | 'component' | 'token'>('all');
  const [actionFilter, setActionFilter] = useState<'all' | 'create' | 'update' | 'deprecate'>('all');

  const filteredLogs = changelog
    .filter((log) => typeFilter === 'all' || log.target_type === typeFilter)
    .filter((log) => actionFilter === 'all' || log.action === actionFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getActionColor = (action: string) => {
    switch(action) {
      case 'create': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'update': return 'bg-green-100 text-green-800 border-green-200';
      case 'deprecate': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTargetName = (log: ChangelogItem) => {
    if (log.target_type === 'component') {
      const comp = components.find((c) => c.id === log.target_id);
      return comp ? comp.name : log.target_id;
    } else {
      const token = tokens.find((t) => t.id === log.target_id);
      return token ? token.name : log.target_id;
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Changelog</h1>
        <p className="text-gray-500 mt-2 text-lg">디자인 시스템 변경 이력</p>
      </header>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/2 space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">대상 필터</label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'component' | 'token')}
          >
            <option value="all">전체보기</option>
            <option value="component">컴포넌트 (Component)</option>
            <option value="token">토큰 (Token)</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">액션 필터</label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as 'all' | 'create' | 'update' | 'deprecate')}
          >
            <option value="all">모든 액션</option>
            <option value="create">생성 (Created)</option>
            <option value="update">수정 (Updated)</option>
            <option value="deprecate">중단 (Deprecated)</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {filteredLogs.length > 0 ? (
          <div className="space-y-8 relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100"></div>
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative pl-10">
                <div className="absolute left-2.5 top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300 shadow-sm z-10"></div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(log.date).toLocaleString('ko-KR')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {log.target_type === 'component' ? 'Component' : 'Token'}: {getTargetName(log)}
                    </span>
                  </div>
                  <p className="text-gray-900 text-base leading-relaxed">{log.note}</p>
                  <p className="text-xs text-gray-400">담당자: {log.changed_by}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            해당 조건의 변경 이력이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
