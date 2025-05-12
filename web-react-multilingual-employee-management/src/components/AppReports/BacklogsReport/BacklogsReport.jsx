import React, { Component } from 'react';
import { generalGetRequest, generalPostRequest } from '../../../functions/api/general';
import moment from 'moment';
import {
  appGetOrders,
  montlyUpdateOrders,
  montlyUpdateOrdersForConst,
  updateProcess,
  getWarnings,
  setEndDateForProcess,
} from '../../../functions/api/orders';
//
import '../../../sass/backlogReports/backlog_reports.scss';
//comps
import GeneralDropdown from '../../generals/generalDropdown/GeneralDropdown';
//popups
import UpdateProccessPopup from '../../updatePopups/UpdateProccessPopup';
import OnDragPopup from '../../updatePopups/OnDragPopup';
import ConstantPopup from '../../updatePopups/ConstantPopup';
import ReasonPopup from '../../updatePopups/ReasonPopup';
import SpreadingPopup from '../../updatePopups/SpreadingPopup';
//
import SideBar from '../../SideBar/SideBar';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
//
import { withRouter } from 'react-router-dom';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
import Task from './parts/Task';

const CustomCheckbox = withStyles({
  root: {
    color: '',
    padding: '4px',
    '&$checked': {
      color: '#0091ff',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

class BacklogsReport extends Component {
  constructor() {
    super();

    this.state = {
      orders: [],
      filteredOrders: [],
      orderIndex: null,
      orderProcessIndex: null,
      reasonPopup: false,
      spreadingPopup: false,
      popup: false,
      errPopupState: false,
      warnings: [],
      updateApiBody: {},
      filterOptions: '',
      updateProcessPopup: false,
      selectedProcess: {},
      processOptions: [],
      loader: true,
      sendBackToProduction: true,
    };
  }

  componentWillMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname);
  }

  async componentDidMount() {
    this.fetchData();

    //get process options for filtering
    let processOptions = await generalGetRequest(`/system/process/get?type=0`);
    processOptions = processOptions.result;
    processOptions.unshift({ name: 'הצג הכל', _id: '' });
    this.setState({ processOptions });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState.selectedProcess).length > 0 &&
      Object.keys(this.state.selectedProcess).length > 0 &&
      prevState.selectedProcess.proccess._id === this.state.selectedProcess.proccess._id &&
      !this.state.selectedProcess.proccess.backlog
    )
      this.removeFromPage(this.state.selectedProcess.proccess._id);
  }

  removeFromPage = (process_id) => {
    let newState = JSON.parse(JSON.stringify(this.state.orders));
    let newStateFiltered = JSON.parse(JSON.stringify(this.state.filteredOrders));
    newState = newState.map((order) => {
      return {
        ...order,
        order_processes: order.order_processes.filter((item) => item._id !== process_id),
      };
    });
    newStateFiltered = newStateFiltered.map((order) => {
      return {
        ...order,
        order_processes: order.order_processes.filter((item) => item._id !== process_id),
      };
    });
    this.setState({
      orders: newState,
      filteredOrders: newStateFiltered,
      selectedProcess: {},
      updateProcessPopup: false,
    });
  };

  fetchData = async () => {
    let res = await generalGetRequest(`/system/reports/backlogs`);
    if (res.ok) {
      this.setState({ orders: res.result, filteredOrders: res.result, loader: false });
    }
  };

  updateOrderProcessDetails = async (
    orderIndex,
    orderProcessIndex,
    order_process_id,
    name,
    field,
  ) => {
    //change in state
    let newState = JSON.parse(JSON.stringify(this.state.orders));
    newState[orderIndex].order_processes[orderProcessIndex].backlog_details[name] = !field;
    this.setState({ orders: newState });
    // change filtered Array
    let newStateFiltered = JSON.parse(JSON.stringify(this.state.filteredOrders));
    newStateFiltered[orderIndex].order_processes[orderProcessIndex].backlog_details[name] = !field;
    this.setState({ filteredOrders: newStateFiltered });
    //change in server
    let body = {
      order_process_id,
    };
    body[name] = !field;
    let res = await generalPostRequest(body, `/system/reports/backlogs/update`);

    if (!res.ok) {
      newState[orderIndex].order_processes[orderProcessIndex].backlog_details[name] = field;
      newStateFiltered[orderIndex].order_processes[orderProcessIndex].backlog_details[name] = field;
      this.setState({ orders: newState, filteredOrders: newStateFiltered });
      console.log('HANDLE ERROR HERE');
    }
  };

  openEditPopup = (orderIndex, orderProcessIndex, order, order_process) => {
    let selectedProcess = JSON.parse(JSON.stringify(order));
    selectedProcess.proccess = JSON.parse(JSON.stringify(order_process));
    this.setState({ selectedProcess, orderIndex, orderProcessIndex, sendBackToProduction: true });
    this.setState({ updateProcessPopup: true });
  };
  // set sendBackToProduction: false not to change backlog amd edit only processes
  openEditTasksPopup = (orderIndex, orderProcessIndex, order, order_process) => {
    let selectedProcess = JSON.parse(JSON.stringify(order));
    selectedProcess.proccess = JSON.parse(JSON.stringify(order_process));
    this.setState({ selectedProcess, orderIndex, orderProcessIndex, sendBackToProduction: false });
    this.setState({ updateProcessPopup: true });
  };

  closeUpdateMenu = () => {
    this.setState({
      updateProcessPopup: false,
      selectedProcess: {},
    });
  };

  initializeData = () => {
    const { orderIndex, orderProcessIndex } = this.state;
    let newState = JSON.parse(JSON.stringify(this.state.orders));
    //reset checkboxs
    // if(!orderIndex || !orderProcessIndex)return
    let res = generalPostRequest(
      {
        order_process_id: newState[orderIndex].order_processes[orderProcessIndex]._id,
        received_to_warehouse: false,
      },
      `/system/reports/backlogs/update`,
    );
    let res1 = generalPostRequest(
      {
        order_process_id: newState[orderIndex].order_processes[orderProcessIndex]._id,
        exported_for_purchase: false,
      },
      `/system/reports/backlogs/update`,
    );
    //
    newState[orderIndex].order_processes.splice(orderProcessIndex, 1);

    if (newState[orderIndex].order_processes.length === 0) newState.splice(orderIndex, 1);

    this.setState({ orders: newState });
  };

  checkDateDiff = (date) => {
    if (!date || date == null) return false;
    return moment().diff(moment(date), 'days') > 14;
  };

  updatefilterOptions = (a, filterOptions) => {
    if (!filterOptions._id) {
      this.setState({ filteredOrders: JSON.parse(JSON.stringify(this.state.orders)) });
      return;
    }

    this.setState({ filterOptions }, () => {
      let filteredOrders = JSON.parse(JSON.stringify(this.state.orders));
      filteredOrders = filteredOrders.map((order) => {
        return {
          ...order,
          order_processes: order.order_processes.filter((process) => {
            return process.process_id === filterOptions._id;
          }),
        };
      });
      filteredOrders = filteredOrders.filter((order) => order.order_processes.length > 0);
      this.setState({ filteredOrders });
    });
  };

  /////////////////////////////////////////

  submitUpdatesFromPopup = async (body, constant, refetchData, newProcess = null) => {
    // fetch updated orders
    await this.fetchData();
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

  cancleSpreading = () => {
    this.setState({ spreadingPopup: false });

    this.props.updateConstantPopup(false);
  };

  handleSpreadWithReason = async (data) => {
    let body = { ...this.state.spreadingBodyData };
    body.reason = data.reason.value;
    body.approved_by = data.approveName.value;
    //check for warnings

    let warningsApi = await getWarnings(body, true);
    if (warningsApi.ok) {
      if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
        this.setState({ popup: true, warnings: warningsApi.result, reasonPopup: false });
      } else {
        //old- constant change:
        // if(body.process.constant){
        //     this.setState({popup:true})
        // } else {
        // let datesArrayCopy = JSON.parse(JSON.stringify(this.state.datesArray))
        this.setState({ updateApiBody: body }, () => {
          this.handlePopupChoice('yes', false, true);
        });
        // }
      }
    } else {
      this.setState({ popup: true, errPopupState: warningsApi.result });
    }
  };

  updateConstantToSpred = (boolean) => {
    this.setState({
      constant_spred: boolean,
    });
  };

  spreadingFalse = async () => {
    this.setState({ spreadingPopup: false });
    let body = { ...this.state.spreadingBodyData };
    let warningsApi = await getWarnings(body);

    if (warningsApi.ok) {
      //check for warnings
      let warningsApi = await getWarnings(body);
      if (warningsApi.ok) {
        if (warningsApi.result.length > 0) {
          this.setState({ popup: true, warnings: warningsApi.result, spreadingPopup: false });
        } else {
          // constant change
          // if(body.process.constant) {
          //     this.setState({popup:true, warningApiPayload:body})
          // } else {
          this.handlePopupChoice('yes');
          // }
        }
      } else {
        this.setState({ popup: true, errPopupState: warningsApi.result, spreadingPopup: false });
      }
    } else {
      this.setState({ popup: true, errPopupState: warningsApi.result, spreadingPopup: false });
    }
  };

  spreadingTrue = async () => {
    const { spreadingBodyData } = this.state;

    if (
      moment(spreadingBodyData.date).isSameOrBefore(moment(spreadingBodyData.process.process_date))
    ) {
      console.log(spreadingBodyData.date);
      this.setState({ spreadingPopup: false });
      //check for warnings
      let warningsApi = await getWarnings(spreadingBodyData, true);
      if (warningsApi.ok) {
        if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
          this.setState({ popup: true, warnings: warningsApi.result });
        } else {
          //old- constant change:
          // if(spreadingBodyData.process.constant){
          //     this.setState({popup:true})
          // } else {
          this.handlePopupChoice('yes', false, true);
          // }
        }
      } else {
        this.setState({ popup: true, errPopupState: warningsApi.result });
      }
    } else {
      this.setState({ reasonPopup: true, spreadingPopup: false });
    }
  };

  handlePopupChoice = async (param, constantData = false, spreading = false) => {
    let { constant_spred } = this.state;

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
      this.setState({ spreadingPopup: false, reasonPopup: false });

      if (this.state.updateApiBody.toBacklog) {
        let res = await updateProcess(this.state.updateApiBody.process);
        if (res.ok) {
          this.setState({ popup: false });
        }

        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.setState({ counter: 0, stopApi: false, from: null, to: null }, async () => {
              this.initializeData();
            });
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }

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
            this.setState({ counter: 0, stopApi: false, from: null, to: null }, async () => {
              this.initializeData();
            });
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

        // if(res.ok)
        // this.initializeData()

        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.setState({ counter: 0, stopApi: false, from: null, to: null }, async () => {
              this.initializeData();
            });
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }

        this.updateConstantToSpred(false);
      }

      if (res.ok) {
        this.setState({ counter: 0, stopApi: false, from: null, to: null }, async () => {
          this.initializeData();
        });
      } else {
        this.setState({ errPopupState: res.result, popup: true });
      }
    } else {
      this.setState({ popup: false, errPopupState: null });
    }
  };

  render() {
    const {
      orders,
      filteredOrders,
      loader,
      updateProcessPopup,
      selectedProcess,
      updateApiBody,
      popup,
      errPopupState,
      warnings,
      reasonPopup,
      spreadingPopup,
      processOptions,
      filterOptions,
    } = this.state;
    const { off_days, holidays, popupActivation } = this.props.login.user;

    return (
      <div className="backlogs-reports">
        {reasonPopup ? (
          <ReasonPopup
            spreadingTrue={this.spreadingTrue}
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
          />
        ) : null}

        {updateProcessPopup ? (
          <UpdateProccessPopup
            warningApiPayload={updateApiBody}
            selectedProcess={selectedProcess}
            view={'L'}
            closeUpdateMenu={this.closeUpdateMenu}
            submitUpdatesFromPopup={this.submitUpdatesFromPopup}
            offDays={off_days}
            holidays={holidays}
            sendBackToProduction={this.state.sendBackToProduction}
            //    saveNewSelectedProcess = {this.saveNewSelectedProcess}
          />
        ) : null}

        <SideBar />
        <section className="backlogs-reports__main">
          <header>
            <span>
              <p>דו״ח השלמות</p>
              <GeneralDropdown
                options={processOptions}
                dynamicValueForMapping={'name'}
                // stateName = {'custom_process'}
                updateFormData={this.updatefilterOptions}
                // errorMessage = {'אנא בחר תהליך'}
                // initValidation = {initValidation}
                // required = {true}
                // setError = {this.props.setError}
                // clearError = {this.props.clearError}
                value={
                  filterOptions
                    ? filterOptions.name
                    : processOptions[0]
                    ? processOptions[0].name
                    : ''
                }
                // disabled = {editMode}
              />
            </span>

            {!loader ? <p>{filteredOrders.length} לקוחות</p> : null}
          </header>

          {filteredOrders.length === 0 ? (
            <div className="backlogs-reports__main__no-results">
              <h1>{!loader ? 'לא נמצאו השלמות' : ''}</h1>
            </div>
          ) : (
            <div>
              {filteredOrders.map((order, orderIndex) => {
                return (
                  <div key={order._id} className="backlogs-reports__main__order">
                    <section className="backlogs-reports__main__order__data">
                      <span>{order.client_name + '-' + order.order_number}</span>
                      <span>{moment(order.due_date).format('DD/MM/YYYY')}</span>
                    </section>
                    <section className="backlogs-reports__main__order__processes">
                      {order.order_processes.length > 0 &&
                        order.order_processes.map((order_process, orderProcessIndex) => {
                          return (
                            <div
                              key={order_process._id}
                              className="backlogs-reports__main__order__processes__item"
                              style={
                                this.checkDateDiff(order_process.sent_to_backlogs) === true
                                  ? { border: '1px solid #ff0000' }
                                  : {}
                              }
                            >
                              <h6
                                onClick={() => {
                                  this.openEditTasksPopup(
                                    orderIndex,
                                    orderProcessIndex,
                                    order,
                                    order_process,
                                  );
                                }}
                              >
                                {order_process.process_name}
                              </h6>
                              <span className="backlogs-reports__main__order__processes__item--quantity">
                                <p>תאריך העברה להשלמות</p>
                                <b>
                                  {order_process.sent_to_backlogs
                                    ? moment(order_process.sent_to_backlogs).format('DD/MM/YYYY')
                                    : '-'}
                                </b>
                              </span>
                              <span className="backlogs-reports__main__order__processes__item--quantity">
                                <b>כמות שדווחה ({order_process.finished})</b>
                                <b>כמות שהוזמנה ({order_process.quantity})</b>
                              </span>
                              <b>הערות:</b>
                              <span className="order-process-notes">
                                {order_process?.tasks?.map((i) => (
                                  <Task key={i._id} data={i} />
                                ))}
                              </span>
                              <span
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'baseline',
                                }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                  <CustomCheckbox
                                    checked={
                                      order_process.backlog_details.exported_for_purchase
                                        ? order_process.backlog_details.exported_for_purchase
                                        : false
                                    }
                                    onChange={() => {
                                      this.updateOrderProcessDetails(
                                        orderIndex,
                                        orderProcessIndex,
                                        order_process._id,
                                        'exported_for_purchase',
                                        order_process.backlog_details.exported_for_purchase,
                                      );
                                    }}
                                  />
                                  <p>יצא לרכש</p>
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                  <CustomCheckbox
                                    checked={
                                      order_process.backlog_details.received_to_warehouse
                                        ? order_process.backlog_details.received_to_warehouse
                                        : false
                                    }
                                    onChange={() => {
                                      this.updateOrderProcessDetails(
                                        orderIndex,
                                        orderProcessIndex,
                                        order_process._id,
                                        'received_to_warehouse',
                                        order_process.backlog_details.received_to_warehouse,
                                      );
                                    }}
                                  />
                                  <p>התקבל למחסן</p>
                                </span>
                              </span>
                              <button
                                onClick={() => {
                                  this.openEditPopup(
                                    orderIndex,
                                    orderProcessIndex,
                                    order,
                                    order_process,
                                  );
                                }}
                              >
                                החזר לתוכנית יצור
                              </button>
                            </div>
                          );
                        })}
                    </section>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }
}

function mapStateToProps({ login, process, orders }) {
  return { login, process, orders };
}
export default withRouter(connect(mapStateToProps, actions)(BacklogsReport));
