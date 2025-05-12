import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/actions';
import Calender from './Parts/Calendar/Calender';
import moment from 'moment';
import { polyfill } from 'es6-promise';
import { isSameDay } from '../../../functions/general/general';
import {
  getWarnings,
  upateOrders,
  repositionForConst,
  setEndDateForProcess,
  getOrderById,
} from '../../../functions/api/orders';
import OnDragPopup from '../../updatePopups/OnDragPopup';
import UpdateProccessPopup from '../../updatePopups/UpdateProccessPopup';
import { findRangOfDatesFromWeeksArr } from '../../../functions/data/weeks_generator';
import ErrorPopup from '../../NavBar/ErrorPopup/ErrorPopup';
import SpreadingPopup from '../../updatePopups/SpreadingPopup';
import ReasonPopup from '../../updatePopups/ReasonPopup';
import Loader from '../../LoaderNew/Loader';
import ConstantPopup from '../../updatePopups/ConstantPopup';
import { getIsRecipientReasone } from '../../../functions/api/orders';
import { calculateEndDateAccordingToDuration, closePopupOnBackButton } from '../../../hooks/helper';

polyfill();

class YearlyDashboard extends Component {
  constructor() {
    super();

    this.state = {
      reposition_body: {},
      order_befor_reposition: {},
      warning_message: '',
      draggable_process_for_popup: {},
      warnings: [],
      update_process_popup: false,
      draggable_process_popup: {},
      error_update_popup: false,
      spread: false,
      body_for_new_end_date: false,
      data_changed: {},
    };
    window.onpopstate = (event) =>
      closePopupOnBackButton(this.state.update_process_popup, (data) => {
        data && this.closeUpdateMenu();
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState !== this.state ||
      nextState.data_updated ||
      this.state.data_updated
    )
      return true;
    else return false;
  }

  componentDidUpdate(prevProps) {
    //sent to update function only if order_after_edit_from_reservation_popup is change --> get it from reservationPopup to redux
    let next_update_from_pop_order = this.props.mainPopup.order_after_edit_from_reservation_popup;
    let prev_update_from_pop_order = prevProps.mainPopup.order_after_edit_from_reservation_popup;

    if (
      Object.keys(next_update_from_pop_order).length !==
      Object.keys(prev_update_from_pop_order).length
      // next_update_from_pop_order !== prev_update_from_pop_order
    ) {
      if (Object.keys(next_update_from_pop_order).length > 0) {
        this.updateOrderAfterEditInPopup(next_update_from_pop_order);
      }
    }

    //if the order not cancelled - reposition
    if (!next_update_from_pop_order.cancelled) {
      if (
        this.props.mainPopup.new_due_date_after_edit_from_reservation_popup !==
        prevProps.mainPopup.new_due_date_after_edit_from_reservation_popup
      ) {
        if (this.props.mainPopup.new_due_date_after_edit_from_reservation_popup.length > 0) {
          this.repositionAfterEditInPopup(
            this.props.mainPopup.new_due_date_after_edit_from_reservation_popup,
          );
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orders.weeks_array.length !== nextProps.orders.weeks_array.length) {
      // set api data to redux for order adding api call to add order that was added to UI

      // set data according to mps_view
      let mps_days = this.props.login.user.mps_view && this.props.login.user.mps_view === 'day';
      //   start_day_formated
      let addOrderApiPayload = {
        from: mps_days
          ? nextProps.orders.weeks_array[0].start_day_formated
          : nextProps.orders.weeks_array[0].start_week,
        to: mps_days
          ? nextProps.orders.weeks_array[nextProps.orders.weeks_array.length - 1].start_day_formated
          : nextProps.orders.weeks_array[nextProps.orders.weeks_array.length - 1].start_week,
        view: 'XL',
        department_id: this.props.login.selectedDepartment
          ? this.props.login.selectedDepartment._id
          : null,
      };
      this.props.setAddOrderPayload(addOrderApiPayload);
    }
  }

  async componentDidMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname);

    let body = document.getElementsByTagName('BODY')[0];
    body.style.overflow = 'hidden';

    let result = await getIsRecipientReasone();
    if (result && result.ok) {
      let isRecipientReasone = result.result;
      this.props.getIsRecipientReasone(isRecipientReasone);
    }
  }

  componentWillUnmount() {
    let body = document.getElementsByTagName('BODY')[0];
    body.style.overflow = 'auto';
  }

  updateStateForWarningPopup = (
    draggable_process_for_popup_obj,
    reposition_body,
    order_data_prev_copy,
  ) => {
    this.setState({
      draggable_process_for_popup: draggable_process_for_popup_obj,
      reposition_body: reposition_body,
      order_befor_reposition: order_data_prev_copy,
    });
  };

  updateWarningMessage = (warning_message) => {
    this.setState({
      warning_message: warning_message,
    });
  };

  updateWarningsArray = (warnings_array) => {
    this.setState({
      warnings: warnings_array,
    });
  };

  updateOrderData = (order) => {
    let orders_data_copy = JSON.parse(JSON.stringify(this.props.orders.orders));
    let copy_order = JSON.parse(JSON.stringify(order)); // new

    orders_data_copy[copy_order.order_id] = copy_order;
    let orders_weeks_obj = {
      weeks_array: this.props.orders.weeks_array,
      orders: orders_data_copy,
    };

    this.props.setOrdersAndWeeksData(orders_weeks_obj);
  };

  closeReasonPopup = () => {
    let { order_befor_reposition, draggable_process_for_popup, spread } = this.state;
    this.props.updateReasonePopUp(false);
    this.updateOrderData(order_befor_reposition);
  };

  popupActionHandler = async (yes_no, constantData = false) => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
      body_for_new_end_date,
    } = this.state;
    if (isSameDay(new Date(reposition_body.from), new Date(reposition_body.to))) {
      reposition_body.from = moment(this.props.orders.weeks_array[0].start_day_formated)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      reposition_body.to = moment(
        this.props.orders.weeks_array[this.props.orders.weeks_array.length - 1].start_day_formated,
      ).toDate();
    }
    this.props.updateWarningPopup(false);

