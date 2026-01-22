
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onGoToDashboard?: () => void;
  showDashboardLink?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onGoToDashboard, showDashboardLink }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fdff]">
      <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <img 
            src="https://vn.mynavi-techtus.com/assets/images/logo.png" 
            alt="Mynavi TechTus" 
            className="h-10 w-auto object-contain" 
          />
          <div className="h-6 w-px bg-gray-100 hidden sm:block"></div>
          <span className="font-bold text-gray-800 text-sm hidden sm:block tracking-tight">HR INSIGHT HUB</span>
        </div>
        
        {showDashboardLink && (
          <button 
            onClick={onGoToDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#00a8cc] hover:bg-cyan-50 transition-all"
          >
            <span className="text-lg">📊</span>
            <span className="hidden sm:inline">Admin Dash</span>
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="py-10 text-center border-t border-gray-50 bg-white/50">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
          Mynavi TechTus Vietnam
        </p>
        <p className="text-[10px] text-gray-400">
          © {new Date().getFullYear()} - Dedicated to an Excellent Employee Experience
        </p>
      </footer>
    </div>
  );
};
