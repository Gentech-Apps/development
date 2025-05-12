import React from 'react';
import { useCalendarScroll } from '../../../hooks/useCalendarScroll';
import CalendarHeader from './Header/CalendarHeader';
import Schedule from './Schedule/Schedule';

const Calendar = (props) => {
  const { parentElement, daysWithProcesses, setHasMoreItems, onDragEnd } = props;
  useCalendarScroll(parentElement, setHasMoreItems);

  return (
    <React.Fragment>
      <CalendarHeader daysWithProcesses={daysWithProcesses} />
      <Schedule daysWithProcesses={daysWithProcesses} onDragEnd={onDragEnd} />
    </React.Fragment>
  );
};

export default Calendar;
