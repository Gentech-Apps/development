import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import LoaderNew from '../../../../LoaderNew/Loader'
//img
// import Drag from '../../../../../images/general/drag_icon.svg'
import circleChevronLeft from '../../../../../images/general/circle-chevron-left.svg';
import paintRoller from '../../../../../images/processTypes/paintRoller.svg';
import Lock from '../../../../../images/updatepopup/openLock.svg';
import caretLeft from '../../../../../images/general/caret-left.svg';
import caretRight from '../../../../../images/general/caret-right.svg';
import Arrow from '../../../../../images/general/white-arrow.svg';
import Warning from '../../../../../images/general/warning-sign.svg';
import circleAdd from '../../../../../images/general/circle-add.svg';
//icons
import { SvgIcon } from '@material-ui/core';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import Fade from '@mui/material/Fade';
import EventIcon from '@material-ui/icons/Event';
import problem_icon from '../../../../../images/general/problem.svg';
import { sortProcessesMonthlyView } from '../../../../../functions/data/sortProcesses';
import { createOrderProcessBackground } from '../../../../../functions/helpers/createOrderProcessBackground';
import { InformationPopup } from '../../../../updatePopups/InformationPopup';
import drag_icon from '../../../../../images/icons/drag_x.svg';

import * as momentBusinessDays from 'moment-business-days';
import { SERVICE } from '../../../../../constants';
import { getPosition } from '../../../../../hooks/helper';
// import { HtmlTooltipStyled } from '../../../../../hooks/helper';

momentBusinessDays.updateLocale('us', {
  workingWeekdays: [0, 1, 2, 3, 4],
});

// const HtmlTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   ))(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: HtmlTooltipStyled,
// }));

