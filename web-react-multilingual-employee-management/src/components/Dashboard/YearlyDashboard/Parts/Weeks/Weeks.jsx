import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/actions';
import moment from 'moment';
//
import { isSameDay } from '../../../../../functions/general/general';

class Weeks extends Component {
  holidayChecker = (start_week, end_week, startDay = false) => {
    for (let holiday of this.props.login.user.holidays) {
      let holiday_week_formated = moment(holiday.date).format();
      if (this.props.login.user && this.props.login.user.mps_view === 'day') {
        if (isSameDay(moment(startDay).toDate(), moment(holiday_week_formated).toDate())) {
          return { holiday: holiday.name, isholiday: true };
        }
      } else {
        if (start_week <= holiday_week_formated && holiday_week_formated <= end_week) {
          return { holiday: holiday.name, isholiday: true };
        }
      }
    }

    return false;
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.orders.weeks_array === this.props.orders.weeks_array) {
      return false;
    } else {
      return true;
    }
  }

  configureCurrent = (date) => {
    if (this.props.login.user.mps_view === 'day') {
      if (isSameDay(new Date(date.start_day_formated), new Date())) {
        return true;
      } else {
        return false;
      }
    } else {
      let current_week_num_start_day = moment(new Date()).startOf('week');
      current_week_num_start_day = moment(current_week_num_start_day._d).format('l');

      if (current_week_num_start_day === moment(new Date(date.start_week)).format('l')) {
        return true;
      } else {
        return false;
      }
    }
  };

  render() {
    let current_week_num_start_day = moment(new Date()).startOf('week');
    current_week_num_start_day = moment(current_week_num_start_day._d).format('l');

    return (
      <div className="weeks__holiday__bar">
        <div className="weeks">
          {this.props.orders.weeks_array.map((w, i) => (
            <div
              className="week"
              //   id={

              //     current_week_num_start_day ===  moment( new Date(w.start_week)).format("l")
              //       ? "current__week"
              //       : ""
              //   }
              id={this.configureCurrent(w) ? 'current__week' : null}
              key={i}
            >
              {w.week}
            </div>
          ))}
        </div>
        <div className="weeks__dates">
          {this.props.orders.weeks_array.map((w, i) => (
            <div
              className="week__date"
              //   id={
              //     current_week_num_start_day ===  moment( new Date(w.start_week)).format("l")
              //       ? "current__week"
              //       : ""
              //   }
              id={this.configureCurrent(w) ? 'current__week' : null}
              key={i}
            >
              {w.week_dates}
            </div>
          ))}
        </div>
        <div className="holidays">
          {this.props.orders.weeks_array.map((w, i) => (
            <div
              className="holiday"
              //   id={
              //     current_week_num_start_day ===  moment( new Date(w.start_week)).format("l")
              //       ? "current__week"
              //       : ""
              //   }
              id={this.configureCurrent(w) ? 'current__week' : null}
              key={i}
            >
              <i
                className="fas fa-circle"
                style={{ color: 'red', display: w.overloaded ? 'block' : 'none' }}
              ></i>
              <i
                className="fas fa-circle"
                style={{
                  display: this.holidayChecker(w.start_week, w.end_week, w.start_day_formated)
                    ? 'block'
                    : 'none',
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ router, orders, login }) {
  return { router, orders, login };
}

export default connect(mapStateToProps, actions)(Weeks);
