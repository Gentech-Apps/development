import React, { Component } from 'react';
import moment from 'moment';
import { Droppable, Draggable } from 'react-beautiful-dnd';
//functions
import { hexToRgba } from '../../../../functions/general/general';
//images
import Lock from '../../../../images/updatepopup/openLock.svg';
import DragIcon from '../../../../images/general/drag_icon.svg';
import Warning from '../../../../images/general/problem.svg';
import Arrow from '../../../../images/general/white-arrow.svg';
//icons
import { SvgIcon } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import { sortProcessesWeeklyView } from '../../../../functions/data/sortProcesses';
import { createOrderProcessBackground } from '../../../../functions/helpers/createOrderProcessBackground';
import { InformationPopup } from '../../../updatePopups/InformationPopup';
import { getPosition } from '../../../../hooks/helper';
// import { styled } from '@material-ui/core';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import Fade from '@mui/material/Fade';
// import { HtmlTooltipStyled } from '../../../../hooks/helper';
let uniqid = require('uniqid');

// const HtmlTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   ))(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: HtmlTooltipStyled,
// }));

class WeeklyCalendar extends Component {
  constructor() {
    super();

    this.state = {
      holidays: [],
    };
  }

  openUpdateMenu = (process) => {
    this.props.openUpdateMenu(process);
  };

