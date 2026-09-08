import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import YearView from './components/YearView';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import { getInitialEvents, saveEventsToStorage } from './utils/storage';
import { format } from 'date-fns';

export default function App() {
  const [events, setEvents] = useState([]);
  const [activeDate, setActiveDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // year, month, week, day

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, task, reminder
  const [filterPriority, setFilterPriority] = useState('all'); // all, High, Medium, Low

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Initialize events from local storage
  useEffect(() => {
    const loadedEvents = getInitialEvents();
    setEvents(loadedEvents);
  }, []);

  // Save events whenever updated
  const updateEvents = (newEvents) => {
    setEvents(newEvents);
    saveEventsToStorage(newEvents);
  };

  // Filtered events selector
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = e.name && e.name.toLowerCase().includes(query);
        const matchDesc = e.description && e.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Filter by Type
      if (filterType !== 'all') {
        if (e.type !== filterType) return false;
      }

      // Filter by Priority (only applicable to tasks)
      if (filterPriority !== 'all') {
        if (e.type === 'task' && e.priority !== filterPriority) return false;
      }

      return true;
    });
  }, [events, searchQuery, filterType, filterPriority]);

  // Modal handlers
  const handleOpenModal = (date = null, eventToEdit = null) => {
    setModalDate(date || activeDate);
    setEditingEvent(eventToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setModalDate(null);
  };

  // Save Event (Create or Update)
  const handleSaveEvent = (eventData) => {
    const existingIndex = events.findIndex(e => e.id === eventData.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...events];
      updated[existingIndex] = eventData;
    } else {
      updated = [eventData, ...events];
    }
    updateEvents(updated);
  };

  // Delete Event
  const handleDeleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    updateEvents(updated);
  };

  // Toggle Status (e.g. Completed vs Pending / To Do / Observed)
  const handleToggleStatus = (event) => {
    const updated = events.map(e => {
      if (e.id === event.id) {
        let newStatus;
        if (e.type === 'task') {
          newStatus = e.status === 'Completed' ? 'To Do' : 'Completed';
        } else if (e.type === 'holiday') {
          newStatus = e.status === 'Observed' ? 'Upcoming' : 'Observed';
        } else {
          newStatus = e.status === 'Completed' ? 'Pending' : 'Completed';
        }
        return { ...e, status: newStatus };
      }
      return e;
    });
    updateEvents(updated);
  };

  // Click on date (e.g., from Year or Month view)
  const handleSelectDate = (date) => {
    setActiveDate(date);
    setViewMode('day');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterPriority('all');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Controls */}
      <Header
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenModal={(date) => handleOpenModal(date, null)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        onResetFilters={handleResetFilters}
      />

      {/* Main View Renderer */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'year' && (
          <YearView
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            setViewMode={setViewMode}
            events={filteredEvents}
            onSelectDate={handleSelectDate}
            searchQuery={searchQuery}
          />
        )}

        {viewMode === 'month' && (
          <MonthView
            activeDate={activeDate}
            events={filteredEvents}
            onSelectDate={handleSelectDate}
            onSelectEvent={(ev) => handleOpenModal(null, ev)}
            onOpenModalWithDate={(date) => handleOpenModal(date, null)}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            activeDate={activeDate}
            events={filteredEvents}
            onSelectEvent={(ev) => handleOpenModal(null, ev)}
            onOpenModalWithDate={(date) => handleOpenModal(date, null)}
          />
        )}

        {viewMode === 'day' && (
          <DayView
            activeDate={activeDate}
            events={filteredEvents}
            onSelectEvent={(ev) => handleOpenModal(null, ev)}
            onToggleStatus={handleToggleStatus}
            onDeleteEvent={handleDeleteEvent}
            onOpenModalWithDate={(date) => handleOpenModal(date, null)}
          />
        )}
      </main>

      {/* Task & Reminder Modal Form */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={modalDate}
        editingEvent={editingEvent}
      />

      {/* Footer / Status Bar */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          React Calendar App &bull; LocalStorage Synced
        </p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Holidays: {events.filter(e => e.type === 'holiday').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Tasks: {events.filter(e => e.type === 'task').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Reminders: {events.filter(e => e.type === 'reminder').length}
          </span>
        </div>
      </footer>

    </div>
  );
}
