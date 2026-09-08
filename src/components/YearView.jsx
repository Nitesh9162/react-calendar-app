import React from 'react';
import { 
  format, 
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';

export default function YearView({ activeDate, setActiveDate, setViewMode, events, onSelectDate, searchQuery }) {
  const currentYear = activeDate.getFullYear();
  const yearStart = startOfYear(activeDate);
  const yearEnd = endOfYear(activeDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Get events per day string key (yyyy-MM-dd)
  const getEventsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => {
      if (!e.startDate) return false;
      return e.startDate.startsWith(dateStr);
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(monthStart);
          const startDate = startOfWeek(monthStart);
          const endDate = endOfWeek(monthEnd);

          const days = eachDayOfInterval({ start: startDate, end: endDate });

          return (
            <div
              key={month.toString()}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-100 text-base">
                  {format(month, 'MMMM')}
                </h3>
                <button
                  onClick={() => {
                    setActiveDate(month);
                    setViewMode('month');
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View Month
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-500">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day) => {
                  const isCurrentMonth = isSameMonth(day, month);
                  const isDayToday = isToday(day);
                  const dayEvents = getEventsForDay(day);
                  const hasSearch = searchQuery && searchQuery.trim().length > 0;

                  return (
                    <button
                      key={day.toString()}
                      onClick={() => onSelectDate(day)}
                      className={`relative p-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center min-h-[32px] ${
                        !isCurrentMonth
                          ? 'text-slate-600 hover:text-slate-400'
                          : isDayToday
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                          : hasSearch && dayEvents.length > 0
                          ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/50'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{format(day, 'd')}</span>
                      
                      {/* Event indicators */}
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayEvents.slice(0, 3).map((ev, i) => (
                            <span
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                ev.type === 'holiday'
                                  ? 'bg-amber-400'
                                  : ev.type === 'task'
                                  ? 'bg-indigo-400'
                                  : 'bg-purple-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Search match tooltip */}
                      {hasSearch && dayEvents.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 hidden group-hover:block">
                          <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-slate-200 whitespace-nowrap shadow-lg">
                            {dayEvents.map(ev => ev.name).join(', ')}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
