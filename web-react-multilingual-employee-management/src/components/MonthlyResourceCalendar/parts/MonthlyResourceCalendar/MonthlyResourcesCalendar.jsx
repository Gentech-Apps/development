import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions';
//img
import circleChevronLeft from '../../../../images/general/circle-chevron-left.svg';
import paintRoller from '../../../../images/processTypes/paintRoller.svg';
import Lock from '../../../../images/updatepopup/openLock.svg';
import caretLeft from '../../../../images/general/caret-left.svg';
import caretRight from '../../../../images/general/caret-right.svg';
import Arrow from '../../../../images/general/white-arrow.svg';
import Warning from '../../../../images/general/warning-sign.svg';
import circleAdd from '../../../../images/general/circle-add.svg';
//icons
import { SvgIcon } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import problem_icon from '../../../../images/general/problem.svg';
import {
  sortProcessesMonthlyRView,
  sortProcessesMonthlyView,
} from '../../../../functions/data/sortProcesses';
import { createOrderProcessForM_RBackground } from '../../../../functions/helpers/createOrderProcessBackground';
import { InformationPopup } from '../../../updatePopups/InformationPopup';
import { calculateUsers } from '../../../updatePopups/tools';
import { LOGIN_DATA } from '../../../../constants/offline-mode';
import drag_icon from '../../../../images/icons/drag_x.svg';
import { padStart } from 'lodash';
import { getPosition } from '../../../../hooks/helper';

let uniqid = require('uniqid');

class MonthlyResourcesCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoPopup: false,
      processInfoData: {},
      infoPop: React.createRef(),
    };
  }

  handleProcessMenu = (data, date) => {
    this.props.initProccessUpdatePopup(data, date);
  };

  goToDailyIfMobile = (day) => {
    // dynamic factory name in url
    const dynamicFactoryName = this.props.factoryName;
    let dateNew = day.date;
    dateNew = moment(dateNew).add(5, 'hours')._d;
    this.props.history.push(`/${dynamicFactoryName}/daily/${dateNew} ${window.location.search}`);
  };

  setDayColor = (day) => {
    let warning = '#243748';
    day.dayData.map((data, dataIndex) => {
      if (data !== undefined) {
        if (data.value && data.value.length > 0) {
          data.value.map((order, orderIndex) => {
            if (order !== undefined && order.warnings) {
              warning = 'red';
            }
          });
        }
      }
    });
    return warning;
  };

  backToToday = () => {
    this.props.backToToday();
  };

  findDayWarningForMobileUiHeader = async () => {
    const { datesArray } = this.props;
    let datesArray_copy = JSON.parse(JSON.stringify(datesArray));
    datesArray_copy.map((day) => {
      for (let i = 0; i < day.dayData.length; i++) {
        if (day.dayData[i] !== null && day.dayData[i] !== undefined) {
          let p = day.dayData[i];
          for (let j = 0; j < p.value.length; j++) {
            if (p.value[j] !== undefined && p.value[j] !== null) {
              if (p.value[j].warnings && !p.value[j].proccess.backlog) {
                day.warning = true;
              }
            }
          }
        }
      }
    });
    let su_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'ראשון').filter((d) => d.warning === true)
        .length <= 0;
    let mo_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'שני').filter((d) => d.warning === true)
        .length <= 0;
    let tu_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'שלישי').filter((d) => d.warning === true)
        .length <= 0;
    let we_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'רביעי').filter((d) => d.warning === true)
        .length <= 0;
    let th_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'חמישי').filter((d) => d.warning === true)
        .length <= 0;
    let fr_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'שישי').filter((d) => d.warning === true)
        .length <= 0;
    let sa_no_warning =
      datesArray_copy.filter((day) => day.dateName === 'שבת').filter((d) => d.warning === true)
        .length <= 0;
    let mobile_days_names = [
      su_no_warning,
      mo_no_warning,
      tu_no_warning,
      we_no_warning,
      th_no_warning,
      fr_no_warning,
      sa_no_warning,
    ];
    return mobile_days_names;
  };

  previous_info_popup_id = '';
  initHandlerForInfoPopup = (event, popup_id) => {
    if (this.previous_info_popup_id) {
      let tag = document.getElementById(this.previous_info_popup_id);
      tag && (tag.style.display = 'none');
    }
    if (event.target.offsetParent.nextSibling) {
      document.getElementById(event.target.offsetParent.nextSibling.id).style.display = 'block';
    } else if (event.target.parentElement.nextSibling) {
      document.getElementById(event.target.parentElement.nextSibling.id).style.display = 'block';
    } else {
      document.getElementById(event.target.parentElement.parentNode.nextSibling.id).style.display =
        'block';
    }
    if (popup_id) {
      let tag = document.getElementById(popup_id);
      tag && (tag.style.marginTop = this.setInfoTopView(event));
    }
    this.previous_info_popup_id = popup_id;
  };

  setInfoTopView = (event) => {
    let xPoint = event.clientX;
    let yPoint = event.clientY;
    let innerHeight = window.innerHeight;
    let height = innerHeight - yPoint;
    return height < 160 ? '-78%' : '-12%';
  };

  closeHandlerInfoPopup = (event, popup_id) => {
    let is_hover_on_info = false;
    let popup = document.getElementById(popup_id)?.addEventListener(
      'mouseenter',
      (e) => {
        is_hover_on_info = true;
      },
      false,
    );
    setTimeout(() => {
      if (!is_hover_on_info) {
        document.getElementById(popup_id).style.display = 'none';
      }
    }, 100);
  };

  fourWeeksDateChangeCal = (value) => {
    this.props.fourWeeksDateChange(value);
  };

  checkIndexAndSetWidth = (date, data) => {
    let index = this.props.simpleDateArray.indexOf(date);
    if ([0, 5, 10, 15].includes(index) && data?.day_duration >= 5) {
      return `calc((100% + 0.9px) * ${5})`;
    } else if ([1, 6, 11, 16].includes(index) && data?.day_duration >= 4) {
      return `calc((100% + 0.9px) * ${4})`;
    } else if ([2, 7, 12, 17].includes(index) && data?.day_duration >= 3) {
      return `calc((100% + 0.9px) * ${3})`;
    } else if ([3, 8, 13, 18].includes(index) && data?.day_duration >= 2) {
      return `calc((100% + 0.9px) * ${2})`;
    } else if ([4, 9, 14, 19].includes(index) && data?.day_duration >= 1) {
      return `calc((100% + 0.9px) * ${1})`;
    }
    return `calc((100% + 0.9px) * ${data?.day_duration <= 0 ? 1 : data?.day_duration})`;
  };

  checkIndexAt = (date, data) => {
    let z_index = this.props.z_index;
    let index = this.props.simpleDateArray.indexOf(date);
    if (z_index.includes(index)) {
      return true;
    } else if (!z_index.includes(index) && !data?.proccess?.fraction) {
      return true;
    }
    return false;
  };

  render() {
    const {
      currentSelectedDate,
      orders,
      datesArray,
      loader,
      daysOffNumber,
      disableDrag,
      daysOff,
      simpleDateArray,
      user_or_order_type,
    } = this.props;
    let headerDatesString =
      datesArray && datesArray.length > 0
        ? datesArray[0].parsedDate + ' - ' + datesArray[datesArray.length - 1].parsedDate
        : null;
    let headerWeeksFirstString =
      datesArray && datesArray.length > 0 ? moment(datesArray[0].date).week() : null;
    let headerWeeksEndString =
      datesArray && datesArray.length > 0
        ? moment(datesArray[datesArray.length - 1].date).week()
        : null;
    let mobile_days_names_warning_check = this.findDayWarningForMobileUiHeader();
    let mobileDaysNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    let header_color = 'rgb(210 210 210)';
    let info_popup_position = {
      initial: -10,
      last: 100,
    };
    let blockDecrementation = false;
    return (
      <div className="month-resource-page__calendar">
        <header className="month-resource-page__calendar__header">
          <figure
            id="mobile__dec__figure"
            style={blockDecrementation ? { pointerEvents: 'none' } : {}}
            onClick={() => {
              this.fourWeeksDateChangeCal('dec');
            }}
          >
            {' '}
            <img className="monthly-resource-arrows" src={caretRight} alt="right-arrow" />{' '}
          </figure>
          <button
            className="btn--back--today"
            onClick={() => {
              this.backToToday();
            }}
          >
            <SvgIcon className="back--today--icon" component={EventIcon} />
            <p>חזור להיום</p>
          </button>
          <figure
            className="figure-arrows"
            style={blockDecrementation ? { pointerEvents: 'none' } : {}}
            onClick={() => {
              this.fourWeeksDateChangeCal('dec');
            }}
          >
            {' '}
            <img className="monthly-resource-arrows" src={caretRight} alt="right-arrow" />{' '}
          </figure>
          {!!headerDatesString && (
            <h3>
              שבועות {headerWeeksFirstString} - {headerWeeksEndString} ( {headerDatesString} )
            </h3>
          )}
          <figure
            className="figure-arrows"
            onClick={() => {
              this.fourWeeksDateChangeCal('inc');
            }}
          >
            {' '}
            <img className="monthly-resource-arrows" src={caretLeft} alt="left-arrow" />{' '}
          </figure>
        </header>

        <section className="month-resource-page__calendar__mobile-days-panel">
          {mobileDaysNames.map((day, dayIndex) => {
            if (!daysOff.includes(dayIndex))
              return (
                <div key={uniqid()} style={{ width: `calc( 100% / ${7 - daysOffNumber})  ` }}>
                  {mobile_days_names_warning_check[dayIndex] ? (
                    <p>{day}</p>
                  ) : (
                    <p className="mobile__days__names__warning">
                      {day} <img src={problem_icon} alt="problem" />{' '}
                    </p>
                  )}
                </div>
              );
          })}
        </section>

        <section className="month-resource-page__calendar__table">
          {datesArray.map((day, ind) => {
            let hasWarnings = false; //false before
            let isUserIndex = false;
            if (ind % 7 === 0) isUserIndex = true;
            let isHalfDayBlank = false;
            if (day.holiday) {
              if (day.isProcessBlank) isHalfDayBlank = true;
            }
            // for(let i = 0; i < day.dayData.length; i++){
            //     if(day.dayData[i].overloaded && !day.dayData[i].proccess.backlog){
            //         hasWarnings = true
            //         break;
            //     }
            // }
            // if(day.dayData !== undefined) {
            for (let i = 0; i < day.dayData.length; i++) {
              if (day.dayData[i] !== null && day.dayData[i] !== undefined) {
                let p = day.dayData[i];
                if (p.value.length > 0) {
                  for (let j = 0; j < p.value.length; j++) {
                    if (p.value[j] !== undefined) {
                      if (p.value[j].warnings && !p.value[j].proccess.backlog) {
                        day.warning = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
            // }

            let mobileParsedDate = day.parsedDate;
            mobileParsedDate = mobileParsedDate.substr(0, 5) + '/' + mobileParsedDate.substr(8);
            let today_date = moment().format('L');
            today_date = today_date.substr(0, 5) + '/' + today_date.substr(8);
            if (!day.dayOff) {
              let i = 0;
              return (
                <>
                  {isUserIndex ? (
                    <div
                      key={uniqid() + '35'}
                      style={{ width: `calc( 100% / ${8 - daysOffNumber})` }}
                      className={
                        hasWarnings
                          ? 'month-resource-page__calendar__table__day month-resource-page__calendar__table__day--warning'
                          : 'month-resource-page__calendar__table__day'
                      }
                    >
                      <figure></figure>

                      {day.holiday ? (
                        <div style={{ marginBottom: '5px' }}>
                          <header
                            style={{ backgroundColor: header_color, justifyContent: 'center' }}
                          >
                            <p
                              style={{
                                fontSize: '17px',
                                fontWeight: 500,
                                color: 'rgb(36, 55, 72)',
                                textTransform: 'capitalize',
                              }}
                            >
                              משתמשים
                            </p>
                          </header>
                        </div>
                      ) : day.dayOff ? (
                        <div style={{ marginBottom: '5px' }}>
                          <header style={{ backgroundColor: '#cef8c1', justifyContent: 'center' }}>
                            <p
                              style={{
                                fontSize: '17px',
                                fontWeight: 500,
                                color: 'rgb(36, 55, 72)',
                                textTransform: 'capitalize',
                              }}
                            >
                              משתמשים
                            </p>
                          </header>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '5px' }}>
                          <header
                            style={{ backgroundColor: header_color, justifyContent: 'center' }}
                          >
                            <p
                              style={{
                                fontSize: '17px',
                                fontWeight: 500,
                                color: 'rgb(36, 55, 72)',
                                textTransform: 'capitalize',
                              }}
                            >
                              משתמשים
                            </p>
                          </header>
                        </div>
                      )}
                      {(day.holiday && day.holiday?.status === 'Day Off') || day.dayOff ? (
                        <React.Fragment>
                          {/* <aside className="month-resource-page__calendar__table__day--holiday">
                                                <p>{day.holiday.name}</p>
                                            </aside> */}
                          <div className="month-resource-page__calendar__table__day--dayoff">
                            <p style={{ width: '100%' }}>{day.holiday?.name}</p>
                            <p style={{ width: '100%' }}>יום חופש</p>
                          </div>
                        </React.Fragment>
                      ) : (
                        // day.dayOff ?
                        //     <React.Fragment>
                        //         <aside className="month-resource-page__calendar__table__day--holiday">
                        //             {/* <p>סופ״ש</p> */}
                        //             <div className="month-resource-page__calendar__table__day--dayoff"><p>יום חופש</p></div>
                        //         </aside>
                        //     </React.Fragment>
                        // :
                        <div
                          className="month-resource-page__calendar__table__day__droppable"
                          style={{
                            height: day.holiday ? 'calc(100% - 50px)' : 'calc(100% - 30px)',
                          }}
                        >
                          {sortProcessesMonthlyRView(day.parsedDate, day.dayData).map(
                            (dataDay, userIndex) => {
                              if (dataDay !== undefined) {
                                return (
                                  <div
                                    key={userIndex}
                                    style={{
                                      width: '100%',
                                      height: dataDay.heightWouldBe + 'px',
                                      borderBottom:
                                        dataDay.heightWouldBe > 0 ? '1px solid #b7bdc2' : '',
                                    }}
                                  >
                                    <h3
                                      style={{
                                        fontSize: '16px',
                                        fontWeight: 100,
                                        color: dataDay.overloaded ? 'red' : '#243748',
                                        textAlign: 'center',
                                      }}
                                    >
                                      {dataDay?.user_name}
                                    </h3>
                                  </div>
                                );
                              }
                            },
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div
                    style={{ width: `calc( 100% / ${8 - daysOffNumber})` }}
                    className={
                      hasWarnings
                        ? 'month-resource-page__calendar__table__day month-resource-page__calendar__table__day--warning'
                        : 'month-resource-page__calendar__table__day'
                    }
                    key={day.parsedDate}
                  >
                    <figure></figure>

                    {(day.holiday && day.holiday?.status === 'Day Off') || day.dayOff ? (
                      <div style={{ marginBottom: '5px', color: this.setDayColor(day) }}>
                        <header style={{ backgroundColor: '#cef8c1' }}>
                          <p>
                            {day.dateName}{' '}
                            {this.setDayColor(day) === 'red' ? (
                              <img className="warning_icon" src={Warning} alt="warning"></img>
                            ) : (
                              ''
                            )}
                          </p>
                          <p>
                            <span title={day.holiday?.name}>{'(יום חופש) '}</span> {day.parsedDate}
                          </p>
                          <span
                            className={
                              String(mobileParsedDate) === String(today_date) ? 'today__mark' : ''
                            }
                          >
                            {mobileParsedDate}
                          </span>
                        </header>
                        {/* <aside className="month-resource-page__calendar__table__day--holiday">
                                            <p>{day.holiday.name}</p>
                                        </aside> */}
                      </div>
                    ) : day.holiday && day.holiday?.status === 'Half Day' ? (
                      <div style={{ marginBottom: '5px', color: this.setDayColor(day) }}>
                        <header style={{ backgroundColor: '#cef8c1' }}>
                          <p>
                            {day.dateName}{' '}
                            {this.setDayColor(day) === 'red' ? (
                              <img className="warning_icon" src={Warning} alt="warning"></img>
                            ) : (
                              ''
                            )}
                          </p>
                          <p>
                            <span title={day.holiday?.name}>{'(חצי יום)'}</span> {day.parsedDate}
                          </p>
                          <span
                            className={
                              String(mobileParsedDate) === String(today_date) ? 'today__mark' : ''
                            }
                          >
                            {mobileParsedDate}
                          </span>
                        </header>
                        {/* <aside className="month-resource-page__calendar__table__day--holiday">
                                            <p>סופ״ש</p>
                                        </aside> */}
                      </div>
                    ) : (
                      <div style={{ marginBottom: '5px', color: this.setDayColor(day) }}>
                        <header style={{ backgroundColor: header_color }}>
                          <p>
                            {day.dateName}{' '}
                            {this.setDayColor(day) === 'red' ? (
                              <img className="warning_icon" src={Warning} alt="warning"></img>
                            ) : (
                              ''
                            )}
                          </p>
                          <p>
                            {' '}
                            <span>{'(' + moment(day.date).week() + ') '}</span> {day.parsedDate}
                          </p>
                          <span
                            className={
                              String(mobileParsedDate) === String(today_date) ? 'today__mark' : ''
                            }
                          >
                            {' '}
                            {mobileParsedDate}
                          </span>
                        </header>
                        {/* <aside className="month-resource-page__calendar__table__day--holiday_space">
                                            <p>{``}</p>
                                        </aside> */}
                      </div>
                    )}

                    {(day.holiday && day.holiday.status === 'Day Off') || day.dayOff ? (
                      <React.Fragment>
                        {/* <aside className="month-resource-page__calendar__table__day--holiday">
                                                <p>{day.holiday.name}</p>
                                            </aside> */}
                        <div className="month-resource-page__calendar__table__day--dayoff">
                          <p style={{ width: '100%' }}>{day.holiday?.name}</p>
                          {/* <p style={{width: '100%'}}>יום חופש</p> */}
                        </div>
                      </React.Fragment>
                    ) : // day.dayOff ?
                    //     <React.Fragment>
                    //         <aside className="month-resource-page__calendar__table__day--holiday">
                    //             {/* <p>סופ״ש</p> */}
                    //             <div className="month-resource-page__calendar__table__day--dayoff"><p>יום חופש</p></div>
                    //         </aside>
                    //     </React.Fragment>
                    // :
                    // day.holiday && day.holiday.status === 'Day Off' || day.dayOff ?
                    //     <div className="month-resource-page__calendar__table__day--dayoff"><p>יום חופש</p></div>
                    //         :
                    !isHalfDayBlank ? (
                      <Droppable droppableId={day.parsedDate} key={day.parsedDate}>
                        {(provided) => (
                          <div
                            // style={{ backgroundColor: 'lightgreen', width: '100px', height: '20px', direction: 'rtl'}}
                            className="month-resource-page__calendar__table__day__droppable"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              height: day.holiday ? 'calc(100% - 50px)' : 'calc(100% - 30px)',
                              ...provided.droppableProps.style,
                            }}
                          >
                            {sortProcessesMonthlyRView(day.parsedDate, day.dayData).map(
                              (dataDay, userIndex) => {
                                if (dataDay !== undefined) {
                                  return (
                                    <div
                                      style={{
                                        width: '100%',
                                        height: dataDay.heightWouldBe + 'px',
                                        borderBottom:
                                          dataDay.heightWouldBe > 0
                                            ? '1px solid rgb(226 231 236)'
                                            : '',
                                      }}
                                      key={userIndex}
                                    >
                                      {dataDay.value.map((data, Index) => {
                                        if (data && data.proccess && !data.proccess.backlog) {
                                          return (
                                            <Draggable
                                              draggableId={
                                                data.proccess._id + '_' + userIndex + '_' + Index
                                              }
                                              index={i++}
                                              key={data.proccess._id + '_' + uniqid()}
                                              isDragDisabled={disableDrag || data.proccess.done}
                                            >
                                              {(provided) => (
                                                <React.Fragment>
                                                  <div
                                                    onClick={() => {
                                                      this.handleProcessMenu(data, day.date);
                                                    }}
                                                    className={
                                                      data?.warnings
                                                        ? 'month-resource-page__calendar__table__day__process month-resource-page__calendar__table__day__process--warning'
                                                        : 'month-resource-page__calendar__table__day__process'
                                                    }
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    style={{
                                                      borderRadius: '20px',
                                                      backgroundColor: createOrderProcessForM_RBackground(
                                                        data,
                                                        user_or_order_type,
                                                      ),
                                                      zIndex: this.checkIndexAt(
                                                        day.parsedDate,
                                                        data,
                                                      )
                                                        ? '99'
                                                        : '0',
                                                      visibility:
                                                        !data.proccess.currentProcess &&
                                                        this.props.isCurrentProcess
                                                          ? 'hidden'
                                                          : '',
                                                      height:
                                                        !data.proccess.currentProcess &&
                                                        this.props.isCurrentProcess
                                                          ? '0px'
                                                          : '',
                                                      width:
                                                        !data.proccess.currentProcess &&
                                                        this.props.isCurrentProcess
                                                          ? `0px`
                                                          : this.checkIndexAndSetWidth(
                                                              day.parsedDate,
                                                              data,
                                                            ),
                                                      margin:
                                                        !data.proccess.currentProcess &&
                                                        this.props.isCurrentProcess
                                                          ? '0px'
                                                          : '',
                                                      border:
                                                        !data.proccess.currentProcess &&
                                                        this.props.isCurrentProcess
                                                          ? '0px'
                                                          : '',
                                                      ...provided.draggableProps.style,
                                                    }}
                                                  >
                                                    {/* <aside style={{cursor: 'pointer'}}  className={data?.warnings ? `process-type-aside--warning` : `process-type-aside`}>
                                                                                                <img className="process-type-icon" src={paintRoller} alt="paint_roller"></img>
                                                                                            </aside> */}
                                                    <div
                                                      className="drag__icon__container"
                                                      onMouseEnter={(event) =>
                                                        this.initHandlerForInfoPopup(
                                                          event,
                                                          data.proccess._id,
                                                        )
                                                      }
                                                      onMouseLeave={(event) =>
                                                        this.closeHandlerInfoPopup(
                                                          event,
                                                          data.proccess._id,
                                                        )
                                                      }
                                                    >
                                                      {' '}
                                                      {/* <HtmlTooltip
                                                                                                    placement='right-start'
                                                                                                    TransitionComponent={Fade}
                                                                                                    title={<InformationPopup 
                                                                                                        process={data?.proccess} 
                                                                                                        data={data}
                                                                                                        popupId={data.proccess._id}
                                                                                                    />}
                                                                                                > */}
                                                      <img
                                                        className="drag__icon"
                                                        src={drag_icon}
                                                        alt="drag icon"
                                                      ></img>
                                                      {/* </HtmlTooltip> */}
                                                    </div>
                                                    <section
                                                      className="resource-section"
                                                      style={{ padding: '0px 10px' }}
                                                    >
                                                      <div>
                                                        <p>
                                                          <span className="month__proccess__employee">
                                                            {/* {data.proccess.process_name} */}
                                                            {data.client_name}
                                                          </span>
                                                        </p>
                                                      </div>
                                                    </section>
                                                  </div>
                                                  <div
                                                    style={{
                                                      display: 'none',
                                                      transform: `translateX(${getPosition(
                                                        info_popup_position,
                                                        data.proccess.process_date,
                                                      )}%)`,
                                                    }}
                                                    className="info--popup"
                                                    id={data.proccess._id}
                                                  >
                                                    <InformationPopup
                                                      process={data?.proccess}
                                                      popupId={data.proccess._id}
                                                      data={data}
                                                    />
                                                  </div>
                                                </React.Fragment>
                                              )}
                                            </Draggable>
                                          );
                                        } else {
                                          // let cs = {
                                          //     backgroundColor: '#f7f7f7',
                                          //     height: '34px',
                                          //     margin: '2',
                                          //     width: '100%',
                                          //     height: '34px',
                                          //     border: 'none',
                                          //     marginBottom: '2px',
                                          //     display: 'flex',
                                          //     flexDirection: 'row',
                                          //     justifyContent: 'unset',
                                          //     alignItems: 'center',
                                          //     padding: '0 5px',
                                          //     overflow: 'hidden',
                                          //     direction: 'rtl',
                                          //     position: 'relative'
                                          // }
                                          // return <div style={cs} key={index}></div>
                                        }
                                      })}
                                    </div>
                                  );
                                }
                              },
                            )}
                          </div>
                        )}
                      </Droppable>
                    ) : (
                      <div className="month-resource-page__calendar__table__day--dayoff">
                        <p style={{ width: '100%' }}>{day.holiday?.name}</p>
                      </div>
                    )}
                  </div>
                </>
              );
            }
          })}
        </section>
      </div>
    );
  }
}

// export default withRouter(MonthlyResourcesCalendar)

function mapStateToProps({ monthResource }) {
  return { monthResource };
}
export default connect(mapStateToProps, actions)(MonthlyResourcesCalendar);
