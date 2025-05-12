import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import he from 'date-fns/locale/he';
import 'moment/locale/he';

class dailyTimepicker extends Component {
  render() {
    const { currentDate, handleDateChange } = this.props;
    he.daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

    return (
      <div className="daily-view-page__timepicker">
        <DatePicker
          inline
          locale={he}
          selected={currentDate.toDate()}
          onChange={handleDateChange}
          useWeekdaysShort={true}
        />
      </div>
    );
  }
}

export default dailyTimepicker;
