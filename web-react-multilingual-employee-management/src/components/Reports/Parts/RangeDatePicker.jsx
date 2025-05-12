import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import './range-picker.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'moment/locale/he';
import moment from 'moment';

class RangeDatePicker extends Component {
  constructor(props) {
    super();
    this.state = {
      timestamp: {
        from: moment().startOf('day').subtract(23, 'days'),
        to: moment().endOf('day'),
      },
    };
  }

  handleApply = (event, picker, ranges) => {
    let timestamp = '';
    if (ranges) {
      timestamp = {
        from: picker.from,
        to: picker.to,
      };
    } else {
      timestamp = {
        from: picker.startDate,
        to: picker.endDate,
      };
    }

    this.setState({
      timestamp,
    });
    this.props.sendTimeToMother(timestamp);
  };

  HandleOnShow = () => {};

  handleEvent = (value) => {};

  HandleOnHide = () => {};

  render() {
    const { timestamp } = this.state;
    const locale = {
      format: 'L',
      separator: ' - ',
      applyLabel: 'שמור',
      cancelLabel: 'ביטול',

      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
      monthNames: [
        'ינואר',
        'פברואר',
        'מרץ',
        'אפריל',
        'מאי',
        'יוני',
        'יולי',
        'אוגוסט',
        'ספטמבר',
        'אוקטובר',
        'נובמבר',
        'דצמבר',
      ],
      firstDay: 0,
    };

    const { selected, value } = this.props;
    return (
      <div className="range__datepicker">
        {selected ? (
          <div className="datepicker__btn">
            <h3>{moment(timestamp.from).format('DD/MM/YY')}</h3>
            <h3>-</h3>
            <h3>{moment(timestamp.to).format('DD/MM/YY')}</h3>
          </div>
        ) : (
          <div className="datepicker__btn"></div>
        )}

        <DateRangePicker
          locale={locale}
          onShow={this.HandleOnShow}
          onHide={this.HandleOnHide}
          onEvent={this.handleEvent}
          autoApply={false}
          onApply={this.handleApply}
          ends={false}
          startDate={value.from}
          endDate={value.to}
          className="react-bootstrap-daterangepicker-container"
        >
          <button className="open__datepicker__btn"></button>
        </DateRangePicker>
      </div>
    );
  }
}

export default RangeDatePicker;
