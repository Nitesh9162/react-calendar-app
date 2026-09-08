import { addDays, format, setHours, setMinutes } from 'date-fns';
import INDIAN_HOLIDAYS from '../data/holidays';

const STORAGE_KEY = 'react_calendar_events_v2';

export const getInitialEvents = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const hasHolidays = parsed.some(e => e.type === 'holiday' && e.id.startsWith('holiday-ind-'));
      if (!hasHolidays) {
        const merged = mergeHolidaysIntoEvents(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse calendar events from localStorage:', e);
    }
  }

  // Generate initial seed data relative to current date
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  
  const seedEvents = [
    {
      id: 'task-1',
      type: 'task',
      name: 'Frontend Architecture Review',
      description: 'Review component state distribution and performance bottlenecks in React calendar app.',
      startDate: `${todayStr}T09:00`,
      endDate: `${todayStr}T10:30`,
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date().toISOString()
    },
    {
      id: 'reminder-1',
      type: 'reminder',
      name: 'Team Standup Sync',
      description: 'Quick daily sync to share progress and highlight blockers.',
      startDate: `${todayStr}T11:00`,
      endDate: `${todayStr}T11:30`,
      title: 'daily',
      status: 'Pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      type: 'task',
      name: 'UI UX Polish & Animations',
      description: 'Add smooth transitions, hover tooltips, and badge color accents across views.',
      startDate: `${todayStr}T14:00`,
      endDate: `${todayStr}T16:00`,
      priority: 'Medium',
      status: 'To Do',
      createdAt: new Date().toISOString()
    },
    {
      id: 'reminder-2',
      type: 'reminder',
      name: 'Weekly Backup Check',
      description: 'Verify system snapshots and localStorage persistence layer.',
      startDate: format(addDays(now, 1), 'yyyy-MM-dd') + 'T16:30',
      endDate: format(addDays(now, 1), 'yyyy-MM-dd') + 'T17:00',
      title: 'weekly',
      status: 'Pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      type: 'task',
      name: 'Monthly Roadmap Update',
      description: 'Distribute Q4 feature requirements and milestone timelines.',
      startDate: format(addDays(now, 3), 'yyyy-MM-dd') + 'T10:00',
      endDate: format(addDays(now, 3), 'yyyy-MM-dd') + 'T12:00',
      priority: 'Low',
      status: 'Completed',
      createdAt: new Date().toISOString()
    }
  ];

  const eventsWithHolidays = mergeHolidaysIntoEvents(seedEvents);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsWithHolidays));
  return eventsWithHolidays;
};

const mergeHolidaysIntoEvents = (existingEvents) => {
  const existingIds = new Set(existingEvents.map(e => e.id));
  const newHolidays = INDIAN_HOLIDAYS.filter(h => !existingIds.has(h.id));
  return [...existingEvents, ...newHolidays];
};

export const saveEventsToStorage = (events) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};
