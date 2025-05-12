import React, { Component } from 'react';
import { polyfill } from 'es6-promise';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
//sass
import '../../../sass/dailyDashboard/_daily-dashboard.scss';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
//comps
import DailyCalender from './parts/DailyCalender';
import DailyTimepicker from './parts/DailyTimepicker';
import UpdateProccessPopup from '../../updatePopups/UpdateProccessPopup';
import OnDragPopup from '../../updatePopups/OnDragPopup';
import ReasonPopup from '../../updatePopups/ReasonPopup';
import SpreadingPopup from '../../updatePopups/SpreadingPopup';
import LoaderNew from '../../LoaderNew/Loader';
//func
import {
  appGetOrders,
  getWarnings,
  montlyUpdateOrders,
  montlyUpdateOrdersForConst,
  updateProcess,
  setEndDateForProcess,
} from '../../../functions/api/orders';
import { replaceProcessInState } from './DailyDashboardFunctions';
import jwt_decode from 'jwt-decode';
import { PER_USER } from '../../../tools/keys/variables';
import { closePopupOnBackButton } from '../../../hooks/helper';
polyfill();

class DailyDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: props.match.params.day ? moment(props.match.params.day) : moment(),
      processesArray: [],
      updateProcessPopup: false,
      loader: false,
      selectedProcess: {},
      spreadingPopup: false,
      reasonPopup: false,
      prevState: [],
      popup: false,
    };
    window.onpopstate = (event) =>
      closePopupOnBackButton(this.state.updateProcessPopup, (data) => {
        data && this.closeUpdateMenu();
      });
  }

  componentDidMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname); // to update the location path in the header tabs
    this.fetchNewData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.search !== this.props.location.search ||
      JSON.stringify(prevProps.login.selectedDepartment) !==
        JSON.stringify(this.props.login.selectedDepartment)
    ) {
      this.fetchNewData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.login.selectedManager !== nextProps.login.selectedManager) {
      this.fetchNewData();
    }

    if (this.props.login.selectedUser !== nextProps.login.selectedUser) {
      this.fetchNewData();
    }

    if (this.props.login.lastAddedOrderId !== nextProps.login.lastAddedOrderId) {
      this.fetchNewData();
    }
  }

  deleteBacklogsDuplications = (process) => {
    let newState = this.state.processesArray.filter((item) => {
      return item._id !== process._id;
    });
    this.setState({ processesArray: newState });
  };

  fetchNewData = async () => {
    this.setState({ loader: true });
    let from = this.state.currentDate._d;
    let to = moment(this.state.currentDate).add('days', 1)._d;
    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager._id;
    let started = '';
    let startTime = 8;
    const user_id = jwt_decode(this.props.login.user.token)._id;
    const selectedUser = this.props.login.user.privileges.includes(PER_USER)
      ? user_id
      : this.props.login.selectedUser;
    // let selectedUser = this.props.login.selectedUser

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

    let processesArray = apiOrders.map((order) => {
      let newOrderArray = order.processes.map((process) => {
        return {
          ...process,
          order_number: order.order_number,
          client_name: order.client_name,
        };
      });
      return newOrderArray;
    });
    processesArray = [].concat.apply([], processesArray);
    processesArray = processesArray.filter((item) => !item.backlog);
    processesArray = processesArray.map((process) => {
      const { actual_duration, done } = process;
      const newProcess = { ...process };
      if (!done) {
        newProcess.startTime = startTime;
        newProcess.endTime = startTime += +actual_duration;
      }
      return newProcess;
    });
    this.setState({ processesArray, loader: false });
  };

  handleDateChange = (param) => {
    // dynamic factory name in url
    const dynamicFactoryName = this.props.login.user.factory_name;

    let newDateState = moment(this.state.currentDate);
    if (param === 'inc') {
      let searchQuery = window.location.search;
      this.props.history.push(
        `/${dynamicFactoryName}/daily/${this.state.currentDate}${searchQuery ? searchQuery : ''}`,
      );
      newDateState = moment(newDateState).add('days', 1);
      this.setState({ currentDate: newDateState }, () => {
        this.fetchNewData();
      });
    } else if (param === 'dec') {
      let searchQuery = window.location.search;
      this.props.history.push(
        `/${dynamicFactoryName}/daily/${this.state.currentDate}${searchQuery ? searchQuery : ''}`,
      );
      newDateState = moment(newDateState).subtract('days', 1);
      this.setState({ currentDate: newDateState }, () => {
        this.fetchNewData();
      });
    } else {
      this.setState({ currentDate: moment(param) }, () => {
        let searchQuery = window.location.search;
        this.props.history.push(
          `/${dynamicFactoryName}/daily/${this.state.currentDate}${searchQuery ? searchQuery : ''}`,
        );
        this.fetchNewData();
      });
    }
    //scroll to top after date change
    var daily_element_to_scroll_up = document.getElementById('daily-view-page__calender__main');
    daily_element_to_scroll_up.scrollTop = 0;
  };

  openUpdateMenu = (proccess) => {
    this.setState({
      updateProcessPopup: true,
      selectedProcess: {
        proccess,
        order_number: proccess.order_number,
        client_name: proccess.client_name,
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

    //if date didnt change dont reposition
    // if(body.splitProcess){
    this.fetchNewData();
    // }

    if (moment(body.date).isSame(moment(body.process.process_date))) {
      if (newBody.date) {
        let res2 = await setEndDateForProcess(newBody);
        if (res2.ok) {
          this.fetchNewData();
        } else {
          this.setState({ errPopupState: res2.result, popup: true });
        }
      }

      this.setState({ loader: false, updateProcessPopup: false }, () => {
        if (newProcess) {
          let newState = replaceProcessInState(newProcess, this.state.processesArray);
          this.setState({ processesArray: newState });
        }
      });
      return;
    }

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
          res = await montlyUpdateOrdersForConst(body, this.props.login.selectedDepartment._id);
          if (newBody.date) {
            let res2 = await setEndDateForProcess(newBody);
            if (res2.ok) {
              this.fetchNewData();
            } else {
              this.setState({ errPopupState: res2.result, popup: true });
            }
          }
        }
      } else {
        let processesArrayCopy = JSON.parse(JSON.stringify(this.state.processesArray));
        this.setState({
          errPopupState: res.result,
          popup: true,
          updateApiBody: body,
          prevState: processesArrayCopy,
          updateProcessPopup: false,
        });
      }
    } else {
      //not constant handler
      // check if date difrence is week or less dont show spread popup (init spread false automaticly)
      let movedToDate = moment(body.date).set({ hour: 14, minute: 0, second: 0 }).toDate();
      let currentDate = moment(body.process.process_date)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      let diff = moment(movedToDate).diff(currentDate, 'days');
      if (Math.abs(diff) < 7) {
        this.setState(
          {
            spreadingBodyData: body,
            updateApiBody: body,
            updateProcessPopup: false,
          },
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

    // general res handler - from const/not/is detached
    if (res.ok) {
      this.setState({ updateProcessPopup: false }, async () => {
        //building dates data array to show on interface
        let processesArray = await this.fetchNewData();
        this.setState({ loader: false });
      });
    } else {
      let stateHolder = this.state.processesArray.map((item) => item);
      this.setState({
        errPopupState: res.result,
        loader: false,
        updateProcessPopup: false,
        popup: true,
        updateApiBody: body,
        prevState: stateHolder,
      });
    }
  };

  //
  //
  //
  //
  //

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
          if (body.process.constant) {
            this.setState({
              popup: true,
              loader: false,
              warningApiPayload: body,
            });
          } else {
            this.handlePopupChoice('yes');
          }
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
          this.setState({
            popup: true,
            loader: false,
            warnings: warningsApi.result,
          });
        } else {
          if (spreadingBodyData.process.constant) {
            this.setState({ popup: true, loader: false });
          } else {
            this.handlePopupChoice('yes', false, true);
          }
        }
      } else {
        this.setState({
          popup: true,
          loader: false,
          errPopupState: warningsApi.result,
        });
      }
    } else {
      this.setState({ reasonPopup: true, spreadingPopup: false });
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
        if (body.process.constant) {
          this.setState({ popup: true, loader: false });
        } else {
          this.setState({ updateApiBody: body }, () => {
            this.handlePopupChoice('yes', false, true);
          });
        }
      }
    } else {
      this.setState({
        popup: true,
        loader: false,
        errPopupState: warningsApi.result,
      });
    }
  };

  handlePopupChoice = async (param, constantData = false, spreading = false) => {
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
      this.setState({
        spreadingPopup: false,
        reasonPopup: false,
        loader: true,
      });

      if (this.state.updateApiBody.toBacklog) {
        let res = await updateProcess(this.state.updateApiBody.process);
        if (res.ok) this.setState({ popup: false, loader: false });
        return;
      }

      let res;

      if (this.state.updateApiBody.process.constant) {
        let body = { ...this.state.updateApiBody };
        if (constantData) {
          body.reason = constantData.reason.value;
          body.approved_by = constantData.approveName.value;
        }

        res = await montlyUpdateOrdersForConst(body, this.props.login.selectedDepartment._id);
        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.fetchNewData();
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
            this.fetchNewData();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }
      }

      if (res.ok) {
        this.setState({ popup: false }, async () => {
          //building dates data array to show on interface
          let processesArray = await this.fetchNewData();
          this.setState({ loader: false });
          // this.props.setCsvMonthly(processesArray)
        });
      } else {
        this.setState({
          errPopupState: res.result,
          loader: false,
          popup: true,
        });
      }
    } else {
      let prevState = this.state.prevState.map((item) => item);

      if (!prevState || prevState.length === 0)
        prevState = JSON.parse(JSON.stringify(this.state.processesArray));
      this.setState({
        processesArray: prevState,
        popup: false,
        errPopupState: null,
        loader: false,
      });
    }
  };

  cancelReasonPopup = () => {
    let processesArrayCopy = JSON.parse(JSON.stringify(this.state.prevState));
    this.setState({ reasonPopup: false, processesArray: processesArrayCopy });
  };

  saveNewSelectedProcess = (process) => {
    let selectedProcess = { ...this.state.selectedProcess };
    selectedProcess.proccess = { ...process };
    this.setState({
      selectedProcess,
    });
  };

  cancleSpreading = () => {
    this.setState({ spreadingPopup: false });
  };

  backToToday = () => {
    let search = window.location.search;
    // dynamic factory name in url
    const dynamicFactoryName = this.props.login.user.factory_name;
    this.props.history.push(
      `/${dynamicFactoryName}/daily/${moment().toDate()}${search ? search : ''}`,
    );
    this.setState({ currentDate: moment() }, () => {
      this.fetchNewData();
    });
  };

  render() {
    const {
      currentDate,
      processesArray,
      updateProcessPopup,
      selectedProcess,
      loader,
      spreadingPopup,
      reasonPopup,
      popup,
      errPopupState,
      warnings,
    } = this.state;
    const { off_days, holidays } = this.props.login.user;

    return (
      <div className="daily-view-page">
        {loader ? <LoaderNew /> : null}

        {popup ? (
          <OnDragPopup
            afterConfirmationError={errPopupState}
            popupActionHandler={this.handlePopupChoice}
            warningApiPayload={this.state.updateApiBody}
            warnings={warnings}
          />
        ) : null}

        {reasonPopup ? (
          <ReasonPopup
            handleSpreadWithReason={this.handleSpreadWithReason}
            cancelPopup={this.cancelReasonPopup}
          />
        ) : null}

        {spreadingPopup ? (
          <SpreadingPopup
            spreadingFalse={this.spreadingFalse}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
          />
        ) : null}

        {updateProcessPopup ? (
          <UpdateProccessPopup
            //    warningApiPayload = {updateApiBody}
            selectedProcess={selectedProcess}
            view={'L'}
            closeUpdateMenu={this.closeUpdateMenu}
            submitUpdatesFromPopup={this.submitUpdatesFromPopup}
            offDays={off_days}
            holidays={holidays}
            saveNewSelectedProcess={this.saveNewSelectedProcess}
            //    setProcessToDoneInUi = {this.fetchNewData}
            deleteBacklogsDuplications={this.deleteBacklogsDuplications}
          />
        ) : null}

        <DailyCalender
          backToToday={this.backToToday}
          is_loader_on={loader}
          fetchNewData={this.fetchNewData}
          openUpdateMenu={this.openUpdateMenu}
          processesArray={processesArray}
          currentDate={currentDate}
          handleDateChange={this.handleDateChange}
        />
        <DailyTimepicker currentDate={currentDate} handleDateChange={this.handleDateChange} />
      </div>
    );
  }
}

function mapStateToProps({ login, process }) {
  return { login, process };
}
export default withRouter(connect(mapStateToProps, actions)(DailyDashboard));
