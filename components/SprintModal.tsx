
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprint, LifeTrack, Material } from '../types';
import { LIFE_TRACK_CONFIG } from '../constants';
import { getSprintDateRange } from '../utils';

interface SprintModalProps {
  sprint: Sprint | null;
  onClose: () => void;
  onUpdate: (updatedSprint: Sprint) => void;
  theme?: 'dark' | 'light';
}

const SprintModal: React.FC<SprintModalProps> = ({ sprint, onClose, onUpdate, theme = 'dark' }) => {
  if (!sprint) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Sprint>(sprint);

  // Sync state when sprint changes
  useEffect(() => {
    setFormData(sprint);
    setIsEditing(false);
  }, [sprint]);

  const config = LIFE_TRACK_CONFIG[formData.lifeTrack];

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      label: '新增連結',
      url: 'https://'
    };
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const updateMaterial = (id: string, field: keyof Material, value: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeMaterial = (id: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id)
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 backdrop-blur-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-black/90' : 'bg-slate-100/80'}`}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-2xl border rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}
        >
          {/* Header Banner */}
          <div className={`h-40 bg-gradient-to-br ${config.gradient} relative flex items-end p-8 shrink-0`}>
            <div className="absolute top-6 right-6 flex items-center space-x-3">
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${isEditing ? 'bg-emerald-500 text-white' : (theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900/20')}`}
              >
                {isEditing ? '儲存變更' : '編輯資料'}
              </button>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-black/20 hover:bg-black/40 text-white/70' : 'bg-white/50 hover:bg-white/80 text-zinc-500 shadow-sm'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-3 w-full pr-12">
                   <select 
                    value={formData.lifeTrack}
                    onChange={(e) => setFormData(prev => ({ ...prev, lifeTrack: e.target.value as LifeTrack }))}
                    className={`border text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 outline-none appearance-none transition-colors duration-500 ${theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-white/80 border-zinc-200 text-zinc-600'}`}
                   >
                     {Object.entries(LIFE_TRACK_CONFIG).map(([key, val]) => (
                       <option key={key} value={key} className={theme === 'dark' ? "bg-zinc-900" : "bg-white"}>{val.name}</option>
                     ))}
                   </select>
                   <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full bg-transparent border-b text-3xl font-bold focus:outline-none focus:border-white transition-colors duration-500 ${theme === 'dark' ? 'border-white/20 text-white' : 'border-zinc-300 text-zinc-900 focus:border-zinc-600'}`}
                   />
                </div>
              ) : (
                <>
                  <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border transition-colors duration-500 mb-2 inline-block
                    ${theme === 'dark' ? `${config.border} bg-black/50 text-white` : 'border-zinc-200 bg-white/50 text-zinc-600'}
                  `}>
                    {config.name}
                  </span>
                  <h2 className={`text-3xl font-bold transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{formData.title}</h2>
                </>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
            <section>
              <h4 className={`text-[10px] uppercase tracking-widest font-bold mb-3 transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-zinc-400'}`}>週期時間範圍</h4>
              <p className={`text-lg font-medium transition-colors duration-500 ${theme === 'dark' ? 'text-white/80' : 'text-zinc-700'}`}>{getSprintDateRange(formData)}</p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-zinc-400'}`}>主線說明</h4>
              </div>
              {isEditing ? (
                <textarea
                  className={`w-full h-32 border rounded-xl p-4 text-sm transition-all resize-none outline-none ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white/80 focus:border-white/20' : 'bg-zinc-50 border-zinc-200 text-zinc-700 focus:border-zinc-400 focus:bg-white shadow-inner'}`}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              ) : (
                <p className={`leading-relaxed italic transition-colors duration-500 ${theme === 'dark' ? 'text-white/60' : 'text-zinc-500'}`}>
                  「{formData.description || '尚未設定說明...'}」
                </p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-zinc-400'}`}>相關資源與連結</h4>
                {isEditing && (
                  <button onClick={addMaterial} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400">
                    + 新增資源
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {formData.materials.map((mat) => (
                  <div key={mat.id} className="relative group">
                    {isEditing ? (
                      <div className={`flex flex-col sm:flex-row items-center gap-3 p-4 border rounded-2xl transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100 shadow-sm'}`}>
                        <input 
                          type="text"
                          placeholder="資源名稱"
                          value={mat.label}
                          onChange={(e) => updateMaterial(mat.id, 'label', e.target.value)}
                          className={`w-full sm:w-1/3 border rounded-lg px-3 py-1 text-sm transition-colors ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                        />
                        <input 
                          type="text"
                          placeholder="URL 連結"
                          value={mat.url}
                          onChange={(e) => updateMaterial(mat.id, 'url', e.target.value)}
                          className={`w-full sm:flex-1 border rounded-lg px-3 py-1 text-sm transition-colors ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white/60' : 'bg-white border-zinc-200 text-zinc-500'}`}
                        />
                        <button onClick={() => removeMaterial(mat.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg shrink-0 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center p-4 border rounded-2xl transition-all group/item ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm hover:shadow-md'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform ${theme === 'dark' ? 'bg-black/20 text-white/40' : 'bg-zinc-100 text-zinc-400'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-white/70' : 'text-zinc-700'}`}>{mat.label}</span>
                          <span className={`text-[10px] truncate max-w-[200px] transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-zinc-400'}`}>{mat.url}</span>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
                {formData.materials.length === 0 && (
                  <div className={`text-center py-8 border-2 border-dashed rounded-2xl text-xs transition-colors ${theme === 'dark' ? 'border-white/5 text-white/10' : 'border-zinc-100 text-zinc-300'}`}>
                    尚無資源連結
                  </div>
                )}
              </div>
            </section>
          </div>
          
          <div className={`p-8 border-t flex justify-end shrink-0 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
             {isEditing ? (
               <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className={`px-6 py-2 rounded-xl font-bold text-sm transition-colors ${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    完成並儲存
                  </button>
               </div>
             ) : (
               <button 
                onClick={onClose}
                className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
              >
                了解當前節奏
              </button>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SprintModal;
