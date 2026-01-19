
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprint } from './types';
import { generateSprints, getSprintStatus } from './utils';
import SprintCard from './components/SprintCard';
import SprintModal from './components/SprintModal';

const App: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize data and theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('sprint_rhythm_theme');
    if (savedTheme === 'light') setTheme('light');

    const saved = localStorage.getItem('sprint_rhythm_data_v4');
    if (saved) {
      setSprints(JSON.parse(saved));
    } else {
      const startDate = new Date('2026-01-17T00:00:00');
      const initialSprints = generateSprints(startDate, 12);
      setSprints(initialSprints);
    }
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem('sprint_rhythm_theme', theme);
  }, [theme]);

  // Save data
  useEffect(() => {
    if (sprints.length > 0) {
      localStorage.setItem('sprint_rhythm_data_v4', JSON.stringify(sprints));
    }
  }, [sprints]);

  // Focus current sprint on load
  useEffect(() => {
    if (sprints.length > 0 && scrollContainerRef.current) {
      const currentIndex = sprints.findIndex(s => getSprintStatus(s) === 'current');
      if (currentIndex !== -1) {
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (!container) return;
          const cards = container.children;
          const currentCard = cards[currentIndex] as HTMLElement;
          if (currentCard) {
            const scrollPos = currentCard.offsetLeft - (window.innerWidth / 2) + (currentCard.offsetWidth / 2);
            container.scrollTo({ left: scrollPos, behavior: 'smooth' });
          }
        }, 300);
      }
    }
  }, [sprints]);

  const updateSprint = (updated: Sprint) => {
    setSprints(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSprint(updated);
  };

  const toggleWeeklyReview = (sprintId: string, weekIndex: number) => {
    setSprints(prev => prev.map(s => {
      if (s.id === sprintId) {
        const newReviews = [...s.weeklyReviews];
        newReviews[weekIndex] = !newReviews[weekIndex];
        return { ...s, weeklyReviews: newReviews };
      }
      return s;
    }));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const currentSprint = sprints.find(s => getSprintStatus(s) === 'current');

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-zinc-900'}`}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className={`absolute top-0 -left-20 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-700 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-400/10'}`} />
        <div className={`absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-700 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-400/10'}`} />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-40 p-6 md:p-8 flex justify-between items-center backdrop-blur-md transition-colors duration-500 ${theme === 'dark' ? 'bg-black/10' : 'bg-white/40'}`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>SPRINT RHYTHM</h1>
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/40' : 'text-zinc-400'}`}>人生衝刺節奏可視化</p>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-white/5 text-yellow-400 border border-white/10' : 'bg-zinc-900/5 text-zinc-600 border border-zinc-200'}`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-zinc-500'}`}>系統運行中</span>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-colors ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white/80' : 'border-zinc-200 bg-white text-zinc-600 shadow-sm'}`}>
              {new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Roadmap */}
      <main className="flex-1 flex flex-col justify-center pt-24 pb-12 overflow-hidden">
        <div className={`w-full h-[1px] relative mb-12 transition-colors duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-200'}`}>
           <div className="absolute top-1/2 left-0 w-full flex justify-center -translate-y-1/2">
             <span className={`px-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white/20' : 'bg-slate-50 text-zinc-400'}`}>
               2026 Life Roadmap
             </span>
           </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto overflow-y-hidden px-[15vw] py-20 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {sprints.map((sprint) => (
            <div key={sprint.id}>
              <SprintCard 
                sprint={sprint} 
                onClick={setSelectedSprint}
                isFocused={sprint.id === currentSprint?.id}
                theme={theme}
                onToggleWeek={(weekIdx) => toggleWeeklyReview(sprint.id, weekIdx)}
              />
            </div>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center items-center mt-12 space-x-12">
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-zinc-400'}`}>當前狀態</span>
            <div className={`px-6 py-2 rounded-2xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-800 shadow-md'}`}>
              <span className="text-sm font-medium">
                {currentSprint ? `正在經歷 ${currentSprint.title}` : '目前無活躍 Sprint'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className={`p-8 border-t flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest gap-4 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 text-white/20' : 'border-zinc-200 text-zinc-400'}`}>
        <div>© 2026 SPRINT RHYTHM VISUALIZER</div>
        <div className="flex space-x-8">
          <button className={`hover:text-rose-500 cursor-pointer transition-colors`} onClick={() => { if(confirm('確定要重置所有數據嗎？')) { localStorage.removeItem('sprint_rhythm_data_v4'); window.location.reload(); } }}>重置數據</button>
          <span className="hover:opacity-60 cursor-help transition-opacity">隱私聲明</span>
          <span className="hover:opacity-60 cursor-help transition-opacity">導出數據</span>
        </div>
      </footer>

      {/* Modal */}
      <SprintModal 
        sprint={selectedSprint}
        onClose={() => setSelectedSprint(null)}
        onUpdate={updateSprint}
        theme={theme}
      />
    </div>
  );
};

export default App;
