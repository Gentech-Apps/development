import React from 'react';
import moment from 'moment';
import { useStyles } from '../styles';
import { BACK_TO_TODAY } from '../../../constants/translations/daily-page';

const DateSection = (props) => {
  const { date, setDate } = props;
  const classes = useStyles();

  const backToTodayHandler = () => {
    setDate(new Date());
  };

  const increaseDateHandler = () => {
    const increasedDate = moment(date).add(1, 'day').toISOString();
    setDate(increasedDate);
  };

  const decreaseDateHandler = () => {
    const increasedDate = moment(date).add(-1, 'day').toISOString();
    setDate(increasedDate);
  };

  return (
    <div className={classes.datePickerBox}>
      <div className={classes.backToTodayBtn} onClick={backToTodayHandler}>
        {BACK_TO_TODAY}
      </div>
      <div className={classes.selectDate}>
        <div className={classes.rightArrow} onClick={increaseDateHandler} />
        <span className={classes.date}>{moment(date).format('DD MMMM YYYY')}</span>
        <div className={classes.leftArrow} onClick={decreaseDateHandler} />
      </div>
    </div>
  );
};

export default DateSection;
