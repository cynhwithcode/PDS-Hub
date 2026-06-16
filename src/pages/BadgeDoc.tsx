import { useNavigate } from 'react-router-dom';

/* ──────────────────────────────────────────
   Badge 미리보기 원자 컴포넌트
────────────────────────────────────────── */
function DotBadge({ size = 'M' }: { size?: 'S' | 'M' | 'L' | 'XL' }) {
  const dim: Record<string, string> = { S: 'w-3 h-3', M: 'w-4 h-4', L: 'w-5 h-5', XL: 'w-6 h-6' };
  return <span className={`inline-block rounded-full bg-[#E8002D] ${dim[size]}`} />;
}

function NumberBadge({ count, size = 'M' }: { count: number | string; size?: 'S' | 'M' | 'L' | 'XL' }) {
  const dim: Record<string, string> = {
    S: 'h-4 min-w-[1rem] text-[9px]',
    M: 'h-5 min-w-[1.25rem] text-[10px]',
    L: 'h-6 min-w-[1.5rem] text-xs',
    XL: 'h-7 min-w-[1.75rem] text-sm',
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#E8002D] text-white font-bold px-1 ${dim[size]}`}
    >
      {count}
    </span>
  );
}

function IconBadge() {
  return (
    <span className="relative inline-flex">
      {/* bell icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E8002D] border border-white" />
    </span>
  );
}

/* ──────────────────────────────────────────
   섹션 타이틀
────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-900 mb-1">{children}</h2>
  );
}

/* ──────────────────────────────────────────
   Do / Don't 카드
────────────────────────────────────────── */
function GuideCard({
  type,
  title,
  desc,
  children,
}: {
  type: 'do' | 'dont';
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  const isDo = type === 'do';
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
          isDo ? 'text-green-600' : 'text-red-500'
        }`}
      >
        <span
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full border-2 text-xs font-bold ${
            isDo ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
          }`}
        >
          {isDo ? '✓' : '✕'}
        </span>
        {title}
      </div>
      <div className="bg-gray-50 flex items-center justify-center min-h-[80px] border-t border-gray-100">
        {children}
      </div>
      <div className="px-4 py-2 text-xs text-gray-500 leading-relaxed">{desc}</div>
    </div>
  );
}

/* ──────────────────────────────────────────
   메인 페이지
────────────────────────────────────────── */
export default function BadgeDoc() {
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10 bg-[#FAFAFA]">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('/components')}
        className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-2"
      >
        ← 목록으로 돌아가기
      </button>

      {/* ── 타이틀 ── */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">BADGE</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Badge는 알림의 유형, 상태 표시, 수량 발생 등 다양한 목적에 따라 다른 시각화 수단이 요소됩니다.<br />
          기본 형태인 도트형, Status Badge, Count Badge, Label Badge 유형을 나타내며 다채로운 컬포넌트와 부수속에 대한 배터리 아이콘에 사용됩니다.<br />
          특히 Status, Count, LabelBadge는 각종별 기능과 목적에따라 명확하게 구분됩니다.
        </p>
      </div>

      {/* ── Badge Anatomy ── */}
      <section>
        <SectionTitle>Badge Anatomy</SectionTitle>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 flex flex-col items-center gap-4">
          {/* 위쪽 – 검정 원 */}
          <div className="flex gap-6 items-center">
            <span className="w-6 h-6 rounded-full bg-gray-900 inline-block" />
            <span className="w-6 h-6 rounded-full bg-gray-900 inline-block" />
            <span className="w-6 h-6 rounded-full bg-gray-900 inline-block" />
          </div>
          {/* 아래쪽 – 빨간 원 */}
          <div className="flex gap-6 items-center">
            <span className="w-6 h-6 rounded-full bg-[#E8002D] inline-block" />
            <span className="w-6 h-6 rounded-full bg-[#E8002D] inline-block" />
            <span className="w-6 h-6 rounded-full bg-[#E8002D] inline-block" />
          </div>
        </div>
        {/* 범례 */}
        <div className="mt-3 text-xs text-gray-500 space-y-0.5">
          <p>1. Container</p>
          <p>2. Digit Left / Right</p>
          <p>3. Dot Icon</p>
        </div>
      </section>

      {/* ── Components ── */}
      <section>
        <SectionTitle>Components</SectionTitle>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Badge는 기본적으로 세 가지 형태로 제공됩니다. Dot Badge는 단순히 알림 존재 여부를 나타내며,<br />
          Number Badge는 구체적인 수량을, Icon Badge는 아이콘 위에 얹혀 사용합니다.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Dot Badge', node: <DotBadge size="M" /> },
            { label: 'Number Badge', node: <NumberBadge count={1} size="M" /> },
            { label: 'Icon Badge', node: <IconBadge /> },
          ].map(({ label, node }) => (
            <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center py-8">{node}</div>
              <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 text-center">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Size ── */}
      <section>
        <SectionTitle>Size</SectionTitle>
        <p className="text-xs text-gray-400 mb-4">
          뱃지의 사이즈는 4가지 크기로 구분됩니다. 사용 맥락에 따라 적절한 크기를 선택하세요.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          {/* 헤더 */}
          <div className="grid grid-cols-5 border-b border-gray-200">
            <div className="px-4 py-2 text-xs text-gray-400" />
            {(['S', 'M', 'L', 'XL'] as const).map((s) => (
              <div key={s} className="px-4 py-2 text-xs font-bold text-gray-500 text-center">{s}</div>
            ))}
          </div>
          {/* Row: 숫자 뱃지 */}
          {[1, 9, 99].map((n) => (
            <div key={n} className="grid grid-cols-5 border-b border-gray-100 items-center">
              <div className="px-4 py-3 text-xs text-gray-400">{n}</div>
              {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                <div key={s} className="flex items-center justify-center py-3">
                  <NumberBadge count={n > 99 ? '99+' : n} size={s} />
                </div>
              ))}
            </div>
          ))}
          {/* Row: Dot 뱃지 */}
          <div className="grid grid-cols-5 items-center">
            <div className="px-4 py-3 text-xs text-gray-400">dot</div>
            {(['S', 'M', 'L', 'XL'] as const).map((s) => (
              <div key={s} className="flex items-center justify-center py-3">
                <DotBadge size={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2 Digits + ── */}
      <section>
        <SectionTitle>2 Digits +</SectionTitle>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          자릿수 Badge에서 단수인 경우와 99를 초과하는 경우를 고려합니다.<br />
          두 자리 — 숫자가 99를 초과하면 반드시 '99+'로 노출해야 합니다.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-end justify-center gap-16 py-10">
            <div className="flex flex-col items-center gap-3">
              <NumberBadge count={9} size="L" />
              <span className="text-xs text-gray-400">1digit</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <NumberBadge count="99+" size="L" />
              <span className="text-xs text-gray-400">99digit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Usage Guidelines ── */}
      <section>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <div className="grid grid-cols-2 gap-4">

          {/* Do 1 */}
          <GuideCard
            type="do"
            title="Do: 사이드 상단에 있는 Badge 최대 한 개 사용 기능"
            desc="Badge는 하나의 아이콘에 최대 한 개만 사용합니다. 여러 개의 Badge를 동시에 표시하지 않습니다."
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E8002D] border-2 border-white" />
            </div>
          </GuideCard>

          {/* Don't 1 */}
          <GuideCard
            type="dont"
            title="Don't: 개수의 상하의 최상위 길이 비교 변경 적용 변경"
            desc="Badge는 L, XL, XXL로 사이즈 아이콘에 시각적으로 너무 크거나 작지 않아야 합니다. 적절한 크기의 Badge를 선택하세요."
          >
            <div className="flex items-end gap-6">
              {[17, 20, 41].map((n) => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <NumberBadge count={n} size={n === 17 ? 'S' : n === 20 ? 'M' : 'XL'} />
                  <span className="text-xs text-gray-400">{n}</span>
                </div>
              ))}
            </div>
          </GuideCard>

          {/* Do 2 */}
          <GuideCard
            type="do"
            title="Do: 카운트 숫자 인원 전달 정보 비로ㄱ"
            desc="아이콘 위에 Badge를 사용하여 알림 수량이나 상태를 명확하게 전달합니다."
          >
            <IconBadge />
          </GuideCard>

          {/* Don't 2 */}
          <GuideCard
            type="dont"
            title="Don't: 카운트 숫자인 경우, badge의 각 부 인원 강도 설명 파악"
            desc="Badge에 과도한 정보를 담거나, 아이콘과 관련 없는 위치에 Badge를 배치하지 않습니다."
          >
            <div className="relative">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* 잘못된 예시: 뱃지 두 개 */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E8002D] border-2 border-white" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#E8002D] border-2 border-white" />
            </div>
          </GuideCard>

        </div>
      </section>
    </div>
  );
}
