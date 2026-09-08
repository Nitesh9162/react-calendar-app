import React from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { Plus, CheckCircle2, Clock, Calendar as CalendarIcon, Tag, Flag, PartyPopper } from 'lucide-react';
import EventCard from './EventCard';

export default function DayView({
  activeDate,
  events,
  onSelectEvent,
  onToggleStatus,
  onDeleteEvent,
  onOpenModalWithDate
}) {
  const dateStr = format(activeDate, 'yyyy-MM-dd');
  
  // Filter events for this day
  const dayEvents = events.filter(e => {
    if (!e.startDate) return false;
    return e.startDate.startsWith(dateStr);
  });

  const tasks = dayEvents.filter(e => e.type === 'task');
  const reminders = dayEvents.filter(e => e.type === 'reminder');
  const holidays = dayEvents.filter(e => e.type === 'holiday');

  // Hourly timeline slots 07:00 to 22:00
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  const getEventsForHour = (hour) => {
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    return dayEvents.filter(e => {
      const eventHour = e.startDate ? e.startDate.substring(11, 13) : '';
      return eventHour === hourStr;
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left 2 Cols: Timeline View */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  isToday(activeDate)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {format(activeDate, 'd')}
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  {format(activeDate, 'EEEE')} Timeline
                </h3>
                <p className="text-xs text-slate-400">
                  {format(activeDate, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenModalWithDate(activeDate)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          {/* Holiday Banner if present for this day */}
          {holidays.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold">
                <PartyPopper className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Holiday Observance: {holidays.map(h => h.name).join(', ')}
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/40">
                {holidays[0].category || 'Public Holiday'}
              </span>
            </div>
          )}

          {/* Timeline Slots */}
          <div className="flex-1 overflow-y-auto max-h-[70vh] divide-y divide-slate-800/60">
            {hours.map((hour) => {
              const hourLabel = `${hour < 10 ? '0' + hour : hour}:00`;
              const hourEvents = getEventsForHour(hour);

              const slotDate = new Date(activeDate);
              slotDate.setHours(hour, 0, 0, 0);

              return (
                <div
                  key={hour}
                  onClick={() => onOpenModalWithDate(slotDate)}
                  className="flex items-start min-h-[70px] hover:bg-slate-800/30 transition-colors cursor-pointer group"
                >
                  <div className="w-20 py-3 px-4 text-xs font-mono text-slate-500 border-r border-slate-800 bg-slate-950/30 shrink-0">
                    {hourLabel}
                  </div>
                  
                  <div className="flex-1 p-2 space-y-2">
                    {hourEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                      >
                        <EventCard
                          event={ev}
                          onClick={onSelectEvent}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDeleteEvent}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Day Summary & Event Lists */}
        <div className="space-y-6">
          
          {/* Holidays Card List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-amber-400" />
                Holidays ({holidays.length})
              </h3>
              <button
                onClick={() => onOpenModalWithDate(activeDate)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                + Add Holiday
              </button>
            </div>

            {holidays.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No official holidays on this day.
              </p>
            ) : (
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <EventCard
                    key={holiday.id}
                    event={holiday}
                    onClick={onSelectEvent}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tasks Card List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Tasks ({tasks.length})
              </h3>
              <button
                onClick={() => onOpenModalWithDate(activeDate)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                + Add Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No tasks scheduled for this day.
              </p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <EventCard
                    key={task.id}
                    event={task}
                    onClick={onSelectEvent}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reminders Card List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Reminders ({reminders.length})
              </h3>
              <button
                onClick={() => onOpenModalWithDate(activeDate)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                + Add Reminder
              </button>
            </div>

            {reminders.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No reminders scheduled for this day.
              </p>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <EventCard
                    key={reminder.id}
                    event={reminder}
                    onClick={onSelectEvent}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
