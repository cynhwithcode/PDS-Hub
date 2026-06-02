import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const [isFoundationOpen, setIsFoundationOpen] = useState(
    location.pathname.startsWith('/foundation')
  );

  const menuItems = [
    { name: '대시보드', path: '/' },
    { name: '컴포넌트', path: '/components' },
    { name: '토큰', path: '/tokens' },
    { name: '변경로그', path: '/changelog' },
    { name: '검색', path: '/search' },
  ];

  const foundationItems = [
    { name: 'Color', path: '/foundation/color' },
    { name: 'Typography', path: '/foundation/typography' },
    { name: 'Spacing', path: '/foundation/spacing' },
    { name: 'Iconography', path: '/foundation/iconography' },
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

        <div className="pt-2">
          <button 
            onClick={() => setIsFoundationOpen(!isFoundationOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <span className="font-medium text-left flex-1">Foundation</span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFoundationOpen ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isFoundationOpen && (
            <div className="mt-1 space-y-1 pl-4">
              <NavLink
                to="/foundation"
                end
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                Overview
              </NavLink>
              {foundationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
