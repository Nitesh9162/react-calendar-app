import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import YearView from './components/YearView';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getInitialEvents, saveEventsToStorage } from './utils/storage';
import { format } from 'date-fns';

function CalendarApp() {
  const { user, logout, loading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [events, setEvents] = useState([]);
  const [activeDate, setActiveDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const loadedEvents = getInitialEvents();
    setEvents(loadedEvents);
  }, []);

  const updateEvents = (newEvents) => {
    setEvents(newEvents);
    saveEventsToStorage(newEvents);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = e.name && e.name.toLowerCase().includes(query);
        const matchDesc = e.description && e.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      if (filterType !== 'all') {
        if (e.type !== filterType) return false;
      }
      if (filterPriority !== 'all') {
        if (e.type === 'task' && e.priority !== filterPriority) return false;
      }
      return true;
    });
  }, [events, searchQuery, filterType, filterPriority]);

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

  const handleDeleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    updateEvents(updated);
  };

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

  const handleSelectDate = (date) => {
    setActiveDate(date);
    setViewMode('day');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterPriority('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
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
        user={user}
        onLogout={logout}
      />

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

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={modalDate}
        editingEvent={editingEvent}
      />

      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          React Calendar App &bull; Logged in as {user.username}
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

export default function App() {
  return (
    <AuthProvider>
      <CalendarApp />
    </AuthProvider>
  );
}
