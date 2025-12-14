
import React, { useState } from 'react';
import DynamicIsland from './components/DynamicIsland';
import PlanGenerator from './components/PlanGenerator';
import PlanDisplay from './components/PlanDisplay';
import { DailyPlan } from './types';

const App: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);

  const handleToggleTask = (dayIndex: number, taskId: string) => {
    setPlans(prev => {
      const newPlans = [...prev];
      const task = newPlans[dayIndex].tasks.find(t => t.id === taskId);
      if (task) task.completed = !task.completed;
      return newPlans;
    });
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-[#1DB954] selection:text-white relative bg-[#050505]">
      {/* 动态背景 */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#1DB954]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <DynamicIsland />

      <main className="max-w-6xl mx-auto px-6 pt-44">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#1DB954] mb-8">
            <i className="fab fa-spotify text-sm"></i>
            Spotify API 已就绪
          </div>
          <h1 className="text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
            专注计划 <span className="text-[#1DB954]">·</span> 音乐岛
          </h1>
          <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            为您连接 Spotify 的音乐海洋，结合 Gemini 的智慧规划。<br/>
            让学习不再是枯燥的任务，而是一场沉浸式的感官之旅。
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <PlanGenerator onPlanGenerated={setPlans} />
        </section>
        
        {plans.length > 0 ? (
          <PlanDisplay plans={plans} onToggleTask={handleToggleTask} />
        ) : (
          <div className="mt-12 py-32 flex flex-col items-center justify-center glass rounded-[4rem] border-dashed border-white/10 group hover:border-[#1DB954]/30 transition-all duration-700">
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <i className="fas fa-feather-pointed text-4xl text-white/20 group-hover:text-[#1DB954]/50 transition-colors"></i>
             </div>
             <p className="text-3xl font-black text-white/20 mb-2">等待灵感降临</p>
             <p className="text-white/10 text-sm">在上方输入你的学习目标，开启 AI 智能规划</p>
          </div>
        )}
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-12 py-6 rounded-[3rem] flex items-center gap-16 z-[90] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button className="text-[#1DB954] text-2xl hover:scale-125 transition active:scale-95"><i className="fas fa-home-alt"></i></button>
        <button className="text-white/20 text-2xl hover:text-white transition active:scale-95"><i className="fas fa-search"></i></button>
        <div className="relative">
           <div className="absolute inset-0 bg-[#1DB954] blur-2xl opacity-20"></div>
           <button className="w-16 h-16 bg-white text-black rounded-[1.5rem] flex items-center justify-center -mt-16 border-4 border-[#050505] shadow-2xl hover:rotate-90 transition-all duration-500 relative z-10">
              <i className="fas fa-plus text-2xl"></i>
           </button>
        </div>
        <button className="text-white/20 text-2xl hover:text-white transition active:scale-95"><i className="fas fa-book-sparkles"></i></button>
        <button className="text-white/20 text-2xl hover:text-white transition active:scale-95"><i className="fas fa-user-circle"></i></button>
      </nav>
    </div>
  );
};

export default App;
