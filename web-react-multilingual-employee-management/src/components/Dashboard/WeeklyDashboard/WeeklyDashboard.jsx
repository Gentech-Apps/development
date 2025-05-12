import React, { Component } from 'react';
import moment from 'moment';
import { DragDropContext } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import '../../../sass/weeklyDashboard/_weekly-dashboard.scss';
//components
import WeeklyCalendar from './parts/WeeklyCalendar';
import WeeklyCompletions from './parts/WeeklyCompletions';
import UpdateProccessPopup from '../../updatePopups/UpdateProccessPopup';
import OnDragPopup from '../../updatePopups/OnDragPopup';
import SpreadingPopup from '../../updatePopups/SpreadingPopup';
import ReasonPopup from '../../updatePopups/ReasonPopup';
import LoaderNew from '../../LoaderNew/Loader';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
// functions
import {
  appGetOrders,
  getWarnings,
  updateProcess,
  montlyUpdateOrders,
  montlyUpdateOrdersForConst,
  setEndDateForProcess,
} from '../../../functions/api/orders';
import {
  replaceProcessInState,
  findOriginalProcess,
  removeFractionsOnBacklogDrag,
  removeBacklogDuplications,
  buildCountingObj,
} from './WeeklyDashboardFunctions';
//external variables
import { PER_USER, VIEW_ONLY } from '../../../tools/keys/variables';
import ConstantPopup from '../../updatePopups/ConstantPopup';
import jwt_decode from 'jwt-decode';
import { isSameDay } from '../../../functions/general/general';
//api calls
import { generalGetRequest } from '../../../functions/api/general';
import { closePopupOnBackButton } from '../../../hooks/helper';

class WeeklyDashboard extends Component {
  constructor() {
    super();

    this.state = {
      currentDate: moment(),
      daysArray: [],
      weeklyOrders: [],
      updateProcessPopup: false,
      popup: false,
      errPopupState: null,
      warnings: [],
      updateApiBody: {},
      prevState: [],
      spreadingPopup: false,
      reasonPopup: false,
      loader: false,
      constant_spred: false,
    };
    window.onpopstate = (event) =>
      closePopupOnBackButton(this.state.updateProcessPopup, (data) => {
        data && this.closeUpdateMenu();
      });
  }