    if (yes_no === 'no') {
      this.updateOrderData(order_befor_reposition);
    } else {
      this.props.upadteLoaderPopup(true);
      if (constantData) {
        reposition_body.reason = constantData.reason.value;
        reposition_body.approved_by = constantData.approveName.value;

        let get_warnings;
        if (spread) {
          get_warnings = await getWarnings(reposition_body, true);
        } else {
          get_warnings = await getWarnings(reposition_body);
        }

        //warning check -->
        if (!get_warnings.ok) {
          this.updateWarningMessage(get_warnings.result);
          this.updateWarningsArray([]);
        } else {
          this.updateWarningMessage('');
          this.updateWarningsArray(get_warnings.result);
        }

        if (get_warnings.result.length > 0) {
          this.props.upadteLoaderPopup(false);
          this.props.updateWarningPopup(true);
          return;
        }
      }

      let order_reposition;
      if (draggable_process_for_popup.process.constant) {
        this.props.upadteLoaderPopup(true);
        order_reposition = await repositionForConst(reposition_body);
      } else {
        this.props.upadteLoaderPopup(true);
        if (spread) {
          order_reposition = await upateOrders(reposition_body, true);

          this.setState({
            spread: false,
          });
        } else {
          order_reposition = await upateOrders(reposition_body);
        }
      }

      if (order_reposition.ok === false) {
        this.props.upadteLoaderPopup(false);
        this.setState(
          {
            warning_message: order_reposition.result,
          },
          () => {
            this.updateErrorPopup(true);
          },
        );
        // send back the prev order position
        this.updateOrderData(order_befor_reposition);

        //CHEKC IF THERE IS NEW END DATE
        if (body_for_new_end_date && !draggable_process_for_popup.process.constant) {
          let res = await setEndDateForProcess(body_for_new_end_date);
          if (!res.ok) {
            this.updateWarningMessage(res.result);
            this.updateErrorPopup(true);
          }
          this.setState({
            body_for_new_end_date: false,
          });
        }

        return;
      } else {
        this.props.upadteLoaderPopup(false);
        // update the orders data with the correct order
        this.updateOrderData(order_reposition.result);

        //CHEKC IF THERE IS NEW END DATE
        if (body_for_new_end_date && !draggable_process_for_popup.process.constant) {
          let res = await setEndDateForProcess(body_for_new_end_date);
          if (!res.ok) {
            this.updateWarningMessage(res.result);
            this.updateErrorPopup(true);
          }
          this.setState({
            body_for_new_end_date: false,
          });
        }
      }
    }
  };

  closeUpdateMenu = () => {
    this.setState({
      update_process_popup: false,
      draggable_process_popup: {},
    });
  };

  draggableProcess = (draggable_process) => {
    let process_obj_drag_popup = { process: draggable_process };
    let process_obj = {
      proccess: draggable_process,
      client_name: draggable_process.client_name,
      order_number: draggable_process.order_number,
    };

    this.setState(
      {
        draggable_process_popup: process_obj,
        draggable_process_for_popup: process_obj_drag_popup,
      },
      () => {
        this.setState({
          update_process_popup: true,
        });
      },
    );
  };

  openUpdateMenuPopup = (process) => {
    this.draggableProcess(process);
  };

  updateOrderProcesssesAfterSubmitPopup = async (body) => {
    const { order_id, view } = body;
    const responce = await getOrderById(order_id, view);
    const order = responce.orders;
    let temp_order = this.props.orders.orders;
    this.props.setOrdersAndWeeksData({
      weeks_array: responce.weeks_array,
      orders: {
        ...temp_order,
        ...order,
      },
    });
  };

  submitUpdatesFromPopup = async (body, constant, refetch, update_process_res, is_preview) => {
    body.date = new Date(new Date(body.date).setHours(4));

    let new_body = {
      _id: body._id,
      date: body.endDate,
      actual_duration: body.actual_duration,
    };

    if (moment(body.date).startOf('day').isSame(moment(body.process.process_date).startOf('day'))) {
      if (body.endDate) {
        // *** set end date - with new date from update popup ***
        let res = await setEndDateForProcess(new_body);

        if (!res.ok) {
          this.updateWarningMessage(res.result);
          this.updateErrorPopup(true);
        } else {
          const result = res.result;
        }
        //error handle
      }
      await this.updateOrderProcesssesAfterSubmitPopup(body);
      !is_preview && this.closeUpdateMenu();
      return;
    }

    // if the date is changed ---> constant popup

    let dates = findRangOfDatesFromWeeksArr(this.props.orders.weeks_array);
    body.from = dates.start;
    body.to = dates.end;

    let new_date = new Date(body.date);
    let old_date = new Date(this.state.draggable_process_for_popup.process.process_date);
    // if the new date bigger from the old date

    if (new_date > old_date) {
      this.props.isGreaterDate(true);
    } else {
      this.props.isGreaterDate(false);
    }

    this.closeUpdateMenu();
    let res;

    this.props.upadteLoaderPopup(true);

    if (constant) {
      let get_warnings = await getWarnings(body);
      if (!get_warnings.ok) {
        this.updateWarningMessage(get_warnings.result);
        this.updateWarningsArray([]);
      } else {
        this.updateWarningMessage('');
        this.updateWarningsArray(get_warnings.result);
      }

      if (get_warnings.result.length > 0) {
        this.props.upadteLoaderPopup(false);
        this.props.updateWarningPopup(true);
        return;
      }

      //new constant change;
      if (body.endDate) {
        this.setState({
          reposition_body: body,
          body_for_new_end_date: new_body,
        });
      } else {
        this.setState({ reposition_body: body });
      }

      this.props.updateConstantPopup(true);
      this.props.upadteLoaderPopup(false);
    } else {
      this.props.upadteLoaderPopup(false);
      // if not constant
      this.setState(
        {
          reposition_body: body,
        },
        () => {
          const isDetached = this.state.draggable_process_for_popup.process.is_detached;
          this.props.updateSpreadPopup(true);
        },
      );
    }
  };

  updateErrorPopup = (boolean) => {
    this.setState({
      error_update_popup: boolean,
    });
  };

  worningAndReposition = async () => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
    } = this.state;

    if (this.props.login.selectedDepartment._id) {
      reposition_body.department_id = this.props.login.selectedDepartment._id;
    }

    if (isSameDay(new Date(reposition_body.from), new Date(reposition_body.to))) {
      reposition_body.from = moment(this.props.orders.weeks_array[0].start_day_formated)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      reposition_body.to = moment(
        this.props.orders.weeks_array[this.props.orders.weeks_array.length - 1].start_day_formated,
      ).toDate();
    }
    // if(!spread){
    this.props.updateSpreadPopup(false);
    // }

    let get_warnings;

    if (spread) {
      get_warnings = await getWarnings(reposition_body, true);
    } else {
      get_warnings = await getWarnings(reposition_body);
    }

    if (!get_warnings.ok) {
      this.updateWarningMessage(get_warnings.result);
      this.updateWarningsArray([]);
      this.props.upadteLoaderPopup(true);
    } else {
      this.updateWarningMessage('');
      this.updateWarningsArray(get_warnings.result);
    }

    this.props.upadteLoaderPopup(true);
    let order_reposition;

    if (get_warnings.result.length === 0) {
      if (spread) {
        order_reposition = await upateOrders(reposition_body, true);

        this.setState({
          spread: false,
        });
      } else {
        order_reposition = await upateOrders(reposition_body);
      }

      if (!order_reposition.ok) {
        this.props.upadteLoaderPopup(false);
        this.setState(
          {
            warning_message: order_reposition.result,
          },
          () => {
            this.updateErrorPopup(true);
          },
        );
        // send back the prev order position
        this.updateOrderData(order_befor_reposition);
        return;
      } else {
        this.updateOrderData(order_reposition.result);
        this.props.upadteLoaderPopup(false);
        // update the orders data with the correct order
      }
    } else {
      //if warnings -> make warning popup
      this.props.upadteLoaderPopup(false); //for now
      this.props.updateWarningPopup(true);
      return;
    }

    // *** set end date - with new date from update popup ***
    let { process } = draggable_process_for_popup;
    if (process.original_duration) {
      reposition_body._id = process.original || process._id;
      let user = this.props.login.user;
      reposition_body.endDate = calculateEndDateAccordingToDuration(
        undefined,
        process,
        user,
        reposition_body.date,
        process.original_duration,
      );
    } else {
      this.updateOrderData(order_reposition.result);
    }

    if (reposition_body.endDate) {
      let new_body = {
        ...reposition_body,
        date: reposition_body.endDate,
      };
      let res = await setEndDateForProcess(new_body);
      if (res.ok) {
        this.updateOrderData(res.result);
      }
      if (!res.ok) {
        this.updateWarningMessage(res.result);
        this.updateErrorPopup(true);
      }
      //error handle
    }
  };

  spreadingTrue = () => {
    this.props.updateSpreadPopup(false);

    this.setState(
      {
        spread: true,
      },
      () => {
        if (this.props.login.user.reason_popup) {
          this.props.updateWarningPopup(true);
        }

        if (this.props.orders.is_greater_date) {
          if (!this.props.login.user.reason_popup) {
            this.handleSpread();
          }
        } else {
          this.worningAndReposition();
        }
      },
    );
  };

  cancleSpreading = () => {
    let { order_befor_reposition } = this.state;
    this.props.updateSpreadPopup(false);
    this.props.updateConstantPopup(false);
    this.updateOrderData(order_befor_reposition);
  };

  updateOrderBefoReposition = (order) => {
    this.setState({
      order_befor_reposition: order,
    });
  };

  handleSpread = async (reason_and_approveName) => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
    } = this.state;

    if (this.props.login.selectedDepartment._id) {
      reposition_body.department_id = this.props.login.selectedDepartment._id;
    }

    if (isSameDay(new Date(reposition_body.from), new Date(reposition_body.to))) {
      reposition_body.from = moment(this.props.orders.weeks_array[0].start_day_formated)
        .set({ hour: 14, minute: 0, second: 0 })
        .toDate();
      reposition_body.to = moment(
        this.props.orders.weeks_array[this.props.orders.weeks_array.length - 1].start_day_formated,
      ).toDate();
    }

    this.props.updateReasonePopUp(false);
    this.props.upadteLoaderPopup(true);

    if (reason_and_approveName) {
      reposition_body.reason = reason_and_approveName.reason.value;
      reposition_body.approved_by = reason_and_approveName.approveName.value;
    }

    let get_warnings = await getWarnings(reposition_body, true);
    if (!get_warnings.ok) {
      this.updateWarningMessage(get_warnings.result);
      this.updateWarningsArray([]);
    } else {
      this.updateWarningMessage('');
      this.updateWarningsArray(get_warnings.result);
    }

    if (get_warnings.result.length === 0) {
      if (this.props.login.user.type_of_factory === 'service') {
        let order_process = this.props.mainPopup.order_process;
        order_process?._id && !reposition_body?._id && (reposition_body['_id'] = order_process._id);
        this.props.setOrderProcessForReservationPopup({});
      }
      let order_reposition_res = await upateOrders(reposition_body, true);

      if (!order_reposition_res.ok) {
        this.props.upadteLoaderPopup(false);
        this.setState(
          {
            warning_message: order_reposition_res.result,
          },
          () => {
            this.updateErrorPopup(true);
          },
        );
        // send back the prev order position
        this.updateOrderData(order_befor_reposition);
      } else {
        this.updateOrderData(order_reposition_res.result);
        this.props.upadteLoaderPopup(false);
        // update the orders data with the correct order

        let { process } = draggable_process_for_popup;
        if (process?.original_duration) {
          reposition_body._id = process.original || process._id;
          let user = this.props.login.user;
          // reposition_body.endDate = calculateEndDateAccordingToDuration(undefined,process,user,reposition_body.date,process.original_duration);
        }
      }

      this.setState({
        spread: false,
      });
    } else {
      this.props.upadteLoaderPopup(false); //for now
      this.props.updateWarningPopup(true);
    }

    // *** set end date - with new date from update popup ***
    if (reposition_body.endDate) {
      let new_body = {
        ...reposition_body,
        date: reposition_body.endDate,
      };

      let res = await setEndDateForProcess(new_body);
      if (!res.ok) {
        this.updateWarningMessage(res.result);
        this.updateErrorPopup(true);
      } else {
        this.updateOrderData(res.result);
      }
    }
  };

  handleSpreadWithReason = async (reason_and_approveName) => {
    this.props.updateReasonePopUp(false);
    this.handleSpread(reason_and_approveName);
  };

  // update order after edit in reservation popup
  updateOrderAfterEditInPopup = (update_order) => {
    const { orders } = this.props;
    if (update_order.cancelled) {
      //empty date state to redux
      this.props.setNewDueDateAfterEditFromPopup('');
      let copy_orders = JSON.parse(JSON.stringify(orders.orders));
      delete copy_orders[update_order._id];
      this.props.setOrders(copy_orders);
    } else {
      let copy_orders_2 = JSON.parse(JSON.stringify(orders.orders));
      // update order processes
      copy_orders_2[update_order._id].processes = update_order.processes;
      copy_orders_2[update_order._id].columns = update_order.columns;
      // -----------------------------------------------
      copy_orders_2[update_order._id].client_name = update_order.client_name;
      copy_orders_2[update_order._id].order_number = update_order.order_number;
      copy_orders_2[update_order._id].started = update_order.started;
      copy_orders_2[update_order._id].city = update_order.city;

      //update quantity:
      let temp_data = copy_orders_2[update_order._id].processes?.forEach(
        (p) => (p.quantity = update_order.quantity),
      );

      //update project menager:
      let project_managers = copy_orders_2[update_order._id].departments_for_mps.find(
        (e) => e.name === 'מנהל פרויקט',
      );
      let new_manager;

      if (!project_managers) return;

      //   console.log(update_order.employees)
      for (let i = 0; i < update_order.employees.length; i++) {
        let manager = project_managers.employees.find((e) => e._id === update_order.employees[i]);
        if (manager) {
          new_manager = manager;
        }
      }

      if (project_managers)
        for (let i = 0; i < project_managers.employees.length; i++) {
          if (new_manager && project_managers.employees[i]._id === new_manager._id) {
            project_managers.employees[i].current = true;
          } else {
            project_managers.employees[i].current = false;
          }
        }

      let project_managers_copy = JSON.parse(JSON.stringify(project_managers));
      let index = copy_orders_2[update_order._id].departments_for_mps.findIndex(
        (p) => p.name === 'מנהל פרויקט',
      );
      copy_orders_2[update_order._id].departments_for_mps[index] = project_managers_copy;

      this.props.setOrders(copy_orders_2);
    }
  };

  // reposition order after edit in reservation popup
  repositionAfterEditInPopup = async (update_order) => {
    const { mainPopup, orders } = this.props;
    const isDetached = this.state.draggable_process_for_popup?.process?.is_detached;

    let copy_orders = JSON.parse(JSON.stringify(orders.orders));
    let selected_order = copy_orders[mainPopup.order_id];
    let last_process_id = mainPopup.order_data.last_process;
    let findLastProcessForReposition =
      selected_order && selected_order.processes.find((p) => p._id === last_process_id);

    if (!moment(mainPopup.order_data.due_date).isSame(moment(update_order))) {
      //not the same dates - reposition flow!!!!!

      let oldDate = moment(mainPopup.order_data.due_date);
      var newDate = moment(update_order);

      if (newDate > oldDate) {
        this.props.isGreaterDate(true);
      } else {
        this.props.isGreaterDate(false);
      }

      //body
      let range_of_dates = findRangOfDatesFromWeeksArr(this.props.orders.weeks_array);
      let order_data_prev_copy_state = JSON.parse(
        JSON.stringify(this.props.orders.orders[mainPopup.order_id]),
      );
      let process_obj_state = { process: findLastProcessForReposition };

      let body = {
        order_id: mainPopup.order_id,
        _id: last_process_id,
        date: update_order,
        view: 'XL',
        from: range_of_dates.start,
        to: range_of_dates.end,
      };

      this.updateStateForWarningPopup(process_obj_state, body, order_data_prev_copy_state);

      // *** if is_detached === true ***
      if (findLastProcessForReposition?.is_detached) {
        let get_warnings = await getWarnings(body);
        if (!get_warnings.ok) {
          // need handle warning!!!!!
          this.updateWarningMessage(get_warnings.result);
          this.updateWarningsArray([]);
        } else {
          this.updateWarningMessage('');
          this.updateWarningsArray(get_warnings.result);
        }

        this.props.upadteLoaderPopup(true);
        let order_reposition;
        if (get_warnings.result.length === 0) {
          //no warning -> make reposition post req
          order_reposition = await upateOrders(body); /// send the new reposition
          // }
          // remove loader
          this.props.upadteLoaderPopup(false);

          if (!order_reposition.ok) {
            alert('לא ניתן להזיז את התהליך שבחרת');
            // this.updateWarningMessage("לא ניתן להזיז את התהליך שבחרת");
            // this.updateErrorPopup(true);
            return;
          } else {
            // update the orders data with the correct order
            this.updateOrderData(order_reposition.result);
          }
        } else {
          //if warnings -> make warning popup
          this.props.upadteLoaderPopup(false); //for now
          this.props.updateWarningPopup(true);
          return;
        }
      } else {
        if (findLastProcessForReposition?.constant) {
          this.updateWarningMessage('');
          this.props.updateConstantPopup(true);
        } else {
          this.updateWarningMessage('');
          this.props.updateSpreadPopup(isDetached ? false : true);
        }
      }
    } else {
      return;
    }
  };

  render() {
    const { user } = this.props.login;
    const {
      warning_message,
      warnings,
      draggable_process_for_popup,
      update_process_popup,
      draggable_process_popup,
      error_update_popup,
      data_changed,
    } = this.state;
    const user_or_order_type = this.props.login.user.select_order_process_color_by;
    const { off_days, holidays } = this.props.login.user;
    return (
      <div>
        {update_process_popup ? (
          <UpdateProccessPopup
            offDays={off_days}
            holidays={holidays}
            selectedProcess={draggable_process_popup}
            view={'XL'}
            closeUpdateMenu={this.closeUpdateMenu}
            submitUpdatesFromPopup={this.submitUpdatesFromPopup}
          />
        ) : null}

        {error_update_popup ? (
          <ErrorPopup
            afterConfirmationError={warning_message}
            updatePopup={this.updateErrorPopup}
          />
        ) : null}

        {this.props.orders.warningPopup ? (
          <OnDragPopup
            warningApiPayload={draggable_process_for_popup}
            popupActionHandler={this.popupActionHandler}
            afterConfirmationError={warning_message}
            warnings={warnings}
          />
        ) : null}
        {/* commented reason popup to show it on according to 'alert' checkbox from admin panel */}
        {/* {this.props.orders.reason_popup ? (
          <ReasonPopup
            handleSpreadWithReason={this.handleSpreadWithReason}
            cancelPopup={() => this.closeReasonPopup()}
          />
        ) : null} */}

        {this.props.orders.spread_popup ? (
          <SpreadingPopup
            spreadingFalse={this.worningAndReposition}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
          />
        ) : null}

        {this.props.orders.constant_popup ? (
          <ConstantPopup
            resetReposition={null}
            spreadingFalse={this.worningAndReposition}
            popupActionHandler={this.popupActionHandler}
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
          />
        ) : null}

        <Calender
          updateOrderBefoReposition={this.updateOrderBefoReposition}
          openUpdateMenuPopup={this.openUpdateMenuPopup}
          updateOrderData={this.updateOrderData}
          updateWarningsArray={this.updateWarningsArray}
          updateWarningMessage={this.updateWarningMessage}
          updateStateForWarningPopup={this.updateStateForWarningPopup}
          user_or_order_type={user_or_order_type}
          data_changed={data_changed}
        />
        {this.props.loaderPopup.loaderPopup ? <Loader /> : null}
      </div>
    );
  }
}

function mapStateToProps({ router, login, route, orders, loaderPopup, mainPopup, monthResource }) {
  return { router, login, loaderPopup, orders, route, mainPopup, monthResource };
}
export default connect(mapStateToProps, actions)(YearlyDashboard);