  componentDidMount() {
    const { daysArray } = this.props;
    let holidays = [];
    daysArray.map((item) => {
      if (item.holidays.length > 0 || item.offDay) {
        let holidayDayIndex = moment(item.date).day();
        holidays.push(holidayDayIndex);
      }
    });

    this.setState({ holidays });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.daysArray[0].date !== this.props.daysArray[0].date) {
      let holidays = [];
      this.props.daysArray.map((item) => {
        if (item.holidays.length > 0 || item.offDay) {
          let holidayDayIndex = moment(item.date).day();
          holidays.push(holidayDayIndex);
        }
      });

      this.setState({ holidays });
    }
  }

  checkIfHolidayOrDayOff = (index) => {
    const { holidays } = this.state;

    if (this.props.offDays.includes(index)) {
      return 'day-off';
    }

    for (let i = 0; i < holidays.length; i++) {
      if (holidays[i] === index) return 'holiday';
    }

    return false;
  };

  backToToday = () => {
    this.props.backToToday();
  };

  setDayColor = (day) => {
    const { weeklyOrders } = this.props;
    const warning = weeklyOrders.reduce((result, order) => {
      const { processes } = order;
      processes.forEach((processGroup) => {
        const warning = processGroup.find(
          (process) => process.warnings && moment(process.process_date).isSame(day.date, 'day'),
        );
        if (warning) result = true;
      });
      return result;
    }, false);

    return warning ? 'red' : '#000000';
  };

  checkWorkloadExceeded = (workload) => {
    const PERCENT_100 = 100;
    return workload > PERCENT_100;
  };

  previous_info_popup_id = '';
  initHandlerForInfoPopup = (event, popup_id) => {
    if (this.previous_info_popup_id) {
      let tag = this.getElementStyle(this.previous_info_popup_id);
      tag && (tag.display = 'none');
    }
    if (popup_id) {
      let tag = this.getElementStyle(popup_id);
      tag && (tag.display = 'block');
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
    return height < 160 ? '-48px' : '34px';
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
        this.getElementStyle(popup_id).display = 'none';
      }
    }, 100);
  };

  getElementStyle = (_id) => document.getElementById(_id)?.style;

  render() {
    let info_popup_position = {
      initial: -1,
      last: 97,
    };
    const {
      daysArray,
      currentSelectedDate,
      weeksDateChange,
      weeklyOrders,
      daysOffNumber,
      disableDrag,
    } = this.props;
    const { holidays } = this.state;
    let selectedFirstDayInWeek = moment(currentSelectedDate).startOf('week');
    let todayFirstDayInWeek = moment().startOf('week');
    // let blockDecrementation = selectedFirstDayInWeek.isSameOrBefore(todayFirstDayInWeek, 'day')
    let blockDecrementation = false;

    return (
      <div className="week-view-page__calendar">
        <header className="week-view-page__calendar__header">
          <button
            onClick={() => {
              this.backToToday();
            }}
          >
            <SvgIcon component={EventIcon} />
            <p>חזור להיום</p>
          </button>
          <h3>
            <span>
              שבוע {daysArray && daysArray.length > 0 ? moment(daysArray[0].date).format('w') : ''}{' '}
              &nbsp;
            </span>
            <span>
              ( {daysArray && daysArray.length > 0 ? daysArray[0].parsedDate : ''} -{' '}
              {daysArray && daysArray.length > 0 ? daysArray[daysArray.length - 1].parsedDate : ''}{' '}
              )
            </span>
          </h3>
          <div>
            <figure
              style={blockDecrementation ? { pointerEvents: 'none' } : {}}
              onClick={() => {
                weeksDateChange('dec');
              }}
            >
              <img src={Arrow} alt="" />
            </figure>
            <figure
              onClick={() => {
                weeksDateChange('inc');
              }}
            >
              <img style={{ transform: 'rotate(180deg)' }} src={Arrow} alt="" />
            </figure>
          </div>
        </header>

        <section className="week-view-page__calendar__dates">
          <div
            className="week-view-page__calendar__dates--sections"
            style={{ width: `calc( (100% / ${7 - daysOffNumber}) - 0.33334% )` }}
          >
            <span>תאריכים</span>
            {/* <span>חגים / חופשים</span> */}
          </div>
          <div className="week-view-page__calendar__dates--content">
            {daysArray && daysArray.length > 0
              ? daysArray.map((item) => {
                  if (!item.offDay)
                    return (
                      <div
                        key={uniqid()}
                        className="week-view-page__calendar__dates--content__day"
                        style={{
                          width: `calc( 100% / ${7 - daysOffNumber})`,
                        }}
                      >
                        <section style={{ color: this.setDayColor(item) }}>
                          {item.dateName} - {item.parsedDate}
                        </section>
                        <section>
                          {item.offDay ? <span>סופ״ש</span> : null}

                          {item.holidays.length > 0 ? (
                            <span>
                              <p>{item.holidays[0].name}</p>
                            </span>
                          ) : null}
                        </section>
                      </div>
                    );
                })
              : null}
          </div>
        </section>

        <section className="week-view-page__calendar__data">
          {weeklyOrders.map((item) => {
            return (
              <div className="week-view-page__calendar__data__row" key={item._id}>
                <div
                  className="week-view-page__calendar__data__row--name"
                  style={{ width: `calc( 100% / ${8 - daysOffNumber})` }}
                >
                  <span>
                    {/* <p style={item.warnings ? {color:'#ff0000'}:{}}>{item.process_name}</p> */}
                    {/* {item.warnings ? <img src={Warning} alt="warning"/>:null}  */}
                    <p
                      style={
                        this.checkWorkloadExceeded(item.workload_percentage)
                          ? { color: '#ff0000' }
                          : {}
                      }
                    >
                      {item.process_name}
                    </p>
                    <p
                      style={
                        this.checkWorkloadExceeded(item.workload_percentage)
                          ? { color: '#ff0000' }
                          : {}
                      }
                    >
                      {item.workload_percentage ? `% ${item.workload_percentage}` : ''}
                    </p>
                  </span>
                </div>
                <div className="week-view-page__calendar__data__row--processes">
                  {item.processes.map((subItem, index) => {
                    if (this.checkIfHolidayOrDayOff(index) === 'holiday') {
                      return (
                        <div
                          key={item.process_name + index}
                          className="week-view-page__calendar__data__row--processes__droppable"
                          style={{ width: `calc( 100% / ${7 - daysOffNumber})` }}
                        />
                      );
                    } else if (this.checkIfHolidayOrDayOff(index) === 'day-off') {
                      return null;
                    } else {
                      return (
                        <Droppable
                          droppableId={item.process_name + index}
                          key={item.process_name + index}
                        >
                          {(provided) => (
                            <div
                              className="week-view-page__calendar__data__row--processes__droppable"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                width: `calc( 100% / ${7 - daysOffNumber})`,
                                ...provided.droppableProps.style,
                              }}
                            >
                              {sortProcessesWeeklyView(subItem).map((process, subIndex) => {
                                let width =
                                  process.finished === '0'
                                    ? 0
                                    : (process.finished / process.quantity) * 100 + '%';

                                let resourcesNameString = process.resource
                                  .map((subitem) => subitem.name + ' / ')
                                  .join(' ')
                                  .replace(/,/gi, '');
                                resourcesNameString = resourcesNameString.substr(
                                  0,
                                  resourcesNameString.length - 2,
                                );
                                if (!process.backlog)
                                  return (
                                    <Draggable
                                      draggableId={process._id}
                                      index={subIndex}
                                      key={process._id}
                                      isDragDisabled={disableDrag || process.done}
                                    >
                                      {(provided) => (
                                        <>
                                          <div
                                            onClick={() => {
                                              this.openUpdateMenu(process);
                                            }}
                                            className="week-view-page__calendar__data__row--processes__draggable"
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                          >
                                            {/* <aside className="week-view-page__calendar__data__row--processes__draggable__progress-bar" style={{backgroundColor:hexToRgba(process.color,'0.5')}}> */}
                                            <aside
                                              className="week-view-page__calendar__data__row--processes__draggable__progress-bar"
                                              style={{
                                                background: createOrderProcessBackground(process),
                                              }}
                                            >
                                              {/* {width !== '100%' ? 
                                                                                                <span style={{width,backgroundColor:hexToRgba(process.color,'1')}}></span>
                                                                                                :
                                                                                                <span style={{width,backgroundColor: process.done ? '#d6d6d6': null}}></span>
                                                                                            } */}
                                            </aside>

                                            <section
                                              className="week-view-page__calendar__data__row--processes__draggable--section1"
                                              onMouseEnter={(event) =>
                                                this.initHandlerForInfoPopup(event, process._id)
                                              }
                                              onMouseLeave={(event) =>
                                                this.closeHandlerInfoPopup(event, process._id)
                                              }
                                            >
                                              {' '}
                                              {/* <HtmlTooltip
                                                                                                placement='right-start'
                                                                                                TransitionComponent={Fade}
                                                                                                title={<InformationPopup 
                                                                                                    process={process} 
                                                                                                    popupId={process._id}
                                                                                                />}
                                                                                            > */}
                                              <img src={DragIcon} alt="draggable" />
                                              {/* </HtmlTooltip> */}
                                            </section>
                                            <section
                                              className="week-view-page__calendar__data__row--processes__draggable--section2"
                                              style={process.done ? { color: '#d6d6d6' } : {}}
                                            >
                                              <p className="number_and_remark_wrapper">
                                                <span>{process.order_number}</span>
                                                <span className="remark_text four_characters_length">
                                                  {process.remark}
                                                </span>{' '}
                                              </p>
                                              <p>{process.client_name}</p>
                                              <p>{resourcesNameString}</p>
                                            </section>
                                            <section className="week-view-page__calendar__data__row--processes__draggable--section3">
                                              {process.is_detached ? (
                                                <div>
                                                  <img src={Lock} alt="menu" />
                                                </div>
                                              ) : null}

                                              {process.warnings ? (
                                                <aside></aside>
                                              ) : (
                                                <div
                                                  style={{ backgroundColor: 'transparent' }}
                                                ></div>
                                              )}

                                              <span
                                                style={
                                                  process.done
                                                    ? { color: '#d6d6d6' }
                                                    : { color: hexToRgba(process.color, '1') }
                                                }
                                              >
                                                {process.finished + '/' + process.quantity}
                                              </span>
                                            </section>
                                          </div>
                                          <div
                                            style={{
                                              display: 'none',
                                              transform: `translateX(${getPosition(
                                                info_popup_position,
                                                process.process_date,
                                              )}%)`,
                                            }}
                                            className="info--popup"
                                            id={process._id}
                                          >
                                            <InformationPopup
                                              process={process}
                                              popupId={process._id}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </Draggable>
                                  );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}

export default WeeklyCalendar;