  componentWillMount() {
    let initDate = this.props.match.params.date;
    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    if (!initDate) {
      this.props.history.push(
        `/${dynamicFactoryName}/weekly/${this.state.currentDate}${window.location.search}`,
      );
      this.buildDays();
      this.getProcesses();
    } else {
      this.setState(
        {
          currentDate: moment(initDate),
        },
        () => {
          this.buildDays();
          this.getProcesses();
        },
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.login.lastAddedOrderId !== nextProps.login.lastAddedOrderId) {
      this.buildDays();
      this.getProcesses();
    }
  }

  componentDidMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname); // to update the location path in the header tabs
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
      this.buildDays();
      this.getProcesses();
    }

    const previousEditedOrderId = prevProps.mainPopup.eddited_order_id;
    const currentEditedOrderId = this.props.mainPopup.eddited_order_id;
    if (currentEditedOrderId && currentEditedOrderId !== previousEditedOrderId) {
      this.repositionAfterEditInPopup(this.props.mainPopup);
    }
  }

  repositionAfterEditInPopup = async (information) => {
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

  deleteBacklogsDuplications = (process) => {
    let newState = removeBacklogDuplications(process, this.state.weeklyOrders);
    this.setState({ weeklyOrders: newState });
  };

  updateConstantToSpred = (boolean) => {
    this.setState({
      constant_spred: boolean,
    });
  };

  getProcesses = async () => {
    if (!this.state.spreadingPopup)
      setTimeout(() => {
        this.setState({ loader: true });
      }, 0);

    const { currentDate } = this.state;
    const { setCsvWeekDate } = this.props;

    let from = moment(currentDate).startOf('week')._d;
    let to = moment(currentDate).endOf('week')._d;
    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager._id;
    let started = this.props.process.show_bids;
    const user_id = jwt_decode(this.props.login.user.token)._id;
    let selectedUser = this.props.login.user.privileges.includes(PER_USER)
      ? user_id
      : this.props.login.selectedUser;

    let weeklyOrders = await appGetOrders(
      from,
      to,
      'M',
      urlOrderNumber,
      selectedDepartment,
      employee_id,
      started,
      selectedUser,
    );

    weeklyOrders.map((process, index) => {
      let processesHolder = process.processes.map((item) => item);
      weeklyOrders[index].processes = [[], [], [], [], [], [], []];
      processesHolder.map((holderItem) => {
        let indexToPush = moment(holderItem.process_date).day();
        weeklyOrders[index].processes[indexToPush].push(holderItem);
      });

      let countingObj = buildCountingObj(weeklyOrders[index].processes);

      weeklyOrders[index].processes = weeklyOrders[index].processes.map((item) => {
        return item.sort((a, b) => {
          if (countingObj[a.original] < countingObj[b.original]) {
            return 1;
          }
          if (countingObj[a.original] > countingObj[b.original]) {
            return -1;
          } else {
            if (a.original < b.original) {
              return -1;
            }
            if (a.original > b.original) {
              return 1;
            }
            return 0;
          }
        });
      });
    });

    this.setState({ weeklyOrders, loader: false });
    setCsvWeekDate(weeklyOrders);
  };

  buildDays = () => {
    const { setCsvWeekHeaders } = this.props;
    const { currentDate, weeklyOrders } = this.state;

    let from = moment(currentDate).startOf('week')._d;
    let to = moment(currentDate).endOf('week')._d;
    let holidayDatesArray = this.props.login.user.holidays.map((item) => item);
    let daysArray = [];
    let weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

    for (let i = 0; i < 7; i++) {
      // let test = moment('04-10-2020 23:40 AM', 'MM-DD-YYYY hh:mm A')
      let date = moment(currentDate).startOf('week');
      let incrementedDate = moment(date).add(i, 'days');
      let offDay = false;
      let holidays = holidayDatesArray.filter((item) => {
        let condition = moment(item.date).isSame(incrementedDate, 'day');
        if (condition) return item;
      });

      for (let j = 0; j < this.props.login.user.off_days.length; j++) {
        if (this.props.login.user.off_days[j] === i) offDay = true;
      }

      daysArray.push({
        date: incrementedDate._d,
        parsedDate: moment(incrementedDate).format('DD/MM/YYYY'),
        // dateName: moment(incrementedDate).format('dddd'),
        dateName: weekDays[incrementedDate.day()]
          ? weekDays[incrementedDate.day()]
          : incrementedDate.format('dddd'),
        offDay,
        holidays,
      });
    }
    this.setState({ daysArray });
    setCsvWeekHeaders(daysArray);

    // set api data to redux for order adding api call to add order that was added to UI
    let addOrderApiPayload = {
      from,
      to,
      view: 'M',
      department_id: this.props.login.selectedDepartment
        ? this.props.login.selectedDepartment._id
        : null,
    };

    this.props.setAddOrderPayload(addOrderApiPayload);
  };

  weeksDateChange = (type) => {
    const { currentDate } = this.state;
    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;
    if (type === 'inc') {
      this.setState(
        {
          currentDate: moment(currentDate).add('days', 7),
          loader: true,
        },
        () => {
          let searchQuery = window.location.search;
          this.props.history.push(
            `/${dynamicFactoryName}/weekly/${this.state.currentDate}${
              searchQuery ? searchQuery : ''
            }`,
          );
          this.buildDays();
          this.getProcesses();
        },
      );
    } else if (type === 'dec') {
      this.setState(
        {
          currentDate: moment(currentDate).subtract('days', 7),
          loader: true,
        },
        () => {
          let searchQuery = window.location.search;
          this.props.history.push(
            `/${dynamicFactoryName}/weekly/${this.state.currentDate}${
              searchQuery ? searchQuery : ''
            }`,
          );
          this.buildDays();
          this.getProcesses();
        },
      );
    }
  };

  onDragEnd = async (dndData) => {
    // *********forbid move processes forvard for user with privileges 200 or 500
    // split column id "column-7" with "-" and get column number 7
    const getColumnNumber = (colId) => colId?.split('-')[1];
    const destinationColNumber = getColumnNumber(dndData?.destination?.droppableId);
    const sourceColNumber = getColumnNumber(dndData.source.droppableId);
    const privileges = this.props.login.user.privileges;
    const isViewOnlyOrPerUser = privileges.find(
      (privilege) => privilege === PER_USER || privilege === VIEW_ONLY,
    );
    if (destinationColNumber > sourceColNumber && isViewOnlyOrPerUser) {
      return;
    }
    // *********************************************************************

    if (dndData.destination == null) return;

    if (dndData.destination.droppableId === dndData.source.droppableId) return;

    if (
      dndData.source.droppableId !== 'completions__droppable' &&
      dndData.destination.droppableId !== 'completions__droppable' &&
      dndData.source.droppableId.replace(/[0-9]/g, '') !==
        dndData.destination.droppableId.replace(/[0-9]/g, '')
    )
      return;

    //declerations
    let weeklyOrdersCopyArray = this.state.weeklyOrders.map((item) => item);
    let prevState = JSON.parse(JSON.stringify(this.state.weeklyOrders));
    let sourcePosition;
    let destinationPosition;
    this.setState({ prevState });

    //get source position in big data array
    weeklyOrdersCopyArray.map((firstLvlItem, firstLvlIndex) => {
      firstLvlItem.processes.map((secondLvlItem, secondLvlIndex) => {
        secondLvlItem.map((thirdLvlItem, thirdLvlIndex) => {
          if (thirdLvlItem._id === dndData.draggableId)
            sourcePosition = [firstLvlIndex, secondLvlIndex, thirdLvlIndex];
        });
      });
    });

    //get destination position in big data array
    weeklyOrdersCopyArray.map((firstLvlItem, firstLvlIndex) => {
      firstLvlItem.processes.map((secondLvlItem, secondLvlIndex) => {
        secondLvlItem.map((thirdLvlItem, thirdLvlIndex) => {
          if (dndData.draggableId === thirdLvlItem._id) {
            if ((firstLvlItem._id, thirdLvlItem.process_id))
              destinationPosition = [
                firstLvlIndex,
                Number(dndData.destination.droppableId.replace(/\D/g, '')),
                dndData.destination.index,
              ];
          }
        });
      });
    });

    //remove item from array new position
    let itemToPush =
      weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]][sourcePosition[2]];
    //add item from to new position
    weeklyOrdersCopyArray[destinationPosition[0]].processes[destinationPosition[1]].splice(
      destinationPosition[2],
      0,
      itemToPush,
    );

    //init body for reposition api
    let body = {
      order_id: itemToPush.order_id,
      _id: dndData.draggableId,
      date:
        dndData.destination.droppableId === 'completions__droppable'
          ? moment(this.state.daysArray[Number(dndData.source.droppableId.replace(/\D/g, ''))].date)
              ._d
          : moment(
              this.state.daysArray[Number(dndData.destination.droppableId.replace(/\D/g, ''))].date,
            )._d,
      from: moment(this.state.daysArray[0].date)._d,
      to: moment(this.state.daysArray[this.state.daysArray.length - 1].date)._d,
      view: 'M',
      //
      process: itemToPush,
    };

    this.setState({ updateApiBody: body });

    //handle drop to completions
    if (dndData.destination.droppableId === 'completions__droppable') {
      //set original to backlog true
      weeklyOrdersCopyArray = findOriginalProcess(
        weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]][sourcePosition[2]],
        weeklyOrdersCopyArray,
      );

      //set body to api update
      body.process = {
        ...weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]][sourcePosition[2]],
      };
      body.toBackLog = true;
      body.process.backlog = true;

      // remove all fractions because process moved to backlog
      weeklyOrdersCopyArray = removeFractionsOnBacklogDrag(
        { ...body.process },
        weeklyOrdersCopyArray,
      );

      this.setState(
        {
          weeklyOrders: weeklyOrdersCopyArray,
          updateApiBody: body,
        },
        () => {
          this.handlePopupChoice('yes');
        },
      );
      //remove item from array new position
      weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]].splice(
        sourcePosition[2],
        1,
      );
      return;
    } else if (dndData.source.droppableId === 'completions__droppable') {
      weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]][
        sourcePosition[2]
      ].backlog = false;
      body.process = {
        ...weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]][sourcePosition[2]],
      };
      body.toBackLog = false;
      this.setState(
        {
          weeklyOrders: weeklyOrdersCopyArray,
          updateApiBody: body,
        },
        () => {
          this.handlePopupChoice('yes');
        },
      );
      //remove item from array new position
      weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]].splice(
        sourcePosition[2],
        1,
      );
      return;
    }

    //remove item from array new position
    weeklyOrdersCopyArray[sourcePosition[0]].processes[sourcePosition[1]].splice(
      sourcePosition[2],
      1,
    );

    this.setState({
      loader: true,
    });
    // check for warnings
    let warningsApi = await getWarnings(body);
    if (warningsApi.ok) {
      if (warningsApi.result.length > 0) {
        this.setState({ popup: true, warnings: warningsApi.result });
      } else {
        if (itemToPush.constant) {
          //new for constant change
          this.props.updateConstantPopup(true);
          this.setState({ loader: false });
        } else {
          this.handlePopupChoice('yes');
        }
      }
    } else {
      if (itemToPush.constant) {
        this.setState({ popup: true });
      } else {
        this.setState({ popup: true, errPopupState: warningsApi.result });
      }
    }
    // }

    //set new display with new array
    this.setState({
      weeklyOrders: weeklyOrdersCopyArray,
    });
  };

  handlePopupChoice = async (param, constantData, spreading = false) => {
    let { constant_spred } = this.state;

    this.setState({ popup: false, loader: true });
    //init body for endDate call
    let newBody;
    if (param === 'yes')
      newBody = {
        _id: this.state.updateApiBody._id,
        date: this.state.updateApiBody.endDate,
        view: this.state.updateApiBody.view,
        from: this.state.updateApiBody.from,
        to: this.state.updateApiBody.to,
        order_employee_id: null,
        department_id: this.props.login.selectedDepartment._id,
      };
    //
    if (param === 'yes') {
      if (this.state.updateApiBody.toBackLog) {
        //need to set the original process
        let res = await updateProcess(this.state.updateApiBody.process);
        let res2 = await setEndDateForProcess({
          ...this.state.updateApiBody.process,
          date: this.state.updateApiBody.process.process_date,
        });
        if (res.ok) this.setState({ popup: false, loader: false });
        return;
      }

      let res;
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
            this.getProcesses();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }
      } else {
        res = await montlyUpdateOrders(
          this.state.updateApiBody,
          spreading,
          this.props.login.selectedDepartment._id,
        );
        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.getProcesses();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }

        this.updateConstantToSpred(false);
      }

      if (res.ok) {
        this.buildDays();
        this.getProcesses();
        this.setState({ errPopupState: '', popup: false });
      } else {
        this.setState({ errPopupState: res.result, popup: true, loader: false });
      }
    } else {
      let prevState = this.state.prevState.map((item) => item);
      this.setState({ weeklyOrders: prevState, popup: false, errPopupState: null, loader: false });
    }
  };

  openUpdateMenu = (proccess) => {
    this.setState({
      updateProcessPopup: true,
      selectedProcess: {
        proccess,
        order_number: proccess.order_number,
        client_name: proccess.client_name,
        // city: proccess.city,
        // address: proccess.address
      },
    });
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
    // if(body.splitProcess){
    this.getProcesses();
    // }
    //if date didnt change dont reposition
    if (moment(body.date).isSame(moment(body.process.process_date))) {
      if (newBody.date) {
        let res2 = await setEndDateForProcess(newBody);
        if (res2.ok) {
          this.getProcesses();
        } else {
          this.setState({ errPopupState: res2.result, popup: true });
        }
      }

      this.setState({ loader: false, updateProcessPopup: false }, () => {
        if (newProcess) {
          let newState = replaceProcessInState(newProcess, this.state.weeklyOrders);
          this.setState({ weeklyOrders: newState });
        }

        if (refetchData) this.getProcesses();
      });
      return;
    }

    this.setState({
      prevState: JSON.parse(JSON.stringify(this.state.weeklyOrders)),
      updateApiBody: body,
    });

    //if the date is changed ---> constant popup

    let res;
    if (constant) {
      //check for warnings
      let warningsApi = await getWarnings(body);

      if (warningsApi.ok) {
        if (warningsApi.result.length > 0) {
          this.setState({
            popup: true,
            loader: false,
            updateProcessPopup: false,
            warnings: warningsApi.result,
          });
        } else {
          this.setState({ updateProcessPopup: false });

          this.props.updateConstantPopup(true);
          this.setState({ loader: false });
        }
      } else {
        this.setState({
          popup: true,
          updateProcessPopup: false,
          loader: false,
          errPopupState: warningsApi.result,
        });
      }
    } else {
      // check if date difrence is week or less dont show spread popup (init spread false automaticly)
      let movedToDate = moment(body.date).set({ hour: 14, minute: 0, second: 0 }).toDate();
      let currentDate = moment(body.process.process_date)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      let diff = moment(movedToDate).diff(currentDate, 'days');
      if (Math.abs(diff) < 7) {
        this.setState({ updateProcessPopup: false }, () => {
          this.spreadingFalse();
        });
      } else {
        this.setState({ updateProcessPopup: false, spreadingPopup: true });
      }
    }
  };

  //spread handlers

  spreadingFalse = async () => {
    const { updateApiBody } = this.state;
    this.setState({
      loader: true,
      spreadingPopup: false,
    });
    // check for warnings
    let warningsApi = await getWarnings(updateApiBody);
    if (warningsApi.ok) {
      if (warningsApi.result.length > 0) {
        this.setState({
          popup: true,
          loader: false,
          spreadingPopup: false,
          warnings: warningsApi.result,
        });
      } else {
        this.handlePopupChoice('yes');
      }
    } else {
      if (updateApiBody.process.constant) {
        this.setState({ popup: true, spreadingPopup: false, loader: false });
      } else {
        this.setState({
          popup: true,
          spreadingPopup: false,
          loader: false,
          errPopupState: warningsApi.result,
        });
      }
    }
  };

  spreadingTrue = async () => {
    const { updateApiBody } = this.state;
    if (moment(updateApiBody.date).isSameOrBefore(moment(updateApiBody.process.process_date))) {
      //check for warnings
      let warningsApi = await getWarnings(updateApiBody, true);

      if (warningsApi.ok) {
        if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
          this.setState({
            popup: true,
            loader: false,
            spreadingPopup: false,
            warnings: warningsApi.result,
          });
        } else {
          this.setState({ spreadingPopup: false, loader: true });
          this.handlePopupChoice('yes', false, true);
        }
      } else {
        this.setState({
          popup: true,
          loader: false,
          spreadingPopup: false,
          errPopupState: warningsApi.result,
        });
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

  cancelPopup = () => {
    let datesArrayCopy = JSON.parse(JSON.stringify(this.state.prevState));
    this.setState({ reasonPopup: false, weeklyOrders: datesArrayCopy });
  };

  handleSpreadWithReason = async (data) => {
    let body = { ...this.state.updateApiBody };
    body.reason = data.reason.value;
    body.approved_by = data.approveName.value;
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
        this.setState({ loader: true, updateApiBody: body, reasonPopup: false }, () => {
          this.handlePopupChoice('yes', false, true);
        });
      }
    } else {
      this.setState({
        popup: true,
        reasonPopup: false,
        loader: false,
        errPopupState: warningsApi.result,
      });
    }
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
      this.setState({ spreadingPopup: false, weeklyOrders: prevState });
    } else {
      this.setState({ spreadingPopup: false });
    }
    this.props.updateConstantPopup(false);
  };

  backToToday = () => {
    let search = window.location.search;
    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;
    this.props.history.push(
      `/${dynamicFactoryName}/weekly/${moment().toDate()}${search ? search : ''}`,
    );
    this.setState({ currentDate: moment() }, () => {
      this.buildDays();
      this.getProcesses();
    });
  };

  //new for constant change -
  resetReposition = () => {
    this.setState({ popup: true });
  };

  updateWarningPopup = (value) => this.setState({ popup: value });

  render() {
    const {
      daysArray,
      currentDate,
      weeklyOrders,
      updateProcessPopup,
      popup,
      errPopupState,
      warnings,
      updateApiBody,
      selectedProcess,
      loader,
      spreadingPopup,
      reasonPopup,
    } = this.state;
    const { off_days, holidays } = this.props.login.user;
    let disableDrag =
      this.props.login &&
      Object.keys(this.props.login.user).length > 0 &&
      this.props.login.user.privileges.includes(PER_USER)
        ? true
        : false;

    return (
      <div className="week-view-page">
        {loader ? <LoaderNew /> : null}

        {spreadingPopup ? (
          <SpreadingPopup
            spreadingFalse={this.spreadingFalse}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
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

        {updateProcessPopup ? (
          <UpdateProccessPopup
            warningApiPayload={updateApiBody}
            selectedProcess={selectedProcess}
            view={'M'}
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
            warningApiPayload={updateApiBody}
            warnings={warnings}
          />
        ) : null}

        <DragDropContext onDragEnd={this.onDragEnd}>
          {daysArray && daysArray.length > 0 && (
            <WeeklyCalendar
              daysArray={daysArray}
              currentSelectedDate={currentDate}
              weeksDateChange={this.weeksDateChange}
              weeklyOrders={weeklyOrders}
              openUpdateMenu={this.openUpdateMenu}
              daysOffNumber={off_days.length}
              disableDrag={disableDrag}
              backToToday={this.backToToday}
              offDays={off_days}
            />
          )}

          <WeeklyCompletions
            weeklyOrders={weeklyOrders}
            daysOffNumber={off_days.length}
            openUpdateMenu={this.openUpdateMenu}
          />
        </DragDropContext>
      </div>
    );
  }
}

function mapStateToProps({ login, process, orders, mainPopup }) {
  return { login, process, orders, mainPopup };
}
export default withRouter(connect(mapStateToProps, actions)(WeeklyDashboard));
