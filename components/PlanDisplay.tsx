
import React, { useState, useEffect } from 'react';
import { DailyPlan, Task } from '../types';

interface PlanDisplayProps {
  plans: DailyPlan[];
  onToggleTask: (dayIndex: number, taskId: string) => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plans, onToggleTask }) => {
  const [activePomodoro, setActivePomodoro] = useState<{taskId: string, timeLeft: number} | null>(null);

  useEffect(() => {
    let interval: number;
    if (activePomodoro && activePomodoro.timeLeft > 0) {
      interval = window.setInterval(() => {
        setActivePomodoro(prev => prev ? {...prev, timeLeft: prev.timeLeft - 1} : null);
      }, 1000);
    } else if (activePomodoro && activePomodoro.timeLeft === 0) {
      alert('⏰ 专注时间到！喝杯水休息一下吧。');
      setActivePomodoro(null);
    }
    return () => clearInterval(interval);
  }, [activePomodoro]);

  const startPomodoro = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (activePomodoro?.taskId === taskId) {
      setActivePomodoro(null);
    } else {
      setActivePomodoro({ taskId, timeLeft: 25 * 60 });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-20 pb-40">
      {plans.map((day, dayIdx) => (
        <div key={dayIdx} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/5 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-[#1DB954]/10 text-[#1DB954] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#1DB954]/20">第 {dayIdx + 1} 天</span>
                <span className="text-white/30 text-xs font-mono">{day.date}</span>
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter">{day.focus}</h3>
            </div>
            <div className="flex gap-4">
              <div className="glass px-6 py-4 rounded-3xl text-center min-w-[100px]">
                 <p className="text-white/30 text-[10px] uppercase font-bold mb-1">完成度</p>
                 <p className="text-xl font-black text-white">{Math.round((day.tasks.filter(t => t.completed).length / day.tasks.length) * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-5">
              {day.tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => onToggleTask(dayIdx, task.id)}
                  className={`glass group relative overflow-hidden p-7 rounded-[2.5rem] flex items-center justify-between cursor-pointer transition-all duration-500 border-white/5 hover:bg-white/[0.05] ${task.completed ? 'opacity-30 grayscale' : 'hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-[#1DB954] border-[#1DB954]' : 'border-white/10 group-hover:border-[#1DB954]/50'}`}>
                      {task.completed ? <i className="fas fa-check text-xs text-black"></i> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold tracking-tight ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-indigo-400 font-bold"><i className="far fa-clock mr-1.5"></i>{task.time}</span>
                        <span className="text-white/10">|</span>
                        <span className="text-xs text-white/40">{task.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    {!task.completed && (
                      <button 
                        onClick={(e) => startPomodoro(e, task.id)}
                        className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${activePomodoro?.taskId === task.id ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'}`}
                      >
                        {activePomodoro?.taskId === task.id ? `专注中 ${formatTime(activePomodoro.timeLeft)}` : '番茄钟'}
                      </button>
                    )}
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase border ${
                      task.priority === '高' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      task.priority === '中' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-10">
              <div className="glass p-10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/50"></div>
                <i className="fas fa-quote-left text-white/10 text-6xl mb-6 block"></i>
                <p className="text-2xl font-black italic text-white/90 leading-snug">
                  "{day.motivation}"
                </p>
                <p className="mt-8 text-[11px] font-bold text-indigo-400 uppercase tracking-[0.4em]">Gemini 每日动力</p>
              </div>

              <div className="glass p-10 rounded-[3rem]">
                 <h5 className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] mb-8">进度仪表盘</h5>
                 <div className="space-y-8">
                    <div className="flex items-end justify-between">
                       <p className="text-4xl font-black">{day.tasks.filter(t => t.completed).length}<span className="text-lg text-white/20 ml-1">/ {day.tasks.length}</span></p>
                       <p className="text-xs font-bold text-[#1DB954]">已攻克任务</p>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-[2px] border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.3)]" 
                        style={{ width: `${(day.tasks.filter(t => t.completed).length / day.tasks.length) * 100}%` }} 
                      />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanDisplay;