let uniqid = require('uniqid');
class Calendar extends Component {
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
    const { orders: monthlyOrders } = this.props;
    const warning = monthlyOrders.reduce((result, order) => {
      const { processes } = order;
      processes.forEach((process) => {
        const warning = process.warnings && moment(process.process_date).isSame(day.date, 'day');
        if (warning) {
          result = true;
        }
      });
      return result;
    }, false);
    return warning ? 'red' : 'rgba(0, 0, 0, 0.6)';
  };

  backToToday = () => {
    this.props.backToToday();
  };

  findDayWarningForMobileUiHeader = () => {
    const { datesArray } = this.props;
    let datesArray_copy = JSON.parse(JSON.stringify(datesArray));

    datesArray_copy.map((day) => {
      for (let i = 0; i < day.dayData.length; i++) {
        if (day.dayData[i].warnings.length > 0 && !day.dayData[i].proccess.backlog) {
          day.warning = true;
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

  checkIndexAndSetWidth = (date, data) => {
    let index = this.props.simpleDateArray.indexOf(date);
    if ([0, 5, 10, 15].includes(index) && data?.proccess?.day_duration >= 5) {
      return `calc((100% + 0.9px) * ${5})`;
    } else if ([1, 6, 11, 16].includes(index) && data?.proccess?.day_duration >= 4) {
      return `calc((100% + 0.9px) * ${4})`;
    } else if ([2, 7, 12, 17].includes(index) && data?.proccess?.day_duration >= 3) {
      return `calc((100% + 0.9px) * ${3})`;
    } else if ([3, 8, 13, 18].includes(index) && data?.proccess?.day_duration >= 2) {
      return `calc((100% + 0.9px) * ${2})`;
    } else if ([4, 9, 14, 19].includes(index) && data?.proccess?.day_duration >= 1) {
      return `calc((100% + 0.9px) * ${1})`;
    }
    return `calc((100% + 0.9px) * ${
      data?.proccess?.day_duration <= 0 ? 1 : data?.proccess?.day_duration
    })`;
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
      fourWeeksDateChange,
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
    // let today = moment()
    // let blockDecrementation = currentSelectedDate.isSameOrBefore(today, 'day')
    let info_popup_position = {
      initial: -8,
      last: 100,
    };
    let blockDecrementation = false;
    return (
      <div className="month-view-page__calendar">
        <header className="month-view-page__calendar__header">
          <figure
            id="mobile__dec__figure"
            style={blockDecrementation ? { pointerEvents: 'none' } : {}}
            onClick={() => {
              fourWeeksDateChange('dec');
            }}
          >
            {' '}
            <img className="monthly-view-arrows" src={caretRight} alt="right-arrow" />{' '}
          </figure>
          <figure
            id="mobile__dec__figure-left"
            onClick={() => {
              fourWeeksDateChange('inc');
            }}
          >
            {' '}
            <img className="monthly-view-arrows" src={caretLeft} alt="left-arrow" />{' '}
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
              fourWeeksDateChange('dec');
            }}
          >
            {' '}
            <img className="monthly-view-arrows" src={caretRight} alt="right-arrow" />{' '}
          </figure>
          {!!headerDatesString && (
            <h3>
              שבועות {headerWeeksFirstString} - {headerWeeksEndString} ( {headerDatesString} )
            </h3>
          )}
          <figure
            className="figure-arrows"
            onClick={() => {
              fourWeeksDateChange('inc');
            }}
          >
            {' '}
            <img className="monthly-view-arrows" src={caretLeft} alt="left-arrow" />{' '}
          </figure>
        </header>

        <section className="month-view-page__calendar__mobile-days-panel">
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

        <section
          className="month-view-page__calendar__table"
          id="month-view-page__calendar__table_plan"
        >
          {datesArray.map((day) => {
            let hasWarnings = false;
            for (let i = 0; i < day.dayData.length; i++) {
              if (day.dayData[i].warnings.length > 0 && !day.dayData[i].proccess.backlog) {
                hasWarnings = true;
                break;
              }
            }

            let isHalfDayBlank = false;
            if (day.holiday) {
              if (day.dayData.length === 0) isHalfDayBlank = true;
            }
            let mobileParsedDate = day.parsedDate;
            mobileParsedDate = mobileParsedDate.substr(0, 5) + '/' + mobileParsedDate.substr(8);
            let today_date = moment().format('L');
            today_date = today_date.substr(0, 5) + '/' + today_date.substr(8);

            if (!day.dayOff)
              return (
                <div
                  style={{ width: `calc( 100% / ${7 - daysOffNumber})` }}
                  className={
                    hasWarnings
                      ? 'month-view-page__calendar__table__day month-view-page__calendar__table__day--warning'
                      : 'month-view-page__calendar__table__day'
                  }
                  key={day.parsedDate}
                >
                  <figure
                    onClick={() => {
                      this.goToDailyIfMobile(day);
                    }}
                  ></figure>
                  {(day.holiday && day.holiday?.status === 'Day Off') || day.dayOff ? (
                    <div
                      style={{ marginBottom: '5px', color: this.setDayColor(day) }}
                      onClick={() => {
                        this.goToDailyIfMobile(day);
                      }}
                    >
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
                    </div>
                  ) : day.holiday && day.holiday?.status === 'Half Day' ? (
                    <div
                      style={{ marginBottom: '5px', color: this.setDayColor(day) }}
                      onClick={() => {
                        this.goToDailyIfMobile(day);
                      }}
                    >
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
                    </div>
                  ) : (
                    <div
                      style={{ marginBottom: '5px', color: this.setDayColor(day) }}
                      onClick={() => {
                        this.goToDailyIfMobile(day);
                      }}
                    >
                      <header style={{ backgroundColor: header_color }}>
                        <p>
                          {day.dateName}{' '}
                          {this.setDayColor(day) === 'red' ? (
                            <img className="warning_icon" src={Warning} alt="warning"></img>
                          ) : (
                            ''
                          )}{' '}
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
                    </div>
                  )}

                  {(day.holiday && day.holiday.status === 'Day Off') || day.dayOff ? (
                    <React.Fragment>
                      <div className="month-view-page__calendar__table__day--dayoff">
                        <p style={{ width: '100%' }}>{day.holiday.name}</p>
                      </div>
                    </React.Fragment>
                  ) : !isHalfDayBlank ? (
                    <Droppable droppableId={day.parsedDate}>
                      {(provided) => (
                        <div
                          className="month-view-page__calendar__table__day__droppable"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            height: day.holiday ? 'calc(100% - 50px)' : 'calc(100% - 30px)',
                            ...provided.droppableProps.style,
                            margin: '0px 0px',
                            padding: '0px 0px',
                          }}
                        >
                          {sortProcessesMonthlyView(day.dayData).map((data, index) => {
                            if (data !== undefined) {
                              let resourcesString = data.proccess.resource
                                .map((subitem) => subitem.name + ' / ')
                                .sort()
                                .join(' ')
                                .replace(/,/gi, '');
                              resourcesString = resourcesString.substr(
                                0,
                                resourcesString.length - 2,
                              );

                              if (!data.proccess.backlog) {
                                return (
                                  <Draggable
                                    draggableId={data.proccess._id}
                                    index={index}
                                    key={data.proccess._id}
                                    isDragDisabled={disableDrag || data.proccess.done}
                                  >
                                    {(provided) => (
                                      <React.Fragment>
                                        <div
                                          onClick={() => {
                                            this.handleProcessMenu(data, day.date);
                                          }}
                                          className={
                                            data?.proccess?.warnings
                                              ? 'month-view-page__calendar__table__day__process month-view-page__calendar__table__day__process--warning'
                                              : 'month-view-page__calendar__table__day__process'
                                          }
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          ref={provided.innerRef}
                                          style={{
                                            zIndex: this.checkIndexAt(day.parsedDate, data)
                                              ? '99'
                                              : '0',
                                            backgroundColor: data.proccess.done ? '#E8E9EB' : '',
                                            borderRadius: '20px',
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
                                            // width: !data.proccess.currentProcess && this.props.isCurrentProcess ? '0px':'',
                                            width:
                                              !data.proccess.currentProcess &&
                                              this.props.isCurrentProcess
                                                ? `0px`
                                                : this.checkIndexAndSetWidth(day.parsedDate, data),
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
                                          <div
                                            className="drag__icon__container"
                                            onMouseEnter={(event) =>
                                              this.initHandlerForInfoPopup(event, data.proccess._id)
                                            }
                                            onMouseLeave={(event) =>
                                              this.closeHandlerInfoPopup(event, data.proccess._id)
                                            }
                                          >
                                            {' '}
                                            <img
                                              className="drag__icon"
                                              src={drag_icon}
                                              alt="drag icon"
                                            ></img>
                                          </div>
                                          <section style={{ padding: '0px 10px' }}>
                                            <div>
                                              <p>
                                                <span className="month__process__client__name">
                                                  {' '}
                                                  {data?.proccess?.client_name}
                                                </span>
                                                {data?.proccess?.remark ? '-' : ''}
                                                <span className="month__process__client__name four_characters_length">
                                                  {' '}
                                                  {data?.proccess?.remark} -{' '}
                                                </span>
                                                <span className="month__process__number">
                                                  {data?.proccess?.order_number}
                                                </span>
                                                <span className="icones"></span>{' '}
                                              </p>
                                            </div>
                                            <div>
                                              <p>
                                                {data?.proccess?.process_name} -
                                                <span className="month__proccess__employee">
                                                  {' '}
                                                  {resourcesString}
                                                </span>
                                              </p>
                                            </div>
                                          </section>
                                          {data?.proccess?.is_detached ? (
                                            <div className="month-view-page__calendar__table__day__process--menu">
                                              <img src={Lock} alt="menu" />
                                            </div>
                                          ) : null}
                                          <span
                                            style={{
                                              background: createOrderProcessBackground(
                                                data?.proccess,
                                                user_or_order_type,
                                              ),
                                            }}
                                            className="process--view"
                                          ></span>
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
                                            process={data.proccess}
                                            popupId={`${data.proccess._id}`}
                                          />
                                        </div>
                                      </React.Fragment>
                                    )}
                                  </Draggable>
                                );
                              }
                            }
                          })}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div className="month-resource-page__calendar__table__day--dayoff">
                      <p style={{ width: '100%' }}>{day.holiday?.name}</p>
                    </div>
                  )}
                </div>
              );
          })}
        </section>
      </div>
    );
  }
}

export default withRouter(Calendar);
