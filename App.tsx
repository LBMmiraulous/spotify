
import React, { useState } from 'https://esm.sh/react@^19.2.3';
import DynamicIsland from './components/DynamicIsland';
import PlanGenerator from './components/PlanGenerator';
import PlanDisplay from './components/PlanDisplay';
import { DailyPlan } from './types';

const App: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);

  const handleToggleTask = (dayIndex: number, taskId: string) => {
    setPlans(prev => {
      const newPlans = JSON.parse(JSON.stringify(prev));
      const task = newPlans[dayIndex].tasks.find((t: any) => t.id === taskId);
      if (task) task.completed = !task.completed;
      return newPlans;
    });
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-[#1DB954] selection:text-white relative bg-[#050505]">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#1DB954]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <DynamicIsland />

      <main className="max-w-6xl mx-auto px-6 pt-44">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#1DB954] mb-8">
            <i className="fab fa-spotify text-sm"></i>
            Spotify Premium 集成
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-none">
            专注计划 <span className="text-[#1DB954]">·</span> 音乐岛
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            连通 Spotify 音乐海洋，结合 Gemini 智慧规划。
          </p>
        </header>

        <PlanGenerator onPlanGenerated={setPlans} />
        
        {plans.length > 0 ? (
          <PlanDisplay plans={plans} onToggleTask={handleToggleTask} />
        ) : (
          <div className="mt-12 py-32 flex flex-col items-center justify-center glass rounded-[4rem] border-dashed border-white/10">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <i className="fas fa-feather-pointed text-3xl text-white/20"></i>
             </div>
             <p className="text-2xl font-black text-white/20">等待灵感生成...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
