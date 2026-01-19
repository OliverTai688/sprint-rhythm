
import React from 'react';
import { motion } from 'framer-motion';
import { Sprint } from '../types';
import { LIFE_TRACK_CONFIG } from '../constants';
import { formatDate, getSprintStatus } from '../utils';

interface SprintCardProps {
  sprint: Sprint;
  onClick: (sprint: Sprint) => void;
  isFocused?: boolean;
  theme?: 'dark' | 'light';
  onToggleWeek?: (weekIndex: number) => void;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint, onClick, isFocused, theme = 'dark', onToggleWeek }) => {
  const status = getSprintStatus(sprint);
  const config = LIFE_TRACK_CONFIG[sprint.lifeTrack];
  const isCurrent = status === 'current';

  const handleWeekToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (onToggleWeek) {
      onToggleWeek(index);
    }
  };
  
  return (
    <motion.div
      layout
      onClick={() => onClick(sprint)}
      whileHover={{ y: -8, scale: isCurrent ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: status === 'past' ? (theme === 'dark' ? 0.3 : 0.5) : 1, 
        x: 0,
        scale: isCurrent ? 1.1 : 1,
        zIndex: isCurrent ? 10 : 1
      }}
      className={`relative flex-shrink-0 w-64 md:w-72 h-[420px] cursor-pointer rounded-3xl p-6 transition-all duration-500 overflow-hidden group
        ${isCurrent ? 'mx-8' : 'mx-4'}
        ${theme === 'dark' 
          ? `border-white/10 bg-zinc-900/40 backdrop-blur-xl ${isCurrent ? `ring-2 ring-white/20 shadow-2xl ${config.shadow}` : ''}` 
          : `border-zinc-200 bg-white shadow-lg ${isCurrent ? `ring-2 ring-zinc-400 shadow-2xl shadow-zinc-200` : ''}`
        } border
      `}
    >
      {/* Background Glow */}
      <div className={`absolute -inset-2 bg-gradient-to-br ${config.gradient} opacity-20 group-hover:opacity-40 transition-opacity blur-2xl`} />

      <div className="relative h-full flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border transition-colors duration-500
              ${theme === 'dark' ? `${config.border} bg-black/50 text-white` : 'border-zinc-200 bg-zinc-100 text-zinc-500'}
            `}>
              {status === 'current' ? 'CURRENT' : status.toUpperCase()}
            </span>
            <div className={theme === 'dark' ? 'text-white/40' : 'text-zinc-300'}>
              {config.icon}
            </div>
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 transition-colors duration-500 
            ${theme === 'dark' ? (isCurrent ? 'text-white' : 'text-white/80') : (isCurrent ? 'text-zinc-900' : 'text-zinc-700')}
          `}>
            {sprint.title}
          </h3>
          
          <p className={`text-sm font-medium transition-colors duration-500 ${theme === 'dark' ? 'text-white/50' : 'text-zinc-400'}`}>
            {formatDate(sprint.startDate)} — {formatDate(sprint.endDate)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Weekly Reviews Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[9px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-white/30' : 'text-zinc-400'}`}>
                Weekly Reviews
              </span>
            </div>
            <div className="flex justify-between items-center gap-1">
              {sprint.weeklyReviews?.map((reviewed, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleWeekToggle(e, idx)}
                  className={`flex-1 h-10 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border
                    ${reviewed 
                      ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20 text-white' 
                      : (theme === 'dark' 
                          ? 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-300 hover:bg-zinc-100')
                    }
                  `}
                >
                  <span className="text-[8px] font-bold leading-none mb-1">W{idx + 1}</span>
                  {reviewed ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`text-xs font-semibold py-1 px-3 rounded-md w-fit border transition-colors duration-500
            ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-zinc-50 border-zinc-100 text-zinc-500'}
          `}>
             {config.name.split(' ')[0]} 狀態
          </div>
          
          {isCurrent && (
             <motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 3, repeat: Infinity }}
               className={`w-full h-1 rounded-full overflow-hidden transition-colors ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-100'}`}
             >
               <div className={`h-full w-2/3 ${theme === 'dark' ? 'bg-white/40' : 'bg-zinc-400'}`} />
             </motion.div>
          )}

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-white/40' : 'text-zinc-400'}`}>點擊查看詳情</span>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className={`absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'from-black/20' : 'from-zinc-100/30'} to-transparent`} />
    </motion.div>
  );
};

export default SprintCard;
