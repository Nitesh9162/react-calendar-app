import React from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  isSameDay,
  parseISO
} from 'date-fns';
import { Plus } from 'lucide-react';

export default function WeekView({
  activeDate,
  events,
  onSelectEvent,
  onOpenModalWithDate
}) {
  const weekStart = startOfWeek(activeDate);
  const weekEnd = endOfWeek(activeDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Hours array from 07:00 to 22:00
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  const getEventsForDayAndHour = (day, hour) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

    return events.filter(e => {
      if (!e.startDate) return false;
      if (!e.startDate.startsWith(dayStr)) return false;
      const eventHour = e.startDate.substring(11, 13);
      return eventHour === hourStr;
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col flex-1">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col flex-1">
        
        {/* Week Day Headers */}
        <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-950/60 text-center sticky top-0 z-10">
          <div className="py-3 text-xs font-bold text-slate-500 uppercase border-r border-slate-800">
            Time
          </div>
          {days.map((day) => {
            const isDayToday = isToday(day);
            return (
              <div
                key={day.toString()}
                className={`py-3 text-center border-r border-slate-800/60 ${
                  isDayToday ? 'bg-indigo-950/30' : ''
                }`}
              >
                <div className="text-xs font-semibold text-slate-400">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`inline-block mt-0.5 text-sm font-bold w-7 h-7 rounded-full leading-7 ${
                    isDayToday
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-200'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-y-auto max-h-[70vh]">
          {hours.map((hour) => {
            const hourLabel = `${hour < 10 ? '0' + hour : hour}:00`;

            return (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-800/60 min-h-[64px]">
                {/* Hour Label Column */}
                <div className="py-2 px-3 text-xs font-mono text-slate-500 text-right border-r border-slate-800 bg-slate-950/30">
                  {hourLabel}
                </div>

                {/* Day Columns */}
                {days.map((day) => {
                  const cellEvents = getEventsForDayAndHour(day, hour);
                  
                  // Construct date object for this cell
                  const cellDate = new Date(day);
                  cellDate.setHours(hour, 0, 0, 0);

                  return (
                    <div
                      key={day.toString() + hour}
                      onClick={() => onOpenModalWithDate(cellDate)}
                      className="group border-r border-slate-800/40 p-1 relative cursor-pointer hover:bg-slate-800/30 transition-colors flex flex-col gap-1"
                    >
                      {cellEvents.map((ev) => {
                        const isTask = ev.type === 'task';
                        const isHoliday = ev.type === 'holiday';
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(ev);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-medium border truncate transition-all shadow-sm ${
                              isHoliday
                                ? 'bg-amber-950/80 text-amber-200 border-amber-800/60 hover:bg-amber-900/90'
                                : isTask
                                ? 'bg-indigo-950/80 text-indigo-200 border-indigo-800/60 hover:bg-indigo-900/90'
                                : 'bg-purple-950/80 text-purple-200 border-purple-800/60 hover:bg-purple-900/90'
                            }`}
                          >
                            <div className="font-bold truncate">{ev.name}</div>
                            <div className="text-[10px] opacity-75 font-mono">
                              {ev.startDate ? format(parseISO(ev.startDate), 'HH:mm') : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
