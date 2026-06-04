import { useComponents } from '../hooks/useComponents';
import { useTokens } from '../hooks/useTokens';
import { useChangelog } from '../hooks/useChangelog';

export default function Dashboard() {
  const { components: componentsData } = useComponents();
  const { tokens: tokensData } = useTokens();
  const { changelog: changelogData } = useChangelog();

  const stableCount = componentsData.filter(c => c.status === 'stable').length;
  const betaCount = componentsData.filter(c => c.status === 'beta').length;
  const deprecatedCount = componentsData.filter(c => c.status === 'deprecated').length;
  const totalComponents = componentsData.length;

  const totalTokens = tokensData.length;
  const colorCount = tokensData.filter(t => t.category === 'color').length;
  const typoCount = tokensData.filter(t => t.category === 'typography').length;
  const spaceCount = tokensData.filter(t => t.category === 'spacing').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const changesThisMonth = changelogData.filter(log => {
    const d = new Date(log.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const recentChanges = [...changelogData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stablePercent = (stableCount / totalComponents) * 100;
  const betaPercent = (betaCount / totalComponents) * 100;
  const deprecatedPercent = (deprecatedCount / totalComponents) * 100;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-lg">피닉스다트 디자인 시스템 현황</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">전체 컴포넌트</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{totalComponents}</span>
            <span className="text-sm text-gray-500">개</span>
          </div>
          <div className="mt-6 flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Stable {stableCount}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Beta {betaCount}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span>Deprecated {deprecatedCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">전체 토큰</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{totalTokens}</span>
            <span className="text-sm text-gray-500">개</span>
          </div>
          <div className="mt-6 flex gap-4 text-sm text-gray-600">
            <span className="bg-gray-50 px-2 py-1 rounded-md">Color {colorCount}</span>
            <span className="bg-gray-50 px-2 py-1 rounded-md">Typo {typoCount}</span>
            <span className="bg-gray-50 px-2 py-1 rounded-md">Space {spaceCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">이번 달 변경 건수</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{changesThisMonth}</span>
            <span className="text-sm text-gray-500">건</span>
          </div>
        </div>
      </div>

        {/* DS 커버리지 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
          <h2 className="text-sm font-medium text-gray-500">DS 커버리지</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{totalComponents}</span>
            <span className="text-sm text-gray-500">/ 9</span>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#E8002D] h-2.5 rounded-full transition-all duration-500" style={{ width: `${(totalComponents / 9) * 100}%` }}></div>
          </div>
        </div>

        {/* 카테고리 분포 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
          <h2 className="text-sm font-medium text-gray-500 mb-4">카테고리 분포</h2>
          {[
            { label: 'Action', count: componentsData.filter(c => c.category_group === 'Action').length },
            { label: 'Input', count: componentsData.filter(c => c.category_group === 'Input').length },
            { label: 'Display', count: componentsData.filter(c => c.category_group === 'Display').length },
            { label: 'Feedback', count: componentsData.filter(c => c.category_group === 'Feedback').length },
            { label: 'Navigation', count: componentsData.filter(c => c.category_group === 'Navigation').length },
          ].map(item => {
            const percent = totalComponents ? (item.count / totalComponents) * 100 : 0;
            return (
              <div key={item.label} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span>{item.count}개</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#E8002D] h-3 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Component Status Bar */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-8">컴포넌트 상태 비율</h2>
          
          <div className="h-6 w-full flex rounded-full overflow-hidden mb-8 bg-gray-100">
            <div style={{ width: `${stablePercent}%` }} className="bg-green-500 transition-all duration-1000"></div>
            <div style={{ width: `${betaPercent}%` }} className="bg-yellow-500 transition-all duration-1000"></div>
            <div style={{ width: `${deprecatedPercent}%` }} className="bg-red-400 transition-all duration-1000"></div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>
                <span className="font-medium text-gray-700">Stable (안정됨)</span>
              </div>
              <span className="text-gray-900 font-semibold">{stablePercent.toFixed(0)}% <span className="text-gray-400 ml-1 font-normal">({stableCount}개)</span></span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span>
                <span className="font-medium text-gray-700">Beta (테스트 중)</span>
              </div>
              <span className="text-gray-900 font-semibold">{betaPercent.toFixed(0)}% <span className="text-gray-400 ml-1 font-normal">({betaCount}개)</span></span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></span>
                <span className="font-medium text-gray-700">Deprecated (사용 중단)</span>
              </div>
              <span className="text-gray-900 font-semibold">{deprecatedPercent.toFixed(0)}% <span className="text-gray-400 ml-1 font-normal">({deprecatedCount}개)</span></span>
            </div>
          </div>
        </section>

        {/* Recent Changes Timeline */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-8">최근 변경 이력</h2>
          <div className="space-y-8">
            {recentChanges.map((log, index) => {
              const targetName = log.target_type === 'component' 
                ? componentsData.find(c => c.id === log.target_id)?.name || log.target_id
                : tokensData.find(t => t.id === log.target_id)?.name || log.target_id;

              return (
                <div key={log.id} className="relative pl-8">
                  {/* Timeline line */}
                  {index !== recentChanges.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-[-2rem] w-px bg-gray-200"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-1 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow-sm z-10"></div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 font-medium">{new Date(log.date).toLocaleDateString('ko-KR')}</span>
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {targetName}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-snug">{log.note}</p>
                    <p className="text-xs text-gray-400 mt-1">담당자: {log.changed_by}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
