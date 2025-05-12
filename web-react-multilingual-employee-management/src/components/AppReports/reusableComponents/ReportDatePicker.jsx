import React from 'react';
import moment from 'moment';
import Arrow from '../../../images/general/white-arrow.svg';
import { MONTH_REPORT } from '../../../constants';

const ReportDatePicker = (props) => {
  const { reportType, increaseStartDateHandler, decreaseStartDateHandler, startDate } = props;
  return (
    <div className="daily-view-page__calender__header__right--dates_dark">
      <figure onClick={decreaseStartDateHandler}>
        <img src={Arrow} alt="arrow" />
      </figure>
      {reportType === MONTH_REPORT ? (
        <React.Fragment>
          <p>{moment(startDate).format('DD/MM/YYYY')}</p> -
          <p>{moment(startDate).endOf(reportType).format('DD/MM/YYYY')}</p>
        </React.Fragment>
      ) : (
        <p>{moment(startDate).endOf(reportType).format('YYYY')}</p>
      )}
      <figure onClick={increaseStartDateHandler}>
        <img src={Arrow} alt="arrow" />
      </figure>
    </div>
  );
};

export default ReportDatePicker;
