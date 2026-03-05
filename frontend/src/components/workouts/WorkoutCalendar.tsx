import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Zap
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

interface WorkoutCalendarProps {
  exercises: any[];
  onExerciseToggle: (id: number) => void;
  onExerciseClick: (exercise: any) => void;
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ exercises, onExerciseToggle, onExerciseClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const exercisesByDate = (date: Date) => {
    return exercises.filter(ex => isSameDay(new Date(ex.scheduled_date), date));
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-400/10 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Monthly Training Schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 border-b border-white/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 border-r border-white/5 last:border-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {daysInMonth.map((day, idx) => {
          const dayExercises = exercisesByDate(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`p-2 border-r border-b border-white/5 last:border-r-0 relative group transition-colors ${
                isCurrentDay ? 'bg-cyan-400/5' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-black ${
                  isCurrentDay ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayExercises.length > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                {dayExercises.map(ex => {
                  const isFuture = new Date(ex.scheduled_date) > new Date();
                  return (
                    <div
                      key={ex.id}
                      className={`group/item w-full flex items-center gap-1 p-1 rounded text-[9px] font-bold transition-all ${
                        ex.is_completed
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isFuture) onExerciseToggle(ex.id);
                        }}
                        disabled={isFuture}
                        className={`flex-shrink-0 transition-transform ${isFuture ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                        title={isFuture ? "Cannot complete future tasks" : ""}
                      >
                        {ex.is_completed ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Circle className="w-2.5 h-2.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onExerciseClick(ex)}
                        className="flex-1 truncate text-left hover:text-cyan-400"
                      >
                        {ex.name}
                      </button>
                    </div>
                  );
                })}
              </div>

              {isCurrentDay && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutCalendar;
