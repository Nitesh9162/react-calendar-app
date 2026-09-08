import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from 'date-fns';
import { Plus, CheckCircle2, Clock } from 'lucide-react';

export default function MonthView({
  activeDate,
  events,
  onSelectDate,
  onSelectEvent,
  onOpenModalWithDate
}) {
  const monthStart = startOfMonth(activeDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to get events for a date
  const getEventsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => {
      if (!e.startDate) return false;
      return e.startDate.startsWith(dateStr);
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col flex-1">
      {/* Month Container Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col flex-1">
        
        {/* Day Header Row */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60 text-center">
          {weekDays.map((day, idx) => (
            <div key={idx} className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr border-slate-800 divide-x divide-y divide-slate-800/80 bg-slate-950/20">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, activeDate);
            const isDayToday = isToday(day);
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={day.toString()}
                onClick={() => onOpenModalWithDate(day)}
                className={`group min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition-all flex flex-col justify-between cursor-pointer hover:bg-slate-800/40 relative ${
                  !isCurrentMonth ? 'bg-slate-950/50 opacity-40' : ''
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-7 h-7 text-xs font-bold rounded-full flex items-center justify-center transition-all ${
                      isDayToday
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Add Event quick button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModalWithDate(day);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-700/80 rounded-md transition-all"
                    title="Add Event"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Events List */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] sm:max-h-[100px] scrollbar-none">
                  {dayEvents.map((ev) => {
                    const isTask = ev.type === 'task';
                    const isHoliday = ev.type === 'holiday';
                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                        className={`px-2 py-1 rounded-md text-xs font-medium border truncate transition-all flex items-center justify-between gap-1 shadow-sm ${
                          isHoliday
                            ? 'bg-amber-950/80 text-amber-200 border-amber-800/60 hover:bg-amber-900/90'
                            : isTask
                            ? ev.status === 'Completed'
                              ? 'bg-indigo-950/40 text-slate-400 border-indigo-900/40 line-through'
                              : 'bg-indigo-950/80 text-indigo-200 border-indigo-800/60 hover:bg-indigo-900/90'
                            : ev.status === 'Completed'
                              ? 'bg-purple-950/40 text-slate-400 border-purple-900/40 line-through'
                              : 'bg-purple-950/80 text-purple-200 border-purple-800/60 hover:bg-purple-900/90'
                        }`}
                      >
                        <span className="truncate">{ev.name}</span>
                        <span className="shrink-0 text-[10px] opacity-75 font-mono">
                          {ev.startDate ? format(parseISO(ev.startDate), 'HH:mm') : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
