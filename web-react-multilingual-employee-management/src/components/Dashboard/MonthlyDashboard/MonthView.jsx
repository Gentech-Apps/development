import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
//sass
import '../../../sass/montlyDashboard/_month-view-page.scss';
//components
import Calendar from './parts/Calendar/Calendar';
import Completions from './parts/Completions/Completions';
import UpdateProccessPopup from '../../updatePopups/UpdateProccessPopup';
import OnDragPopup from '../../updatePopups/OnDragPopup';
import SpreadingPopup from '../../updatePopups/SpreadingPopup';
import ReasonPopup from '../../updatePopups/ReasonPopup';
//functions
import {
  appGetOrders,
  montlyUpdateOrders,
  montlyUpdateOrdersForConst,
  updateProcess,
  getWarnings,
  setEndDateForProcess,
  getStartAndEndDatesForProcess,
} from '../../../functions/api/orders';
import {
  replaceProcessInState,
  removeFractionsOnBacklogDrag,
  removeBacklogDuplications,
} from './MonthViewFunctions';
import { isSameDay } from '../../../functions/general/general';
//api calls
import { generalGetRequest } from '../../../functions/api/general';
//external variables
import ConstantPopup from '../../updatePopups/ConstantPopup';
import jwt_decode from 'jwt-decode';
import { PER_USER, VIEW_ONLY, NO_FINANCIALS } from '../../../tools/keys/variables';
import * as momentBusinessDays from 'moment-business-days';
import LoaderNew from '../../LoaderNew/Loader';
import { mobileMaxWidth } from '../../../constants/responsive-pop-up';
import {
  calculateEndDateAccordingToDuration,
  closePopupOnBackButton,
  dateMatch,
} from '../../../hooks/helper';
momentBusinessDays.updateLocale('us', {
  workingWeekdays: [0, 1, 2, 3, 4],
});

class MonthView extends Component {
  constructor() {
    super();

    this.state = {
      counter: 0,
      page: 0,
      stopApi: false,
      orders: [],
      currentDate: moment().startOf('week'),
      datesArray: [],
      prevState: [],
      popup: false,
      updateApiBody: null,
      errPopupState: null,
      updateProcessPopup: false,
      spreadingPopup: false,
      selectedProcess: {},
      warnings: [],
      loader: false,
      reasonPopup: false,
      spreadingBodyData: {},
      constant_spred: false,
      simpleDateArray1: [],
      simpleDateArray: [],
      z_index: [],
    };
    window.onpopstate = (event) =>
      closePopupOnBackButton(this.state.updateProcessPopup, (data) => {
        data && this.closeUpdateMenu();
      });
  }

  componentWillMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname); // to update the location path in the header tabs
    // dynamic factory name in url
    const dynamicFactoryName = this.props.login.user.factory_name;
    let initDate = this.props.match.params.date;

    if (!initDate) {
      let searchQuery = window.location.search;
      this.props.history.push(
        `/${dynamicFactoryName}/monthly/${this.state.currentDate}${searchQuery ? searchQuery : ''}`,
      );
      // this.props.history.push(`/${dynamicFactoryName}/monthly/${this.state.currentDate}`)
      this.initializeData();
    } else {
      this.setState(
        {
          currentDate: moment(initDate).startOf('week'),
        },
        () => {
          this.initializeData();
        },
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.updateProcessPopup !== this.state.updateProcessPopup ||
      this.state.loader !== nextState.loader ||
      this.state.datesArray !== nextState.datesArray ||
      nextProps != this.props ||
      nextState.popup !== this.state.popup ||
      nextState.spreadingPopup !== this.state.spreadingPopup
    )
      return true;
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.login.lastAddedOrderId !== nextProps.login.lastAddedOrderId) {
      this.initializeData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.process.show_bids !== prevProps.process.show_bids ||
      prevProps.location.search !== this.props.location.search ||
      JSON.stringify(prevProps.login.selectedDepartment) !==
        JSON.stringify(this.props.login.selectedDepartment) ||
      JSON.stringify(prevProps.login.selectedManager) !==
        JSON.stringify(this.props.login.selectedManager) ||
      prevProps.login.selectedUser !== this.props.login.selectedUser
    ) {
      this.initializeData();
    }

    if (
      prevProps.mainPopup.eddited_order_id !== this.props.mainPopup.eddited_order_id &&
      this.props.mainPopup.eddited_order_id
    )
      this.repositionConstantAfterEditInPopup(this.props.mainPopup);
  }

  repositionConstantAfterEditInPopup = async (information) => {
    if (
      isSameDay(
        new Date(information.order_data.due_date),
        new Date(information.new_due_date_after_edit_from_reservation_popup),
      )
    )
      return;

    //open the popup here
    this.props.updateConstantPopup(true);

    //api call to retrieve last process
    let res = await generalGetRequest(
      `/system/order-process/get-last-order-process?order_id=${information.order_id}`,
    );

    let selectedProcess = {
      _id: res.result._id,
      order_number: information.order_data.order_number,
      order_id: information.order_id,
      due_date: new Date(information.order_data.due_date),
      date: new Date(information.new_due_date_after_edit_from_reservation_popup),
      client_name: information.order_data.client_name,
      warnings: [],
      process: res.result,
    };

    this.setState({
      updateApiBody: selectedProcess,
      spreadingBodyData: selectedProcess,
    });
  };

  updateConstantToSpred = (boolean) => {
    this.setState({
      constant_spred: boolean,
    });
  };

  deleteBacklogsDuplications = (process) => {
    let newState = removeBacklogDuplications(process, this.state.datesArray);
    this.setState({ datesArray: newState });
  };

  initializeData = async () => {
    if (!this.state.spreadingPopup) this.setState({ loader: true });
    this.buildWorkingDatesArray(this.state.currentDate);
    //set loader if spread popup is closed only
    let from = this.state.currentDate._d;
    let from2 = new Date(from).toISOString();
    let to = moment(this.state.currentDate).add(28, 'days')._d;
    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager._id;
    let started = this.props.process.show_bids;
    const user_id = jwt_decode(this.props.login.user.token)._id;
    const selectedUser = this.props.login.user.privileges.includes(PER_USER)
      ? user_id
      : this.props.login.selectedUser;
    let apiOrders = await appGetOrders(
      from,
      to,
      'L',
      urlOrderNumber,
      selectedDepartment,
      employee_id,
      started,
      selectedUser,
    );

    this.setState(
      {
        orders: apiOrders,
      },
      () => {
        //building dates data array to show on interface

        let datesArray = this.buildDatesArray(this.state.currentDate);
        this.setState({ datesArray, loader: false }, () => this.prepareSimpleDateArray());

        this.props.setCsvMonthly(datesArray);
      },
    );

    // set api data to redux for order adding api call to add order that was added to UI
    let addOrderApiPayload = {
      from,
      to,
      view: 'L',
      department_id: this.props.login.selectedDepartment
        ? this.props.login.selectedDepartment._id
        : null,
    };
    this.props.setAddOrderPayload(addOrderApiPayload);
  };

  getProcessById = async (process) => {
    const response = await generalGetRequest(
      `/system/order-process/get-by-id?_id=${process._id}&start_date=${process.process_date}`,
    );
    return response;
  };

  fourWeeksDateChange = (operator) => {
    this.setState({ stopApi: false, orders: [], from: false, to: false, counter: 0 }, () => {
      if (operator === 'inc') {
        this.setState(
          (prevState) => ({
            currentDate: prevState.currentDate.add(28, 'day'),
            loader: true,
          }),
          async () => {
            // dynamic factory name in url
            const dynamicFactoryName = this.props.login.user.factory_name;
            let searchQuery = window.location.search;
            this.props.history.push(
              `/${dynamicFactoryName}/monthly/${this.state.currentDate}${
                searchQuery ? searchQuery : ''
              }`,
            );
            this.initializeData();
          },
        );
      } else {
        this.setState(
          (prevState) => ({
            currentDate: prevState.currentDate.subtract(28, 'day'),
            loader: true,
          }),
          async () => {
            // dynamic factory name in url
            const dynamicFactoryName = this.props.login.user.factory_name;
            let searchQuery = window.location.search;
            this.props.history.push(
              `/${dynamicFactoryName}/monthly/${this.state.currentDate}${
                searchQuery ? searchQuery : ''
              }`,
            );
            this.initializeData();
          },
        );
      }
    });
  };

  buildWorkingDatesArray = (date) => {
    let holidayDatesArray = this.props.login.user.holidays.map((item) =>
      moment(item.date).format('DD/MM/YYYY'),
    );
    let daysOffArray = this.props.login.user.off_days.map((item) => item);
    let simpleDateArrayLocal = [];
    let weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    for (let i = 0; i < 28; i++) {
      let incrementedDate = moment(date).add(i, 'days');
      let dayData = [];
      let holidayIndex = -1;
      let holiday = false;
      let dayOff = false;

      for (let j = 0; j < holidayDatesArray.length; j++) {
        if (holidayDatesArray[j] === incrementedDate.format('DD/MM/YYYY')) {
          holidayIndex = j;
          holiday = true;
          break;
        }
      }

      for (let j = 0; j < daysOffArray.length; j++) {
        if (daysOffArray[j] === moment(incrementedDate).day()) {
          dayOff = true;
          break;
        }
      }

      if (!holiday && !dayOff)
        simpleDateArrayLocal.push(
          new Date(moment(incrementedDate).add(1, 'days')._d).toISOString().split('T')[0],
        );
    }
    this.setState({
      simpleDateArray1: [],
      simpleDateArray1: simpleDateArrayLocal,
    });
  };

  resetSimpleDateArray = () => {
    this.setState({
      simpleDateArray: [],
      simpleDateArray1: [],
    });
  };

  prepareSimpleDateArray = () => {
    this.resetSimpleDateArray();
    if (this.state.datesArray.length > 0) {
      let _simple_date_Array = [];
      var that = this;
      that.state.datesArray.map((day) => {
        if (!day.dayOff && !_simple_date_Array.includes(day.parsedDate)) {
          _simple_date_Array.push(day.parsedDate);
        }
      });
      let _z_index = this.findHoliday(_simple_date_Array);
      this.setState({
        simpleDateArray: _simple_date_Array,
        z_index: _z_index,
      });
    }
  };

  findHoliday = (simple_date) => {
    const { off_days, holidays } = this.props.login.user;
    let year = new Date(this.state.currentDate._d).getFullYear();
    let month = new Date(this.state.currentDate._d).getMonth();
    const holidayArray = holidays.map((item) => {
      if (new Date(item.date).getFullYear() === year && new Date(item.date).getMonth() === month)
        return moment(item.date).format('DD/MM/YYYY');
    });
    const z_index = [];
    simple_date.map((item, index) => {
      if (index % 5 === 0) {
        if (holidayArray.includes(item)) {
          let increase = 0;
          for (let i = index; i <= index + 4; i++) {
            if (!holidayArray.includes(simple_date[i])) {
              z_index.push(index + increase);
              return;
            }
            increase++;
          }
        } else {
          z_index.push(index);
        }
      }
    });
    return z_index;
  };

  buildDatesArray = (date) => {
    let holidayDatesArray = this.props.login.user.holidays.map((item) =>
      moment(item.date).format('DD/MM/YYYY'),
    );
    let daysOffArray = this.props.login.user.off_days.map((item) => item);
    let newDateDataArray = [];
    let weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    for (let i = 0; i < 28; i++) {
      let incrementedDate = moment(date).add(i, 'days');
      let dayData = [];
      let holidayIndex = -1;
      let dayOff = false;

      this.state.orders.map((order) => {
        order.processes.map((proccess, index) => {
          if (
            (this.checkIfSameDay(proccess.process_date, incrementedDate._d) && !proccess.backlog) ||
            (proccess.backlog && this.checkIfSameDay(incrementedDate._d, moment(date)._d))
          ) {
            dayData.push({
              order_number: proccess.order_number,
              order_id: proccess.order_id,
              due_date: proccess.due_date,
              client_name: proccess.client_name,
              warnings: proccess.warnings,
              proccess: { ...proccess },
              // address: proccess.address,
              // city: proccess.city
            });
          }
        });
      });

      for (let j = 0; j < holidayDatesArray.length; j++) {
        if (holidayDatesArray[j] === incrementedDate.format('DD/MM/YYYY')) {
          holidayIndex = j;
        }
      }

      for (let j = 0; j < daysOffArray.length; j++) {
        if (daysOffArray[j] === moment(incrementedDate).day()) {
          dayOff = true;
        }
      }
      newDateDataArray.push({
        date: JSON.parse(JSON.stringify(incrementedDate._d)),
        parsedDate: incrementedDate.format('DD/MM/YYYY'),
        // dateName: incrementedDate.format('dddd'),
        dateName: weekDays[incrementedDate.day()]
          ? weekDays[incrementedDate.day()]
          : incrementedDate.format('dddd'),
        holiday: holidayIndex !== -1 ? this.props.login.user.holidays[holidayIndex] : null,
        dayOff,
        dayData,
      });
    }
    // sort the array moving all backlog = tru to the end to not interfare with dnd indexs
    newDateDataArray = newDateDataArray.map((item) => {
      let newItemDayData = item.dayData.sort((x, y) => {
        return x.proccess.backlog === y.proccess.backlog ? 0 : x.proccess.backlog ? 1 : -1;
      });
      item.dayData = newItemDayData;
      return item;
    });

    return newDateDataArray;
  };

  checkIfSameDay = (d1, d2) => {
    let dateOne = new Date(d1);
    let dateTwo = new Date(d2);
    return (
      dateOne.getFullYear() === dateTwo.getFullYear() &&
      dateOne.getMonth() === dateTwo.getMonth() &&
      dateOne.getDate() === dateTwo.getDate()
    );
  };

  handlePopupChoice = async (param, constantData = false, spreading = false) => {
    let { constant_spred } = this.state;

    //init body for endDate call
    let newBody;

    if (param === 'yes') {
      newBody = {
        _id: this.state.updateApiBody.process.original || this.state.updateApiBody._id,
        date: this.state.updateApiBody.endDate,
        view: this.state.updateApiBody.view,
        from: this.state.updateApiBody.from,
        to: this.state.updateApiBody.to,
        order_employee_id: null,
        department_id: this.props.login.selectedDepartment._id,
      };
    }
    //
    if (param === 'yes') {
      this.setState({ spreadingPopup: false, reasonPopup: false, loader: true });

      if (this.state.updateApiBody.toBacklog) {
        let res = await updateProcess(this.state.updateApiBody.process);
        if (res.ok) {
          this.setState({ popup: false, loader: false }, () => {
            //change to local removal of fractions instead of fetching from db
            let datesArray = removeFractionsOnBacklogDrag(
              this.state.updateApiBody.process,
              this.state.datesArray,
            );
            this.setState({ datesArray });
          });
        }

        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.setState(
              { counter: 0, orders: [], stopApi: false, from: null, to: null },
              async () => {
                typeof res2.result != 'string' && (await this.initializeData());
              },
            );
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }

        return;
      }

      let res = { ok: false };
      let is_same_date;

      // old- constant change:
      if (this.state.updateApiBody.process.constant && !constant_spred) {
        let body = { ...this.state.updateApiBody };
        if (constantData) {
          body.reason = constantData.reason.value;
          body.approved_by = constantData.approveName.value;
        }

        res = await montlyUpdateOrdersForConst(body, this.props.login.selectedDepartment._id);

        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.setState(
              { counter: 0, orders: [], stopApi: false, from: null, to: null },
              async () => {
                await this.initializeData();
              },
            );
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }
      } else {
        let update_result = await updateProcess(this.state.updateApiBody.process);
        is_same_date =
          dateMatch(new Date(this.state.updateApiBody.process.process_date)) ===
          dateMatch(new Date(this.state.updateApiBody.date));
        !is_same_date &&
          (res = await montlyUpdateOrders(
            this.state.updateApiBody,
            spreading,
            this.props.login.selectedDepartment._id,
          ));
        this.updateConstantToSpred(false);
      }

      if (res.ok) {
        this.setState(
          { counter: 0, orders: [], stopApi: false, from: null, to: null },
          async () => {
            await this.initializeData();
          },
        );

        this.props.setCsvMonthly(this.state.datesArray);
        // this.setState({loader:false})
      } else {
        this.setState({ errPopupState: res.result, loader: false, popup: !is_same_date });
      }
    } else {
      let prevState = this.state.prevState.map((item) => item);

      if (!prevState || prevState.length === 0)
        prevState = JSON.parse(JSON.stringify(this.state.datesArray));
      this.setState({ datesArray: prevState, popup: false, errPopupState: null, loader: false });
    }
    if (param == 'no') await this.initializeData();
  };

  onDragEnd = async (dndData) => {
    // cancel function if no drop deastination
    if (!dndData.destination || dndData.source.droppableId === dndData.destination.droppableId)
      return;

    // *********forbid move processes forvard for user with privileges 200 or 500
    // split column id "column-7" with "-" and get column number 7
    const getColumnNumber = (colId) => colId.split('-')[1];
    const destinationColNumber = getColumnNumber(dndData.destination.droppableId);
    const sourceColNumber = getColumnNumber(dndData.source.droppableId);
    const privileges = this.props.login.user.privileges;
    const isViewOnlyOrPerUser = privileges.find((privilege) => privilege === VIEW_ONLY);
    if (destinationColNumber > sourceColNumber && isViewOnlyOrPerUser) {
      return;
    }
    // *********************************************************************

    // declerations
    const { datesArray } = this.state;
    let daySrcIndex, dayDestIndex;
    //clone original array and making date obj to moment obj back again (was modified in json parse)
    let datesArrayCopy = JSON.parse(JSON.stringify(datesArray));

    this.setState({ loader: true });
    //search source in dataArray (fit to explorer)
    for (let i = 0; i < datesArrayCopy.length; i++) {
      if (datesArrayCopy[i].parsedDate === dndData.source.droppableId) {
        daySrcIndex = i;
        if (daySrcIndex && dayDestIndex) break;
      }

      if (datesArrayCopy[i].parsedDate === dndData.destination.droppableId) {
        dayDestIndex = i;
        if (daySrcIndex && dayDestIndex) break;
      }
    }
    // ---------------------------------------------------------------------------------------------------------------------------------------
    // get process or fractional process start and end date

    // create body to send to API
    let destination_date = moment(dndData.destination.droppableId, 'DD-MM-YYYY').isValid()
      ? moment(dndData.destination.droppableId, 'DD-MM-YYYY')._d
      : moment(dndData.source.droppableId, 'DD-MM-YYYY')._d;
    let current_process = datesArrayCopy
      .map((item) =>
        item.dayData.filter((subitem) => {
          return subitem.proccess._id === dndData.draggableId;
        }),
      )
      .filter((item) => item.length > 0)[0][0].proccess;
    let user_curr = this.props.login.user;
    let body = {
      order_id:
        dndData.source.droppableId === 'completions__droppable'
          ? null
          : datesArrayCopy[daySrcIndex].dayData[dndData.source.index].order_id || null,
      _id: dndData.draggableId,
      date: destination_date,
      from: moment(this.state.currentDate)._d,
      to: moment(this.state.currentDate).add(28, 'days')._d,
      view: 'L',
      toBacklog: dndData.destination.droppableId === 'completions__droppable' ? true : false,
      process: current_process,
      endDate: calculateEndDateAccordingToDuration(
        undefined,
        current_process,
        user_curr,
        destination_date,
        current_process.original_duration,
      ),
    };
    //search order_id in case source index is in completions
    if (!body.order_id)
      datesArrayCopy.map((day) => {
        day.dayData.map((proccess) => {
          if (proccess.proccess._id === dndData.draggableId) body.order_id = proccess.order_id;
        });
      });

    this.setState({ updateApiBody: body });

    //handle situation when deastination of drag element in completions (to completions)
    if (dndData.destination.droppableId === 'completions__droppable') {
      this.setState(
        {
          prevState: this.state.datesArray,
        },
        async () => {
          this.setState({ datesArray: datesArrayCopy });

          let originalId;
          datesArrayCopy[daySrcIndex].dayData.map((item) => {
            if (item.proccess._id === dndData.draggableId) {
              item.proccess.backlog = true;
              originalId = item.proccess.hasOwnProperty('original')
                ? item.proccess.original
                : item.proccess._id;
              if (originalId) {
                // reset end date and set id to original id
                item.proccess._id = originalId;
              }
            }
          });
          // let originalId = datesArrayCopy[daySrcIndex].dayData[dndData.source.index].proccess.original
          if (originalId) {
            // reset end date and set id to original id

            await setEndDateForProcess(body);
          }

          //check for warnings
          let warningsApi = await getWarnings(body);

          if (warningsApi.ok && !body.process.constant) {
            if (warningsApi.result.length > 0) {
              this.setState({ popup: true, loader: false, warnings: warningsApi.result });
            } else {
              this.handlePopupChoice('yes', true);
            }
          } else {
            this.setState({ popup: true, loader: false, errPopupState: warningsApi.result });
          }
        },
      );

      return;
    }

    //handle situation when source of drag element in completions (to table)
    if (dndData.source.droppableId === 'completions__droppable') {
      let indexesArray = datesArrayCopy.map((item, indexInDay) => {
        return item.dayData.map((data, indexInProccess) => {
          if (data.proccess._id === dndData.draggableId) return [indexInDay, indexInProccess];
        });
      });

      indexesArray = [].concat.apply([], indexesArray).filter((item) => item)[0];

      //get item to push
      let valueToPush = { ...datesArrayCopy[indexesArray[0]].dayData[indexesArray[1]] };
      valueToPush.proccess.backlog = false;
      //remove item from source position
      datesArrayCopy[indexesArray[0]].dayData.splice(indexesArray[1], 1);
      // add item to new destination
      datesArrayCopy.map((item, indexInDay) => {
        if (item.parsedDate === dndData.destination.droppableId) {
          item.dayData.splice(dndData.destination.index, 0, valueToPush);
        }
      });
      //save prevstate to revert in the future
      this.setState(
        {
          prevState: this.state.datesArray,
        },
        async () => {
          this.setState({ datesArray: datesArrayCopy });
          let warningsApi = await getWarnings(body);
          if (warningsApi.ok && !body.process.constant) {
            if (warningsApi.result.length > 0) {
              this.setState({ popup: true, loader: false, warnings: warningsApi.result });
            } else {
              this.handlePopupChoice('yes', true);
            }
          } else {
            this.setState({ popup: true, loader: false, errPopupState: warningsApi.result });
          }
        },
      );
      return;
    }

    // get item to push to new state
    let valueToPush = datesArrayCopy[daySrcIndex].dayData.filter((item, index) => {
      return dndData.source.index === index;
    })[0];

    //push item to its new place
    datesArrayCopy[dayDestIndex].dayData.splice(dndData.destination.index, 0, valueToPush);
    //remove item from source in array in order to push it to its new location according to DND
    datesArrayCopy[daySrcIndex].dayData.splice(dndData.source.index, 1);

    // sort the array moving all backlog = tru to the end to not interfare with dnd indexs
    datesArrayCopy = datesArrayCopy.map((item) => {
      let newItemDayData = item.dayData.sort((x, y) => {
        return x.proccess.backlog === y.proccess.backlog ? 0 : x.proccess.backlog ? 1 : -1;
      });
      item.dayData = newItemDayData;
      return item;
    });

    //save prevstate to revert if user clicks cancel
    this.setState(
      {
        prevState: this.state.datesArray,
      },
      () => {
        this.setState({ datesArray: datesArrayCopy });
      },
    );

    //check if spreading popup activation is set
    if (this.props.login.popupActivation && !body.process.constant && !body.process.is_detached) {
      // check if date difrence is week or less dont show spread popup (init spread false automaticly)
      let movedToDate = moment(body.date).set({ hour: 14, minute: 0, second: 0 }).toDate();
      let currentDate = moment(body.process.process_date)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      let diff = moment(movedToDate).diff(currentDate, 'days');
      if (Math.abs(diff) < 7) {
        this.spreadingFalse();
      } else {
        this.setState({ spreadingPopup: true, spreadingBodyData: body, loader: false });
      }
    } else {
      //check for warnings
      let warningsApi = await getWarnings(body);

      if (warningsApi.ok) {
        if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
          this.setState({ popup: true, loader: false, warnings: warningsApi.result });
        } else {
          if (body.process.constant) {
            //old constant change
            // this.setState({popup:true, loader:false})

            //new constant change
            this.props.updateConstantPopup(true);
            this.setState({ loader: false, spreadingBodyData: body });
          } else {
            this.handlePopupChoice('yes');
          }
        }
      } else {
        this.setState({ popup: true, loader: false, errPopupState: warningsApi.result });
      }
    }
  };
  //new for constant change -
  resetReposition = () => {
    this.setState({ popup: true });
  };

  spreadingFalse = async () => {
    this.setState({ loader: true, spreadingPopup: false });
    let body = { ...this.state.spreadingBodyData };
    let warningsApi = await getWarnings(body);

    if (warningsApi.ok) {
      //check for warnings
      let warningsApi = await getWarnings(body);
      if (warningsApi.ok) {
        if (warningsApi.result.length > 0) {
          this.setState({
            popup: true,
            loader: false,
            warnings: warningsApi.result,
            spreadingPopup: false,
          });
        } else {
          this.handlePopupChoice('yes');
        }
      } else {
        this.setState({
          popup: true,
          loader: false,
          errPopupState: warningsApi.result,
          spreadingPopup: false,
        });
      }
    } else {
      this.setState({
        popup: true,
        loader: false,
        errPopupState: warningsApi.result,
        spreadingPopup: false,
      });
    }
  };

  spreadingTrue = async () => {
    const { spreadingBodyData } = this.state;

    if (
      moment(spreadingBodyData.date).isSameOrBefore(moment(spreadingBodyData.process.process_date))
    ) {
      this.setState({ loader: true, spreadingPopup: false });
      //check for warnings
      let warningsApi = await getWarnings(spreadingBodyData, true);
      if (warningsApi.ok) {
        if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
          this.setState({ popup: true, loader: false, warnings: warningsApi.result });
        } else {
          this.handlePopupChoice('yes', false, true);
        }
      } else {
        this.setState({ popup: true, loader: false, errPopupState: warningsApi.result });
      }
    } else {
      if (this.props.login.user.reason_popup) {
        this.updateWarningPopup(true);
      } else {
        this.handlePopupChoice('yes');
        this.setState({ popup: false, spreadingPopup: false });
      }
    }
  };

  handleSpreadWithReason = async (data) => {
    let body = { ...this.state.spreadingBodyData };
    body.reason = data.reason.value;
    body.approved_by = data.approveName.value;
    //check for warnings

    let warningsApi = await getWarnings(body, true);
    if (warningsApi.ok) {
      if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
        this.setState({
          popup: true,
          loader: false,
          warnings: warningsApi.result,
          reasonPopup: false,
        });
      } else {
        this.setState({ updateApiBody: body, reasonPopup: false }, () => {
          this.handlePopupChoice('yes', false, true);
        });
      }
    } else {
      this.setState({
        popup: true,
        loader: false,
        errPopupState: warningsApi.result,
        reasonPopup: false,
      });
    }
  };

  cancelReasonPopup = () => {
    let datesArrayCopy = JSON.parse(JSON.stringify(this.state.prevState));
    this.setState({ reasonPopup: false, datesArray: datesArrayCopy });
  };

  closeUpdateMenu = () => {
    this.setState({
      updateProcessPopup: false,
      selectedProcess: {},
    });
  };

  submitUpdatesFromPopup = async (body, constant, refetchData, newProcess = null) => {
    let newBody = {
      _id: body._id,
      date: body.endDate,
      view: body.view,
      from: body.from,
      to: body.to,
      order_employee_id: null,
      department_id: this.props.login.selectedDepartment._id,
    };
    //if date didnt change dont reposition
    if (moment(body.date).isSame(moment(body.process.process_date))) {
      if (newBody.date) {
        let res2 = await setEndDateForProcess(newBody);

        if (res2.ok) {
          this.initializeData();
        } else {
          this.setState({ errPopupState: res2.result, popup: true });
        }
      }

      this.setState({ loader: false, updateProcessPopup: false }, () => {
        if (newProcess) {
          let newState = replaceProcessInState(newProcess, this.state.datesArray);
          this.setState({ datesArray: newState });
        }

        if (refetchData) this.initializeData();
      });
      return;
    }

    //if the date is changed ---> constant popup

    let res;
    if (constant) {
      //constant handler
      let warningRes = await getWarnings(body);
      if (warningRes.ok) {
        if (warningRes.result.length > 0) {
          this.setState({
            popup: true,
            updateApiBody: body,
            updateProcessPopup: false,
            warnings: warningRes.result,
          });
        } else {
          this.setState({
            spreadingBodyData: body,
            updateApiBody: body,
            updateProcessPopup: false,
          });
          this.props.updateConstantPopup(true);
        }
      } else {
        let datesArrayCopy = JSON.parse(JSON.stringify(this.state.datesArray));
        this.setState({
          errPopupState: res.result,
          popup: true,
          updateApiBody: body,
          prevState: datesArrayCopy,
          updateProcessPopup: false,
        });
      }
    } else {
      //not constant handler
      let movedToDate = moment(body.date).set({ hour: 14, minute: 0, second: 0 }).toDate();
      let currentDate = moment(body.process.process_date)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      let diff = moment(movedToDate).diff(currentDate, 'days');
      if (Math.abs(diff) < 7) {
        this.setState(
          { spreadingBodyData: body, updateApiBody: body, updateProcessPopup: false },
          () => {
            this.spreadingFalse();
          },
        );
      } else {
        this.setState({
          spreadingPopup: true,
          spreadingBodyData: body,
          updateApiBody: body,
          updateProcessPopup: false,
        });
      }
      return;
    }
  };

  initProccessUpdatePopup = (data, date) => {
    let body = {
      from: moment(this.state.currentDate)._d,
      to: moment(this.state.currentDate).add(28, 'days')._d,
      view: 'L',
      toBacklog: false,
      order_id: data.order_id,
      _id: data.proccess._id,
      process: data.proccess,
      date,
    };
    this.setState(
      {
        selectedProcess: data,
      },
      () => {
        this.setState({ updateProcessPopup: true });
      },
    );
  };

  saveNewSelectedProcess = (process) => {
    let selectedProcess = { ...this.state.selectedProcess };
    selectedProcess.proccess = { ...process };
    this.setState({
      selectedProcess,
    });
  };

  cancleSpreading = () => {
    let prevState = JSON.parse(JSON.stringify(this.state.prevState));
    if (prevState && prevState.length > 0) {
      this.setState({ spreadingPopup: false, datesArray: prevState });
    } else {
      this.setState({ spreadingPopup: false });
    }
    this.props.updateConstantPopup(false);
  };

  backToToday = () => {
    this.setState({ stopApi: false, orders: [], from: false, to: false, counter: 0 });
    // dynamic factory name in url
    const dynamicFactoryName = this.props.login.user.factory_name;
    let search = window.location.search;
    this.props.history.push(
      `/${dynamicFactoryName}/monthly/${moment().toDate()}${search ? search : ''}`,
    );
    this.setState({ currentDate: moment().startOf('week') }, () => {
      this.initializeData();
    });
  };

  updateWarningPopup = (value) => this.setState({ popup: value });

  render() {
    const {
      currentDate,
      orders,
      datesArray,
      popup,
      errPopupState,
      updateProcessPopup,
      selectedProcess,
      loader,
      warnings,
      spreadingPopup,
      counter,
      simpleDateArray,
      z_index,
    } = this.state;
    const { off_days, holidays, popupActivation } = this.props.login.user;

    let disableDrag =
      this.props.login &&
      Object.keys(this.props.login.user).length > 0 &&
      this.props.login.user.privileges.includes(PER_USER)
        ? true
        : false;
    const dynamicFactoryName = this.props.login.user.factory_name;
    const user_or_order_type = this.props.login.user.select_order_process_color_by;
    return (
      <div className="month-view-page">
        {loader ? <LoaderNew /> : null}

        {spreadingPopup ? (
          <SpreadingPopup
            spreadingFalse={this.spreadingFalse}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
          />
        ) : null}

        {updateProcessPopup ? (
          <UpdateProccessPopup
            warningApiPayload={this.state.updateApiBody}
            selectedProcess={selectedProcess}
            view={'L'}
            closeUpdateMenu={this.closeUpdateMenu}
            submitUpdatesFromPopup={this.submitUpdatesFromPopup}
            offDays={off_days}
            holidays={holidays}
            saveNewSelectedProcess={this.saveNewSelectedProcess}
            deleteBacklogsDuplications={this.deleteBacklogsDuplications}
          />
        ) : null}

        {popup ? (
          <OnDragPopup
            afterConfirmationError={errPopupState}
            popupActionHandler={this.handlePopupChoice}
            warningApiPayload={this.state.updateApiBody}
            warnings={warnings}
          />
        ) : null}

        {this.props.orders.constant_popup ? (
          <ConstantPopup
            updateConstantToSpred={this.updateConstantToSpred}
            resetReposition={this.resetReposition}
            spreadingFalse={this.spreadingFalse}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
            popupActionHandler={this.handlePopupChoice}
            handleWarningPopup={this.updateWarningPopup}
          />
        ) : null}

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Calendar
            initProccessUpdatePopup={this.initProccessUpdatePopup}
            datesArray={datesArray}
            checkIfSameDay={this.checkIfSameDay}
            currentSelectedDate={currentDate}
            buildDatesArray={this.buildDatesArray}
            fourWeeksDateChange={this.fourWeeksDateChange}
            orders={orders}
            loader={loader}
            daysOffNumber={off_days ? off_days.length : 0}
            daysOff={off_days}
            disableDrag={disableDrag}
            backToToday={this.backToToday}
            isCurrentProcess={this.props.process.show_first_uncomplete_process}
            factoryName={dynamicFactoryName}
            weeksLoader={counter}
            userData={this.props.login.user}
            simpleDateArray={simpleDateArray}
            z_index={z_index}
            user_or_order_type={user_or_order_type}
          />

          <Completions
            initProccessUpdatePopup={this.initProccessUpdatePopup}
            datesArray={datesArray}
            buildDatesArray={this.buildDatesArray}
            orders={orders}
            daysOffNumber={off_days ? off_days.length : 0}
          />
        </DragDropContext>
      </div>
    );
  }
}

function mapStateToProps({ login, process, orders, mainPopup }) {
  return { login, process, orders, mainPopup };
}
export default withRouter(connect(mapStateToProps, actions)(MonthView));
