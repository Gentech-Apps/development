import * as React from 'react';

export const TimeFormat = {
  datetime: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  date: {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
  },
  utc: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'UTC',
  },
};

export const Time = React.forwardRef(function Time(
  { timestamp, format: formatProp = TimeFormat.datetime, ...props },
  ref,
) {
  const date =
    typeof timestamp === 'string' || typeof timestamp === 'number'
      ? new Date(timestamp)
      : timestamp;
  const format = typeof formatProp === 'string' ? TimeFormat[formatProp] : formatProp;

  return (
    <time {...props} dateTime={date.toISOString()} ref={ref}>
      {date.toLocaleString('en', format)}
    </time>
  );
});
