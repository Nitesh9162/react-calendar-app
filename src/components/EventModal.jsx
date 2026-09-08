import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Calendar, AlertCircle, Trash2, Tag, Flag, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  editingEvent
}) {
  const [activeTab, setActiveTab] = useState('task'); // 'task', 'reminder', or 'holiday'

  // Task form states
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium'); // Medium, High, Low
  const [taskStatus, setTaskStatus] = useState('To Do'); // To Do, In Progress, Completed

  // Reminder form states
  const [reminderName, setReminderName] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [reminderStartDate, setReminderStartDate] = useState('');
  const [reminderEndDate, setReminderEndDate] = useState('');
  const [reminderTitle, setReminderTitle] = useState('daily'); // daily, weekly, monthly
  const [reminderStatus, setReminderStatus] = useState('Pending');

  // Holiday form states
  const [holidayName, setHolidayName] = useState('');
  const [holidayDescription, setHolidayDescription] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [holidayCategory, setHolidayCategory] = useState('Public Holiday'); // Public Holiday, National Holiday, Festival, Personal Holiday
  const [holidayStatus, setHolidayStatus] = useState('Observed');

  // Error messaging
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setActiveTab(editingEvent.type);
      if (editingEvent.type === 'task') {
        setTaskName(editingEvent.name || '');
        setTaskDescription(editingEvent.description || '');
        setTaskStartDate(editingEvent.startDate || '');
        setTaskEndDate(editingEvent.endDate || '');
        setTaskPriority(editingEvent.priority || 'Medium');
        setTaskStatus(editingEvent.status || 'To Do');
      } else if (editingEvent.type === 'holiday') {
        setHolidayName(editingEvent.name || '');
        setHolidayDescription(editingEvent.description || '');
        setHolidayStartDate(editingEvent.startDate || '');
        setHolidayEndDate(editingEvent.endDate || '');
        setHolidayCategory(editingEvent.category || 'Public Holiday');
        setHolidayStatus(editingEvent.status || 'Observed');
      } else {
        setReminderName(editingEvent.name || '');
        setReminderDescription(editingEvent.description || '');
        setReminderStartDate(editingEvent.startDate || '');
        setReminderEndDate(editingEvent.endDate || '');
        setReminderTitle(editingEvent.title || 'daily');
        setReminderStatus(editingEvent.status || 'Pending');
      }
    } else {
      // Default dates based on initialDate or current time
      const dateToUse = initialDate || new Date();
      const formattedStart = format(dateToUse, "yyyy-MM-dd'T'HH:mm");
      // End date 1 hour later by default
      const endDateToUse = new Date(dateToUse.getTime() + 60 * 60 * 1000);
      const formattedEnd = format(endDateToUse, "yyyy-MM-dd'T'HH:mm");

      // Reset Task fields
      setTaskName('');
      setTaskDescription('');
      setTaskStartDate(formattedStart);
      setTaskEndDate(formattedEnd);
      setTaskPriority('Medium');
      setTaskStatus('To Do');

      // Reset Reminder fields
      setReminderName('');
      setReminderDescription('');
      setReminderStartDate(formattedStart);
      setReminderEndDate(formattedEnd);
      setReminderTitle('daily');
      setReminderStatus('Pending');

      // Reset Holiday fields
      setHolidayName('');
      setHolidayDescription('');
      setHolidayStartDate(formattedStart);
      setHolidayEndDate(format(dateToUse, "yyyy-MM-dd'T'23:59"));
      setHolidayCategory('Public Holiday');
      setHolidayStatus('Observed');
    }
    setError('');
  }, [editingEvent, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'task') {
      if (!taskName.trim()) {
        setError('Task name is required.');
        return;
      }
      if (!taskStartDate) {
        setError('Start date & time is required.');
        return;
      }

      const eventData = {
        id: editingEvent ? editingEvent.id : `task-${Date.now()}`,
        type: 'task',
        name: taskName.trim(),
        description: taskDescription.trim(),
        startDate: taskStartDate,
        endDate: taskEndDate || taskStartDate,
        priority: taskPriority,
        status: taskStatus,
        createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString()
      };

      onSave(eventData);
    } else if (activeTab === 'holiday') {
      if (!holidayName.trim()) {
        setError('Holiday name is required.');
        return;
      }
      if (!holidayStartDate) {
        setError('Start date & time is required.');
        return;
      }

      const eventData = {
        id: editingEvent ? editingEvent.id : `holiday-${Date.now()}`,
        type: 'holiday',
        name: holidayName.trim(),
        description: holidayDescription.trim(),
        startDate: holidayStartDate,
        endDate: holidayEndDate || holidayStartDate,
        category: holidayCategory,
        status: holidayStatus,
        createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString()
      };

      onSave(eventData);
    } else {
      if (!reminderName.trim()) {
        setError('Reminder name is required.');
        return;
      }
      if (!reminderStartDate) {
        setError('Start date & time is required.');
        return;
      }

      const eventData = {
        id: editingEvent ? editingEvent.id : `reminder-${Date.now()}`,
        type: 'reminder',
        name: reminderName.trim(),
        description: reminderDescription.trim(),
        startDate: reminderStartDate,
        endDate: reminderEndDate || reminderStartDate,
        title: reminderTitle, // daily, weekly, monthly
        status: reminderStatus,
        createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString()
      };

      onSave(eventData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Task vs Reminder vs Holiday) */}
        {!editingEvent && (
          <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'task'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Task
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reminder')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'reminder'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Reminder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('holiday')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'holiday'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5" />
              Holiday
            </button>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <>
              {/* Task Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design System Implementation"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Task Description / Distribution */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Task Distribution
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter details, team distribution, or task requirements..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Start Date & End Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date & Time <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={taskStartDate}
                    onChange={(e) => setTaskStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={taskEndDate}
                    onChange={(e) => setTaskEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Priority & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-indigo-400" />
                    Priority
                  </label>
                  <div className="flex gap-1.5">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setTaskPriority(p)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          taskPriority === p
                            ? p === 'High'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                              : p === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* REMINDER FORM */}
          {activeTab === 'reminder' && (
            <>
              {/* Reminder Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reminder Name / Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Standup Reminder"
                  value={reminderName}
                  onChange={(e) => setReminderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Reminder Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Add notes or reminder instructions..."
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date & Time <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderStartDate}
                    onChange={(e) => setReminderStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderEndDate}
                    onChange={(e) => setReminderEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Recurrence Frequency Title (daily, weekly, monthly) */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  Recurrence Frequency
                </label>
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <button
                      type="button"
                      key={freq}
                      onClick={() => setReminderTitle(freq)}
                      className={`flex-1 py-2 text-xs font-semibold capitalize rounded-lg border transition-all ${
                        reminderTitle === freq
                          ? 'bg-purple-600/30 text-purple-200 border-purple-500 shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* HOLIDAY FORM */}
          {activeTab === 'holiday' && (
            <>
              {/* Holiday Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Holiday Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Founders & Celebration Day"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Holiday Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Details
                </label>
                <textarea
                  rows="3"
                  placeholder="Official holiday description, office status, or event details..."
                  value={holidayDescription}
                  onChange={(e) => setHolidayDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date & Time <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={holidayStartDate}
                    onChange={(e) => setHolidayStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={holidayEndDate}
                    onChange={(e) => setHolidayEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    Category
                  </label>
                  <select
                    value={holidayCategory}
                    onChange={(e) => setHolidayCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="National Holiday">National Holiday</option>
                    <option value="Festival">Festival</option>
                    <option value="Personal Holiday">Personal Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={holidayStatus}
                    onChange={(e) => setHolidayStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Observed">Observed</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Passed">Passed</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
            {editingEvent ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingEvent.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-md transition-all ${
                  activeTab === 'task'
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    : activeTab === 'holiday'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                }`}
              >
                {editingEvent ? 'Save Changes' : 'Submit'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
