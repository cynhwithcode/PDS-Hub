import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-100">
        <Link to="/tokens" className="block hover:opacity-85 transition-opacity">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">PDS HUB</h1>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Design System Governance</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* 토큰 */}
        <NavLink
          to="/tokens"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-colors duration-200 ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          토큰
        </NavLink>

        {/* 컴포넌트 */}
        <NavLink
          to="/components"
          end
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-colors duration-200 ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          컴포넌트
        </NavLink>

        {/* 컴포넌트 하위 – 서브메뉴 필요 시 여기에 추가 */}
      </nav>
    </aside>
  );
}
