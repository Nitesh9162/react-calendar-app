import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Trash2, Edit2, Tag, PartyPopper } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EventCard({ event, onClick, onToggleStatus, onDelete }) {
  const isTask = event.type === 'task';
  const isHoliday = event.type === 'holiday';

  const formatTimeRange = () => {
    try {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate || event.startDate);
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    } catch (e) {
      return '';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Observed':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
      case 'In Progress':
        return 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60';
      case 'Upcoming':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/60';
      case 'To Do':
      case 'Pending':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(event)}
      className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
        isHoliday
          ? 'bg-amber-950/20 border-amber-800/50 hover:border-amber-500/60 hover:bg-slate-800/90'
          : isTask
          ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/90'
          : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/90'
      } ${event.status === 'Completed' || event.status === 'Observed' ? 'opacity-90' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        
        {/* Title & Type Icon */}
        <div className="flex items-start gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus && onToggleStatus(event);
            }}
            className="mt-0.5 shrink-0 text-slate-500 hover:text-amber-400 transition-colors"
          >
            {isHoliday ? (
              <PartyPopper className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : isTask ? (
              <CheckCircle2
                className={`w-4 h-4 ${
                  event.status === 'Completed' ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
                }`}
              />
            ) : (
              <Clock
                className={`w-4 h-4 ${
                  event.status === 'Completed' ? 'text-emerald-400' : 'text-purple-400'
                }`}
              />
            )}
          </button>

          <div className="min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                event.status === 'Completed'
                  ? 'line-through text-slate-400'
                  : isHoliday
                  ? 'text-amber-100 group-hover:text-amber-200'
                  : 'text-slate-100 group-hover:text-indigo-200'
              }`}
            >
              {event.name}
            </h4>

            {event.description && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 font-normal">
                {event.description}
              </p>
            )}

            {/* Time & Recurrence Info */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatTimeRange()}
              </span>

              {isHoliday && event.category && (
                <span className="flex items-center gap-1 bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40 text-[10px] font-medium">
                  <Tag className="w-3 h-3" />
                  {event.category}
                </span>
              )}

              {!isTask && !isHoliday && event.title && (
                <span className="flex items-center gap-1 capitalize bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40">
                  <Tag className="w-3 h-3" />
                  {event.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1">
            {/* Type badge */}
            <span
              className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                isHoliday
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : isTask
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                  : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
              }`}
            >
              {isHoliday ? 'Holiday' : isTask ? 'Task' : 'Reminder'}
            </span>
          </div>

          {/* Task Priority */}
          {isTask && event.priority && (
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getPriorityBadge(
                event.priority
              )}`}
            >
              {event.priority}
            </span>
          )}

          {/* Status badge */}
          <span
            className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusBadge(
              event.status
            )}`}
          >
            {event.status || (isHoliday ? 'Public Holiday' : 'Pending')}
          </span>
        </div>

      </div>
    </div>
  );
}
