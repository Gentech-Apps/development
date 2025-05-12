import React, { Component } from 'react';
import moment from 'moment';
import he from 'date-fns/locale/he';
import 'moment/locale/he';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../../../sass/dateSelect/dateSelect.scss';
import date_icon from './icons/date_icon.svg';
import { polyfill } from 'es6-promise';
import { connect } from 'react-redux';
import * as actions from '../../../../../../actions/actions';
polyfill();

class DateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_validate: true,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    let { validate_all_form } = this.props;
    if (nextProps.validate_all_form !== validate_all_form) {
      this.validateForm();
    }
  }

  handleChange = (date) => {
    let { updateForm, name } = this.props;
    let date_with_hour = new Date(date).setHours(16, 0, 0, 0);
    date_with_hour = new Date(date_with_hour);
    this.setState({
      value: date_with_hour,
    });
    updateForm(name, date_with_hour);
  };

  isWeekday = (date) => {
    const day = date.getDay();

    let array_copy_days = JSON.parse(JSON.stringify(this.props.user_data.off_days));
    return (
      day !== array_copy_days[0] &&
      day !== array_copy_days[1] &&
      day !== array_copy_days[2] &&
      day !== array_copy_days[3] &&
      day !== array_copy_days[4] &&
      day !== array_copy_days[5] &&
      day !== array_copy_days[6]
    );
  };

  validateForm = () => {
    let { value } = this.state;
    console.log(value);
    if (value === '') {
      this.setState({
        is_validate: false,
      });
    }
  };

  hideValidateMessage = (e) => {
    this.setState({
      is_validate: true,
    });
  };

  clickAndScroll = () => {
    setTimeout(function () {
      let element = document.querySelector('.react-datepicker__month-container');
      let scroll_element = document.querySelector('.popup__right__inputs__container');

      if (element !== null) {
        let element_top = element.getBoundingClientRect();
        if (element_top.bottom > 530 && element_top.bottom < 547) {
          scroll_element.scrollTop += 80;
        } else if (element_top.bottom > 518) {
          scroll_element.scrollTop += 130;
        }
      }
    }, 200);
  };

  render() {
    const { value, excludeTimes, validate_message, title, mainPopup } = this.props;
    const { is_validate } = this.state;

    return (
      <div className="date__picker__container">
        <div>{title}</div>
        <div className="options__datepicker" onClick={this.clickAndScroll}>
          <aside>
            <h4>{value ? moment(value).format('DD/MM/YY') : ''}</h4>
          </aside>

          <DatePicker
            selected={value ? value : moment().toDate()}
            onChange={this.handleChange}
            locale={he}
            minDate={moment().toDate()}
            showYearDropdown
            excludeDates={excludeTimes}
            filterDate={this.isWeekday}
            onFocus={this.hideValidateMessage}
            // dropdownMode="select"
            disabled={mainPopup.order_id.length > 0 ? true : false}
            yearDropdownItemNumber={3}
            // scrollableYearDropdown
          />
          <img src={date_icon} alt="Date icon"></img>
        </div>
        {is_validate ? (
          ''
        ) : (
          <div id="v2" className="validate__message">
            {validate_message}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ mainPopup }) {
  return { mainPopup };
}
export default connect(mapStateToProps, actions)(DateSelect);
