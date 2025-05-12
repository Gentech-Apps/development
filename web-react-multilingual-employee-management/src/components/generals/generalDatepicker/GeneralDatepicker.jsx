import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import he from 'date-fns/locale/he';
import 'moment/locale/he';
//redux config
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
//scss
import '../../../sass/abstracts/general_app_components.scss';

class GeneralDatepicker extends Component {
  constructor() {
    super();

    this.state = {
      hasError: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    //validation
    if (this.props.required)
      if (this.props.initValidation !== nextProps.initValidation && nextProps.initValidation) {
        if (!nextProps.selectedDate) {
          this.setState({ hasError: true });
          this.props.setError(this.props.stateName);
        }
      }
    //check if date exists and cancel error if so
    if (this.props.selectedDate !== nextProps.selectedDate && nextProps.selectedDate) {
      this.setState({ hasError: false });
      this.props.clearError(this.props.stateName);
    }
  }

  excludeTimes = () => {
    let exclude_times = this.props.login.user.holidays
      .filter((d) => d.status === 'Day Off')
      .map((d) => new Date(d.date));
    return exclude_times;
  };

  isWeekday = (date) => {
    const day = moment(date).weekday();
    const inThisWeek = moment(date).isSame(new Date(), 'week');
    if (this.props.disableCurrentWeek) {
      return !this.props.login.user.off_days.includes(day) && !inThisWeek;
    } else {
      return !this.props.login.user.off_days.includes(day);
    }
  };

  handleChange = (date) => {
    if (this.props.updateFormData) this.props.updateFormData(this.props.stateName, date);
  };

  render() {
    let excludedDates = this.excludeTimes();
    const { selectedDate, errorMessage, disabled } = this.props;
    const { hasError } = this.state;
    return (
      <div className="general-datepicker" style={hasError ? { border: '1px solid #ff0000' } : {}}>
        {selectedDate ? (
          <p className="general-datepicker__date">{moment(selectedDate).format('DD/MM/YYYY')}</p>
        ) : null}
        <DatePicker
          selected={selectedDate ? new Date(selectedDate) : moment().toDate()}
          onChange={this.handleChange}
          locale={he}
          minDate={moment().toDate()}
          showYearDropdown
          excludeDates={excludedDates}
          filterDate={this.isWeekday}
          yearDropdownItemNumber={3}
          disabled={disabled}
        />
        {hasError ? (
          <p className="general-dropdown--error">{errorMessage ? errorMessage : ''}</p>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps({ login }) {
  return { login };
}

export default connect(mapStateToProps, actions)(GeneralDatepicker);
