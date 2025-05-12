import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
//comps
import Clock from './Clock';
import { reportDone } from '../../../../functions/api/orders';
//functions
import { hexToRgba } from '../../../../functions/general/general';
//img
import Lock from '../../../../images/updatepopup/openLock.svg';
import Arrow from '../../../../images/general/white-arrow.svg';
import check from '../../../../images/general/V.svg';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions';
//icons
import { SvgIcon } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import { DAILY_CALENDAR } from '../../../../constants/translations/dailyCalendar';
const { DURATION, START_TIME, END_TIME, REMARK } = DAILY_CALENDAR;
let uniqId = require('uniqid');

class dailyCalender extends Component {
  constructor() {
    super();

    this.state = {
      activeFilterDrop: false,
      startTime: 8,
    };
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      activeFilterDrop: !prevState.activeFilterDrop,
    }));
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ activeFilterDrop: false });
    }
  };

  reportDoneProcess = async (id) => {
    const { fetchNewData } = this.props;
    let report_result = await reportDone({ _id: id });
    console.log(report_result);
    if (report_result.ok) {
      if (typeof report_result.result === 'string') {
        this.props.setAlertPopupMessage(report_result.result);
        this.props.alertPopupToggle(true);
      }
      fetchNewData();
    }
  };

  openUpdateMenuOnClick = (e, process) => {
    const { openUpdateMenu } = this.props;
    if (e.target.className === 'done__button') {
      return;
    } else {
      openUpdateMenu(process);
    }
  };

  showEmployeeName = (array) => {
    let filterEmployee = array.map((p) => p.name);
    return filterEmployee.join(' / ');
  };

  backToToday = () => {
    this.props.backToToday();
  };

  calculateTime = (time) => {
    const [hours, minutes] = time?.toFixed(2)?.toString()?.split('.');

    const calculatedMinutes = (minutes / 100) * 60 + '';

    const resultMinutes =
      calculatedMinutes && calculatedMinutes.length > 1
        ? calculatedMinutes
        : calculatedMinutes?.length
        ? '0' + calculatedMinutes
        : '00';

    return `${hours}:${resultMinutes}`;
  };

  render() {
    const {
      currentDate,
      handleDateChange,
      processesArray,
      openUpdateMenu,
      is_loader_on,
    } = this.props;
    const { activeFilterDrop } = this.state;

    return (
      <div className="daily-view-page__calender">
        <header className="daily-view-page__calender__header">
          <section className="daily-view-page__calender__header__right">
            <div className="daily-view-page__calender__header__right--dates">
              <figure
                onClick={() => {
                  handleDateChange('dec');
                }}
              >
                <img src={Arrow} alt="arrow" />
              </figure>
              <p>{moment(currentDate).format('DD MMMM YYYY')}</p>
              <figure
                onClick={() => {
                  handleDateChange('inc');
                }}
              >
                <img src={Arrow} alt="arrow" />
              </figure>
            </div>
            <Clock />
          </section>

          <section className="daily-view-page__calender__header__left">
            {/* <div className={activeFilterDrop ? "daily-view-page__calender__header__left--drop daily-view-page__calender__header__left--drop--active":"daily-view-page__calender__header__left--drop"} onClick={()=>{this.toggleMenu()}}>
                            <p>שם משאב</p>
                            <img src={Arrow} alt="arrow"/>
                            <ul ref={this.setWrapperRef}>
                                <li>opt1</li>
                                <li>opt2</li>
                                <li>opt3</li>
                            </ul>
                        </div> */}

            <button
              onClick={() => {
                this.backToToday();
              }}
            >
              <SvgIcon component={EventIcon} />
              <p>חזור להיום</p>
            </button>
          </section>
        </header>

        <main className="daily-view-page__calender__main" id="daily-view-page__calender__main">
          {processesArray.length === 0 ? (
            <div className="daily-view-page__calender__main--no-process">
              <h1>{is_loader_on ? ' ' : 'לא קיימים תהליכים ליום זה'}</h1>
            </div>
          ) : null}

          {processesArray.map((process) => {
            let width =
              process.finished === '0' ? 0 : (process.finished / process.quantity) * 100 + '%';

            return (
              <div
                key={uniqId() + '' + process._id}
                style={{ borderColor: process.warnings.length > 0 ? 'red' : null }}
                className="daily-view-page__calender__main__process"
                onClick={(e) => {
                  this.openUpdateMenuOnClick(e, process);
                }}
              >
                <main className="daily-view-page__calender__main__content">
                  <div className="daily-view-page__calender__main__content--first">
                    <h6>{process.client_name} - </h6>
                    <p>{process.order_number} </p>
                  </div>
                  <div className="daily-view-page__calender__main__content--second">
                    <p>
                      {process.process_name}{' '}
                      <span className="daily__employees__name__hyphen">&nbsp;{'-'} &nbsp; </span>
                    </p>
                    <p className="daily__employees__name">
                      {process.resource.length > 0
                        ? this.showEmployeeName(process.resource)
                        : 'אין עובד'}
                    </p>
                  </div>

                  <div className="daily-view-page__calender__main__content--second">
                    <p>
                      {DURATION}{' '}
                      <span className="daily__employees__name__hyphen">&nbsp;{'-'} &nbsp; </span>
                    </p>
                    <p className="daily__employees__name">
                      {Number(process.actual_duration) ? Number(process.actual_duration) : 0}
                    </p>
                    {process.remark ? (
                      <React.Fragment>
                        <p className="row-second-value">
                          {REMARK}{' '}
                          <span className="daily__employees__name__hyphen">
                            &nbsp;{'-'} &nbsp;{' '}
                          </span>
                        </p>
                        <p className="daily__employees__name four_characters_length">
                          {process.remark}
                        </p>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div className="daily-view-page__calender__main__content--second">
                    <p>
                      {START_TIME}{' '}
                      <span className="daily__employees__name__hyphen">&nbsp;{'-'} &nbsp; </span>
                    </p>
                    <p className="daily__employees__name">
                      {process.startTime ? this.calculateTime(process.startTime) : 0}
                    </p>
                    <p className="row-second-value">
                      {END_TIME}{' '}
                      <span className="daily__employees__name__hyphen">&nbsp;{'-'} &nbsp; </span>
                    </p>
                    <p className="daily__employees__name">
                      {process.endTime ? this.calculateTime(process.endTime) : 0}
                    </p>
                  </div>

                  <div
                    className="daily-view-page__quantity"
                    style={process.done ? { color: 'black' } : { color: '#0091ff' }}
                  >
                    כמות: {process.quantity} / {process.finished}
                  </div>
                </main>

                <div
                  style={{ backgroundColor: process.warnings.length > 0 ? 'red' : 'transparent' }}
                  className="daily-view-page__warning"
                >
                  {' '}
                </div>

                {process.done ? (
                  <div className="done__icon">
                    <img src={check} alt="check" />{' '}
                  </div>
                ) : (
                  <div className="done__button" onClick={() => this.reportDoneProcess(process._id)}>
                    סיימתי
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    );
  }
}

function mapStateToProps({ login }) {
  return { login };
}
export default withRouter(connect(mapStateToProps, actions)(dailyCalender));
