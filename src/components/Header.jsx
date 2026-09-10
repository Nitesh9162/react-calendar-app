import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  RotateCcw,
  LogOut,
  User
} from 'lucide-react';
import { format } from 'date-fns';

export default function Header({
  activeDate,
  setActiveDate,
  viewMode,
  setViewMode,
  onOpenModal,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterPriority,
  setFilterPriority,
  onResetFilters,
  user,
  onLogout
}) {
  const navigateDate = (direction) => {
    const newDate = new Date(activeDate);
    if (viewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() + direction);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setActiveDate(newDate);
  };

  const getHeaderTitle = () => {
    if (viewMode === 'year') {
      return format(activeDate, 'yyyy');
    }
    if (viewMode === 'day') {
      return format(activeDate, 'EEEE, MMMM d, yyyy');
    }
    return format(activeDate, 'MMMM yyyy');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title & Today Button */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                {getHeaderTitle()}
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Interactive React Calendar & Task Manager
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveDate(new Date());
              setViewMode('day');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 hover:border-indigo-500/70 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            title={`Show Today's Date, Year, Tasks & Reminders (${format(new Date(), 'MMMM d, yyyy')})`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Today</span>
            <span className="text-[10px] text-indigo-300/80 font-normal border-l border-indigo-800/80 pl-1.5">
              {format(new Date(), 'MMM d, yyyy')}
            </span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, reminders & holidays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-800/80 border border-slate-700/70 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-800/80 border border-slate-700/70 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="task">Tasks</option>
            <option value="reminder">Reminders</option>
            <option value="holiday">Holidays</option>
          </select>

          {/* Priority Filter 
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-800/80 border border-slate-700/70 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          */}

          {(searchQuery || filterType !== 'all' || filterPriority !== 'all') && (
            <button
              onClick={onResetFilters}
              title="Reset Filters"
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher & Navigation & Add Button */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Navigation Prev/Next */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/70 rounded-lg p-0.5">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Modes */}
          <div className="flex bg-slate-800/80 border border-slate-700/70 rounded-lg p-1 text-xs font-medium">
            {['year', 'month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => onOpenModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Event</span>
          </button>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
