import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: '대시보드', path: '/' },
    { name: '컴포넌트', path: '/components' },
    { name: '토큰', path: '/tokens' },
    { name: '변경로그', path: '/changelog' },
    { name: '검색', path: '/search' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">PDS Hub</h1>
        <p className="text-xs text-gray-500 mt-1">Design System Governance</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
