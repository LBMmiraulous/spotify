
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { DailyPlan } from '../types';
import { STUDY_THEMES } from '../constants';

interface PlanGeneratorProps {
  onPlanGenerated: (plans: DailyPlan[]) => void;
}

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ onPlanGenerated }) => {
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !goal) return;
    setLoading(true);
    try {
      const plans = await generateStudyPlan(topic, goal);
      onPlanGenerated(plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] p-8 mb-12 shadow-inner border-white/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-wand-sparkles text-white text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">AI 学习规划专家</h2>
          <p className="text-white/40 text-sm">输入你的目标，让 Gemini 为你量身定制</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">你想学习什么？</label>
            <div className="relative group">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：高等数学、量子物理..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all group-hover:bg-white/10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
                 {STUDY_THEMES.slice(0, 3).map(t => (
                   <button 
                     key={t} 
                     type="button" 
                     onClick={() => setTopic(t)} 
                     className="text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/40 border border-indigo-500/30 transition"
                   >
                     {t}
                   </button>
                 ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">你的具体目标？</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例如：掌握薛定谔方程的核心推导"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/10"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-500/30 group active:scale-[0.98]"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner animate-spin"></i>
              <span>正在构思您的完美计划...</span>
            </>
          ) : (
            <>
              <i className="fas fa-bolt group-hover:animate-pulse"></i>
              <span>即刻生成专属学习方案</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PlanGenerator;
