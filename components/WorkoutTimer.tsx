
import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { Play, Pause, X, CheckCircle } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onClose: () => void;
  onComplete: (minutes: number) => void;
}

export const WorkoutTimer: React.FC<Props> = ({ exercise, onClose, onComplete }) => {
  const isTimed = !!exercise.duration;
  const initialTime = exercise.duration || 0;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);
  const [completed, setCompleted] = useState(false);
  // Using any to avoid 'NodeJS.Timeout' namespace issues in diverse TypeScript environments
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimed && isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimed) {
      handleFinish();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isTimed]);

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCompleted(true);
    const timeSpent = isTimed ? initialTime / 60 : 1; // estimate 1 min for rep exercises
    onComplete(timeSpent);
  };

  const toggleTimer = () => setIsActive(!isActive);

  // Circular progress calculation
  const percentage = isTimed ? (timeLeft / initialTime) * 100 : 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white animate-in fade-in duration-300">
      <div className="p-4 flex justify-between items-center border-b border-slate-800">
        <h2 className="text-xl font-bold">{exercise.name}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Visual Cue */}
        <div className="text-9xl mb-4 animate-bounce">
          {exercise.emoji}
        </div>

        {/* Timer/Rep Info */}
        <div className="relative flex items-center justify-center">
          {isTimed ? (
            <>
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <span className="absolute text-5xl font-black text-orange-500">{timeLeft}</span>
            </>
          ) : (
            <div className="text-center">
              <span className="text-6xl font-black text-orange-500">{exercise.reps}</span>
              <p className="text-xl text-slate-400 mt-2">تكرار</p>
            </div>
          )}
        </div>

        <div className="text-center max-w-sm">
          <p className="text-lg text-slate-300 leading-relaxed">{exercise.description}</p>
        </div>
      </div>

      <div className="p-8 space-y-4">
        {!completed ? (
          <div className="flex gap-4">
            {isTimed && (
              <button 
                onClick={toggleTimer}
                className="flex-1 py-4 glass-effect rounded-2xl flex items-center justify-center gap-2 text-xl font-bold hover:bg-white/10 transition-colors"
              >
                {isActive ? <Pause /> : <Play />}
                {isActive ? 'إيقاف مؤقت' : 'استئناف'}
              </button>
            )}
            <button 
              onClick={handleFinish}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center gap-2 text-xl font-bold shadow-lg shadow-orange-500/20"
            >
              <CheckCircle />
              إكمال
            </button>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
            <p className="text-2xl font-bold text-orange-500 mb-4">عمل رائع! تم الإنجاز 🔥</p>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-xl font-bold"
            >
              العودة للرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
