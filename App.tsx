
import React, { useState, useEffect, useCallback } from 'react';
import { UserStats, Exercise, Category, ChatMessage } from './types';
import { EXERCISES, CATEGORY_LABELS } from './constants';
import { StatsChart } from './components/StatsChart';
import { WorkoutTimer } from './components/WorkoutTimer';
import { getFitnessAdvice } from './geminiService';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Activity, 
  ChevronLeft, 
  Sparkles, 
  Send, 
  Dumbbell,
  Play
} from 'lucide-react';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('fitness_stats');
    return saved ? JSON.parse(saved) : {
      streak: 7,
      totalWorkouts: 24,
      totalMinutes: 87,
      history: [
        { date: 'السبت', value: 10 },
        { date: 'الأحد', value: 25 },
        { date: 'الاثنين', value: 15 },
        { date: 'الثلاثاء', value: 30 },
        { date: 'الأربعاء', value: 12 },
        { date: 'الخميس', value: 20 },
        { date: 'الجمعة', value: 35 },
      ]
    };
  });

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitness_stats', JSON.stringify(stats));
  }, [stats]);

  const handleExerciseComplete = (minutes: number) => {
    setStats((prev) => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      totalMinutes: Math.round(prev.totalMinutes + minutes),
      history: [...prev.history.slice(1), { 
        date: 'اليوم', 
        value: (prev.history[prev.history.length - 1]?.value || 0) + minutes 
      }]
    }));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMessage };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    const response = await getFitnessAdvice(inputMessage, chatMessages.map(m => ({ role: m.role, text: m.text })));
    setChatMessages((prev) => [...prev, { role: 'model', text: response || '' }]);
    setIsChatLoading(false);
  };

  const filteredExercises = activeCategory === 'all' 
    ? EXERCISES 
    : EXERCISES.filter(ex => ex.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-900 glass-effect sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Dumbbell className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">دقائق لياقة</h1>
        </div>
        <div className="flex items-center gap-4 text-orange-500">
           <Activity className="w-6 h-6 animate-pulse" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-4">
          <div className="glass-effect p-4 rounded-3xl flex flex-col items-center justify-center space-y-1">
            <span className="text-orange-500"><Flame className="w-5 h-5 md:w-6 md:h-6" /></span>
            <span className="text-xl md:text-3xl font-black">{stats.streak}</span>
            <span className="text-xs md:text-sm text-slate-400">أيام</span>
          </div>
          <div className="glass-effect p-4 rounded-3xl flex flex-col items-center justify-center space-y-1">
            <span className="text-blue-400"><Trophy className="w-5 h-5 md:w-6 md:h-6" /></span>
            <span className="text-xl md:text-3xl font-black">{stats.totalWorkouts}</span>
            <span className="text-xs md:text-sm text-slate-400">تمرين</span>
          </div>
          <div className="glass-effect p-4 rounded-3xl flex flex-col items-center justify-center space-y-1">
            <span className="text-green-400"><Clock className="w-5 h-5 md:w-6 md:h-6" /></span>
            <span className="text-xl md:text-3xl font-black">{stats.totalMinutes}</span>
            <span className="text-xs md:text-sm text-slate-400">دقيقة</span>
          </div>
        </section>

        {/* Analytics Chart */}
        <section className="glass-effect p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 text-orange-500" />
              التقدم الأسبوعي
            </h2>
          </div>
          <StatsChart data={stats.history} />
        </section>

        {/* Daily Routine Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 p-8 rounded-3xl shadow-2xl shadow-orange-500/20">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-black text-white">ابدأ تمرينك اليومي الآن!</h2>
            <p className="text-orange-100 max-w-xs">خطة مخصصة لك مدتها 15 دقيقة لتحقيق أهدافك.</p>
            <button 
              onClick={() => setActiveExercise(EXERCISES[0])}
              className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-50 transition-colors"
            >
              <Play className="fill-current w-4 h-4" />
              انطلاق
            </button>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </section>

        {/* AI Assistant Section */}
        <section className="glass-effect rounded-3xl overflow-hidden border border-white/5">
          <div className="bg-white/5 p-4 flex items-center gap-2 border-b border-white/5">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold">مدربك الذكي (AI)</h2>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {chatMessages.length === 0 && (
              <p className="text-center text-slate-500 text-sm mt-10">
                اسأل المدرب عن نصيحة غذائية أو برنامج تدريبي مخصص.
              </p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-orange-500/20 text-orange-100 border border-orange-500/30' 
                    : 'bg-slate-800 text-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && <div className="text-xs text-orange-500 animate-pulse text-center">المدرب يفكر...</div>}
          </div>
          <div className="p-4 flex gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="كيف يمكنني حرق دهون البطن؟"
              className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button 
              onClick={sendMessage}
              disabled={isChatLoading}
              className="bg-orange-500 p-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Exercise Library */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">مكتبة التمارين</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-2xl whitespace-nowrap text-sm font-semibold transition-all ${
                  activeCategory === cat 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'glass-effect text-slate-400'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex) => (
              <div 
                key={ex.id}
                onClick={() => setActiveExercise(ex)}
                className="glass-effect p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                  {ex.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{ex.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ex.duration ? `${ex.duration}ث` : `${ex.reps}ت`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border border-current text-[10px] ${
                      ex.intensity === 'easy' ? 'text-green-500' : 
                      ex.intensity === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {ex.intensity === 'easy' ? 'سهل' : ex.intensity === 'medium' ? 'متوسط' : 'صعب'}
                    </span>
                  </div>
                </div>
                <ChevronLeft className="text-slate-600" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Active Workout Screen */}
      {activeExercise && (
        <WorkoutTimer 
          exercise={activeExercise} 
          onClose={() => setActiveExercise(null)} 
          onComplete={handleExerciseComplete}
        />
      )}

      {/* Footer Branding */}
      <footer className="text-center py-8 text-slate-600 text-sm">
        <p>© 2025 دقائق لياقة. جميع الحقوق محفوظة.</p>
        <p className="mt-1">تم تطويره باستخدام الذكاء الاصطناعي</p>
      </footer>
    </div>
  );
};

export default App;
