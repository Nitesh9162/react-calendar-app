import { format, isSameDay, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import INDIAN_HOLIDAYS from '../data/holidays';

export const getHolidaysForDate = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return INDIAN_HOLIDAYS.filter(h => h.startDate.startsWith(dateStr));
};

export const getHolidaysForMonth = (year, month) => {
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  return INDIAN_HOLIDAYS.filter(h => h.startDate.startsWith(prefix));
};

export const isHoliday = (date) => {
  return getHolidaysForDate(date).length > 0;
};

export const getNextHoliday = (fromDate = new Date()) => {
  const today = startOfDay(fromDate);
  const upcoming = INDIAN_HOLIDAYS
    .filter(h => {
      const holidayDate = startOfDay(parseISO(h.startDate));
      return isAfter(holidayDate, today) || isSameDay(holidayDate, today);
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  return upcoming.length > 0 ? upcoming[0] : null;
};

export const getAllHolidays = () => {
  return [...INDIAN_HOLIDAYS];
};

export const getHolidaysByCategory = (category) => {
  return INDIAN_HOLIDAYS.filter(h => h.category === category);
};
