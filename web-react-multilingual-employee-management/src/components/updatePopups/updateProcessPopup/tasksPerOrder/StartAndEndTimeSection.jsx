import React, { useEffect, useState, useRef } from 'react';
import { useStyles } from './styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import CustomizedTimePicker from '../../../reused-components/CustomizedTimePicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { SERVICE } from '../../../../constants';
const HOURS = 'hours';
const MINUTES = 'minutes';

const convertDurationToHoursAndMinutes = (duration) => {
  if (duration) {
    const templateTime = moment.duration(+duration);
    const hours = templateTime.asHours();
    const minutes = templateTime.minutes();
    return { hours: parseInt(hours), minutes };
  }
  return { hours: 0, minutes: 0 };
};

const createDurationFromMinutesAndHours = (minutesAndHours) => {
  const MILISECONDS_PER_HOUR = 3600000;
  const MILISECONDS_PER_MINUTE = 60000;
  const { minutes, hours } = minutesAndHours;
  const hoursInMs = hours * MILISECONDS_PER_HOUR;
  const minutesInMs = minutes * MILISECONDS_PER_MINUTE;
  const duration = (hoursInMs + minutesInMs).toString();
  return duration;
};

const StartAndEndTimeSection = (props) => {
  const type_of_factory = useSelector((state) => state.login.user.type_of_factory);
  const classes = useStyles({ service: type_of_factory === SERVICE });
  const {
    processStartTime,
    duration,
    updateProcessPopupStateHandler,
    resourcesQuntity,
    selectedProcess,
  } = props;
  const durationHoursMinutes = useRef(convertDurationToHoursAndMinutes(duration));
  const [endTime, setEndTime] = useState('');

  const calculateEndTime = (start, time) => {
    // create new date with hours and minutes from start time ("11:36") , adds process duration and calculate end hours and minutes
    if (start && time) {
      const [hours, minutes] = start.split(':');
      const startHours = parseInt(hours) || 0;
      const startMinutes = parseInt(minutes) || 0;

      const endTime = moment()
        .set({ hour: startHours, minute: startMinutes })
        .add(+time, 'milliseconds')
        .format('HH:mm');
      return endTime;
    }
  };

  useEffect(() => {
    const allResourcesDuration = selectedProcess?.proccess?.initial_duration;
    const calculateProcessDurationOnResourcesQuantityChange = () => {
      const actualDuration = (allResourcesDuration / resourcesQuntity).toString();
      durationHoursMinutes.current = convertDurationToHoursAndMinutes(actualDuration);
      updateProcessPopupStateHandler({ actualDuration });
    };
    allResourcesDuration && resourcesQuntity && calculateProcessDurationOnResourcesQuantityChange();
  }, [resourcesQuntity, duration]);

  useEffect(() => {
    const time = calculateEndTime(processStartTime, duration);
    setEndTime(time);
  }, [duration, processStartTime]);

  const updateDuration = (name) => (value) => {
    durationHoursMinutes.current[name] = value;
    const durationObj = durationHoursMinutes.current;
    const actualDuration = createDurationFromMinutesAndHours(durationObj);
    updateProcessPopupStateHandler({ actualDuration });
  };

  return (
    <Box className={classes.timeSectionWrapper}>
      <CustomizedTimePicker
        value={processStartTime}
        name={'startTime'}
        changeHandler={updateProcessPopupStateHandler}
        clickHandler={() => {}}
      />
      <CustomizedInputNumber
        value={durationHoursMinutes.current.minutes}
        updateHandler={updateDuration(MINUTES)}
      />
      :
      <CustomizedInputNumber
        value={durationHoursMinutes.current.hours}
        updateHandler={updateDuration(HOURS)}
      />
      <CustomizedTimePicker
        value={endTime}
        clickHandler={(e) => {
          e.preventDefault();
        }}
        changeHandler={() => ({})}
      />
    </Box>
  );
};

const CustomizedInputNumber = ({ value = '', updateHandler }) => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.inputTypeNumber}
      type="number"
      // defaultValue={value}
      value={value}
      size="small"
      style={{ width: '10%' }}
      onChange={(e) => updateHandler(e.target.value)}
    />
  );
};

export default StartAndEndTimeSection;
