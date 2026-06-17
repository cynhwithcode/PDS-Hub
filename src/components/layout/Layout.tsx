import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const mainScroll = mainRef.current ? mainRef.current.scrollTop : 0;
      const windowScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      
      if (mainScroll > 300 || windowScroll > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-gray-900">
      <div className="flex flex-grow flex-1 relative">
        <Sidebar />
        <main ref={mainRef} className="flex-1 flex flex-col relative min-w-0">
          <div className="flex-grow">
            <Outlet />
          </div>
        </main>
      </div>
      
      <footer className="py-6 px-10 border-t border-gray-150 bg-white flex justify-between items-center text-xs text-gray-400 font-light select-none w-full">
        <span>&copy; {new Date().getFullYear()} Phoenixdarts. All rights reserved.</span>
        <span>Phoenixdarts 디자인실 디자인기획팀 안유현,고승신</span>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-white border border-gray-200 text-[#E8002D] hover:bg-[#E8002D] hover:text-white hover:border-[#E8002D] w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        title="페이지 최상단으로 이동"
      >
        <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
