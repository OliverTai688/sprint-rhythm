
import React from 'react';
import { LifeTrack } from './types';

export const LIFE_TRACK_CONFIG = {
  [LifeTrack.STABILITY]: {
    name: '穩定 Stability',
    description: '維持生活結構、能量回補、節奏整理',
    color: '#06b6d4', // Cyan 500
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/50',
    shadow: 'shadow-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  [LifeTrack.GROWTH]: {
    name: '成長 Growth',
    description: '主動投入學習、創作、突破與累積',
    color: '#10b981', // Emerald 500
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/50',
    shadow: 'shadow-emerald-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      </svg>
    )
  },
  [LifeTrack.RECOVERY]: {
    name: '修復 Recovery',
    description: '面對壓力、失落、耗竭，進行修復與重整',
    color: '#f43f5e', // Rose 500
    gradient: 'from-rose-500/20 to-purple-500/20',
    border: 'border-rose-500/50',
    shadow: 'shadow-rose-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
};
