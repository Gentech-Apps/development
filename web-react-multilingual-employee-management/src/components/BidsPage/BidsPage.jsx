import React, { Component } from 'react';
import moment from 'moment';
//sass
import '../../sass/BidsPage/_bids-page.scss';
//func
import { getBids } from '../../functions/api/orders';
//comps
import Popup from '../Header/Parts/Popup/Popup';
import Loader from '../LoaderNew/Loader';
//
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import DropDownBox from '../Header/Parts/Popup/Parts/DropDownBox/DropDownBox';
import { updateClient } from '../../functions/api/popup';
import ErrorPopup from '../NavBar/ErrorPopup/ErrorPopup';
import Arrow_1 from '../../images/general/arrow_1.svg';
import Arrow_2 from '../../images/general/arrow_2.svg';
import SideBar from '../SideBar/SideBar';

import {
  getOrders,
  getOrdersCount,
  getWarnings,
  upateOrders,
  repositionForConst,
  setEndDateForProcess,
} from '../../functions/api/orders';
import { findRangOfDatesFromWeeksArr } from '../../functions/data/weeks_generator';
import { getClientDateForPopup } from '../../functions/api/popup';

import OnDragPopup from '../updatePopups/OnDragPopup';
import ReasonPopup from '../updatePopups/ReasonPopup';
import SpreadingPopup from '../updatePopups/SpreadingPopup';
import ConstantPopup from '../updatePopups/ConstantPopup';

class BidsPage extends Component {
  constructor() {
    super();

    this.state = {
      page: 0,
      limit: 20,
      order: 1,
      sort: 'due_date',
      popup: false,
      loader: true,
      blockDataFetch: false,
      selectedBid: {},
      orders: [],
      status_input_options: [
        { name: 'הצעה', _id: false },
        { name: 'הזמנה', _id: true },
        { name: 'בוטלה', _id: false },
      ],
      error_text: '',
      show_error_popup: false,
      customField: false,
      //update from popup
      draggable_process_for_popup: {},
      reposition_body: {},
      order_befor_reposition: {},
      warning_message: '',
      warnings: [],
      spread: false,
      body_for_new_end_date: false,
      error_update_popup: false,
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.mainPopup.show_popup && !nextProps.mainPopup.show_popup) {
      this.setState({ loader: true });
      const { page, limit, order, sort } = this.state;
      let pageCopy = page;
      if (page === 0) pageCopy = 20;
      let res = await getBids(0, pageCopy, order, sort);
      this.setState(
        {
          orders: res.result,
          loader: false,
          page,
        },
        () => {
          //set custom column name (if exist) to put in header
          for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i].custom_column_name) {
              this.setState({ customField: this.state.orders[i].custom_column_name });
              break;
            }
          }
        },
      );
    }
  }

  async componentDidMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname); // to update the location path in the header tabs

    window.addEventListener('scroll', (e) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.fetchMoreData();
      }
    });

    this.fetchDateFirstTime();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', (e) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.fetchMoreData();
      }
    });
  }

  componentDidUpdate(prevProps) {
    let next_update_from_pop_order = this.props.mainPopup.order_after_edit_from_reservation_popup;
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

  //for update popup
  updateWarningMessage = (warning_message) => {
    this.setState({
      warning_message: warning_message,
    });
  };

  //for update popup
  updateWarningsArray = (warnings_array) => {
    this.setState({
      warnings: warnings_array,
    });
  };

  //for update popup
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

  //for update popup

  updateErrorPopup = (boolean) => {
    this.setState({
      error_update_popup: boolean,
    });
  };

  //for update popup

  popupActionHandler = async (yes_no, constantData = false) => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
      body_for_new_end_date,
    } = this.state;

    this.props.updateWarningPopup(false);

    if (yes_no === 'no') {
      // this.updateOrderData(order_befor_reposition)
      return;
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
        //CHEKC IF THERE IS NEW END DATE
        if (body_for_new_end_date) {
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
        this.fetchDateFirstTime();

        //CHEKC IF THERE IS NEW END DATE
        if (body_for_new_end_date) {
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

  //for update popup
  handleSpreadWithReason = async (reason_and_approveName) => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
    } = this.state;

    this.props.updateReasonePopUp(false);
    this.props.upadteLoaderPopup(true);
    reposition_body.reason = reason_and_approveName.reason.value;
    reposition_body.approved_by = reason_and_approveName.approveName.value;

    let get_warnings = await getWarnings(reposition_body, true);
    if (!get_warnings.ok) {
      this.updateWarningMessage(get_warnings.result);
      this.updateWarningsArray([]);
    } else {
      this.updateWarningMessage('');
      this.updateWarningsArray(get_warnings.result);
    }

    if (get_warnings.result.length === 0) {
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
      } else {
        this.props.upadteLoaderPopup(false);
        this.fetchDateFirstTime();
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
        _id: reposition_body._id,
        date: reposition_body.endDate,
      };

      let res = await setEndDateForProcess(new_body);
      if (!res.ok) {
        this.updateWarningMessage(res.result);
        this.updateErrorPopup(true);
      }
    }
  };

  worningAndReposition = async () => {
    let {
      reposition_body,
      order_befor_reposition,
      draggable_process_for_popup,
      spread,
    } = this.state;

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
        return;
      } else {
        this.props.upadteLoaderPopup(false);
        this.fetchDateFirstTime();
      }
    } else {
      //if warnings -> make warning popup
      this.props.upadteLoaderPopup(false); //for now
      this.props.updateWarningPopup(true);
      return;
    }

    // *** set end date - with new date from update popup ***
    if (reposition_body.endDate) {
      let new_body = {
        _id: reposition_body._id,
        date: reposition_body.endDate,
      };
      let res = await setEndDateForProcess(new_body);
      if (!res.ok) {
        this.updateWarningMessage(res.result);
        this.updateErrorPopup(true);
      }
      //error handle
    }
  };

  //for update popup
  repositionAfterEditInPopup = async (update_order) => {
    const { mainPopup } = this.props;

    let order_data_for_popup = await getClientDateForPopup(mainPopup.order_id);

    let order_data_from_api;

    if (order_data_for_popup.ok) {
      order_data_from_api = order_data_for_popup.result;
    } else {
      console.log('לא ניתן לעדכן הזמנה זו');
      return;
    }

    let last_process_id = order_data_from_api.last_process;
    let findLastProcessForReposition = order_data_from_api.last_order_process[0];

    if (!moment(mainPopup.order_data.due_date).isSame(moment(update_order))) {
      let oldDate = moment(mainPopup.order_data.due_date);
      var newDate = moment(update_order);

      if (newDate > oldDate) {
        this.props.isGreaterDate(true);
      } else {
        this.props.isGreaterDate(false);
      }

      let order_data_prev_copy_state = JSON.parse(JSON.stringify(findLastProcessForReposition));
      let process_obj_state = { process: findLastProcessForReposition };

      let body = {
        order_id: mainPopup.order_id,
        _id: last_process_id,
        date: update_order,
        view: 'L',
        from: moment().format(),
        to: moment().add(10, 'days').format(),
      };

      this.updateStateForWarningPopup(process_obj_state, body, order_data_prev_copy_state);

      // *** if is_detached === true ***
      if (findLastProcessForReposition.is_detached) {
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

            return;
          } else {
            // update the orders data with the correct order
            this.fetchDateFirstTime();
          }
        } else {
          //if warnings -> make warning popup
          this.props.upadteLoaderPopup(false); //for now
          this.props.updateWarningPopup(true);
          return;
        }
      } else {
        //if constant:
        // this.props.updateConstantPopup(true)

        //if not:
        // this.props.updateSpreadPopup(true)

        if (findLastProcessForReposition.constant) {
          this.updateWarningMessage('');
          this.props.updateConstantPopup(true);
        } else {
          this.updateWarningMessage('');
          this.props.updateSpreadPopup(true);
        }
      }
    } else {
      return;
    }
  };

  fetchMoreData = async () => {
    if (this.state.blockDataFetch) return;

    let page = this.state.page;
    let limit = this.state.limit;
    const { order, sort } = this.state;
    this.setState({ loader: true });

    let res = await getBids(page + limit, limit, order, sort);
    if (res.result.length > 0) {
      this.setState(
        {
          page: page + limit,
        },
        () => {
          let newState = this.state.orders.map((item) => item);
          newState = newState.concat(res.result);
          this.setState(
            {
              orders: newState,
              loader: false,
            },
            () => {
              //set custom column name (if exist) to put in header
              for (let i = 0; i < this.state.orders.length; i++) {
                if (this.state.orders[i].custom_column_name) {
                  this.setState({ customField: this.state.orders[i].custom_column_name });
                  break;
                }
              }
            },
          );
        },
      );
    } else {
      this.setState({
        loader: false,
        blockDataFetch: true,
      });
    }
  };

  fetchDateFirstTime = async () => {
    const { page, limit, order, sort } = this.state;
    let res = await getBids(page, limit, order, sort);

    this.setState(
      {
        orders: res.result,
        loader: false,
      },
      () => {
        //set custom column name (if exist) to put in header
        for (let i = 0; i < this.state.orders.length; i++) {
          if (this.state.orders[i].custom_column_name) {
            this.setState({ customField: this.state.orders[i].custom_column_name });
            break;
          }
        }
      },
    );

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.fetchMoreData();
    }
  };

  sortBy = (sort_by) => {
    const { order, sort } = this.state;

    if (sort_by === 'due_date') {
      //if sorted by due_date --> change only the order 1 \ -1
      if (sort === 'due_date') {
        this.toogleOrderSort();
        return;
      } else {
        //when sort data -> start from page 0
        this.setState({ page: 0, sort: 'due_date', order: 1 }, () => {
          this.fetchDateFirstTime();
        });
      }
    } else if (sort_by === 'custom_column_date') {
      if (sort === 'custom_column_date') {
        this.toogleOrderSort();
        return;
      } else {
        //when sort data -> start from page 0
        this.setState({ page: 0, sort: 'custom_column_date', order: 1 }, () => {
          this.fetchDateFirstTime();
        });
      }
    } else if (sort_by === 'created_at') {
      if (sort === 'created_at') {
        this.toogleOrderSort();
        return;
      } else {
        //when sort data -> start from page 0
        this.setState({ page: 0, sort: 'created_at', order: 1 }, () => {
          this.fetchDateFirstTime();
        });
      }
    } else if (sort_by === 'total') {
      if (sort === 'total') {
        this.toogleOrderSort();
        return;
      } else {
        //when sort data -> start from page 0
        this.setState({ page: 0, sort: 'total', order: 1 }, () => {
          this.fetchDateFirstTime();
        });
      }
    } else if (sort_by === 'order_number') {
      if (sort === 'order_number') {
        this.toogleOrderSort();
        return;
      } else {
        //when sort data -> start from page 0
        this.setState({ page: 0, sort: 'order_number', order: 1 }, () => {
          this.fetchDateFirstTime();
        });
      }
    }
  };

  toogleOrderSort = () => {
    const { order, sort } = this.state;

    let new_order;

    if (order === 1) {
      new_order = -1;
    } else {
      new_order = 1;
    }
    this.setState(
      {
        page: 0,
        order: new_order,
      },
      () => {
        this.fetchDateFirstTime();
      },
    );
  };

  setSelectedBid = (e, selectedBid) => {
    e.stopPropagation();
    this.props.setOrderDataForPopup(selectedBid);
    this.props.setOrderIdForPopup(selectedBid._id);
    this.props.showMainPopup(true);
  };

  formatNumber = (num) => {
    if (num % 1 !== 0) num = num.toFixed(2);
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  statusDropDownOptions = (status) => {
    const { status_input_options } = this.state;
    const { form_data } = this.props;
    let status_input_options_copy = JSON.parse(JSON.stringify(status_input_options));
    let filter_status_input_options_copy;
    if (status.started) {
      filter_status_input_options_copy = status_input_options_copy.filter(
        (i) => i.name !== 'הזמנה',
      );
    } else {
      filter_status_input_options_copy = status_input_options_copy.filter((i) => i.name !== 'הצעה');
    }
    return filter_status_input_options_copy;
  };

  updateOrder = async (name, option) => {
    this.props.upadteLoaderPopup(true);
    //api call
    const { selectedBid } = this.state;
    let copy_selectedBid = JSON.parse(JSON.stringify(selectedBid));

    let body = {
      _id: copy_selectedBid._id,
      [name]: option, // started or cancelled
      client_name: copy_selectedBid.client_name,
      client_phone: copy_selectedBid.client_phone,
      client_email: copy_selectedBid.client_email,
      employees: copy_selectedBid.employees,
      collection_stages: copy_selectedBid.collection_stages,
      quantity: copy_selectedBid.quantity,
      value: copy_selectedBid.value,
      due_date: copy_selectedBid.due_date,
      order_number: copy_selectedBid.order_number,
    };

    let res = await updateClient(body);
    if (res.ok) {
      // find the order in the orders AND UPDATE
      this.updateOrdersAfterUpdate(res.result);
    } else {
      this.setState(
        {
          error_text: res.result,
        },
        () => {
          this.showErorrPopup(true);
          //if error - update to the prev choice
          this.updateOrdersAfterUpdate(selectedBid);
        },
      );
    }
  };

  updateOrdersAfterUpdate = (update_order) => {
    const { orders, selectedBid } = this.state;
    let copy_orders = JSON.parse(JSON.stringify(orders));

    if (update_order.started || update_order.cancelled) {
      let new_orders = copy_orders.filter((o) => o._id !== update_order._id);
      this.setState({
        orders: new_orders,
        selectedBid: {},
      });
    }

    this.props.upadteLoaderPopup(false);
  };

  saveSelectedOrder = (selectedBid) => {
    this.setState({
      selectedBid: selectedBid,
    });
    this.redirectToQuotePage(selectedBid);
  };

  redirectToQuotePage = (selectedBid) => {
    const { customer_id, _id } = selectedBid;
    const factoryName = this.props.login.user.factory_name;
    if (customer_id && _id) {
      this.props.history.push(`/${factoryName}/customers-page/create-quote/${customer_id}/${_id}`);
    }
  };

  showErorrPopup = (boolean) => {
    this.setState({
      showErorrPopup: boolean,
    });
  };

  cancleSpreading = () => {
    let { order_befor_reposition } = this.state;
    this.props.updateSpreadPopup(false);
    this.props.updateConstantPopup(false);
    // this.updateOrderData(order_befor_reposition)
  };

  closeReasonPopup = () => {
    this.props.updateReasonePopUp(false);
  };

  spreadingTrue = () => {
    this.props.updateSpreadPopup(false);

    this.setState(
      {
        spread: true,
      },
      () => {
        if (this.props.orders.is_greater_date) {
          this.props.updateReasonePopUp(true);
        } else {
          this.worningAndReposition();
        }
      },
    );
  };

  render() {
    const {
      orders,
      order,
      selectedBid,
      popup,
      sort,
      loader,
      error_text,
      show_error_popup,
      customField,
      draggable_process_for_popup,
      warning_message,
      warnings,
      error_update_popup,
    } = this.state;

    return (
      <div className="bids__page__container">
        <SideBar />

        <div className="bids-page">
          <h1>הצעות מחיר</h1>
          <header>
            <div
              style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}
              onClick={() => {
                this.sortBy('order_number');
              }}
            >
              מספר הצעה{' '}
              {sort === 'order_number' ? (
                <img
                  className="sort__arrow__icon"
                  src={order === -1 ? Arrow_1 : Arrow_2}
                  alt="arrow"
                />
              ) : null}
            </div>
            <div style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}>
              שם לקוח
            </div>
            <div style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}>
              נייד
            </div>
            <div style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}>
              מייל
            </div>
            <div
              style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}
              onClick={() => {
                this.sortBy('total');
              }}
            >
              ערך עסקה{' '}
              {sort === 'total' ? (
                <img
                  className="sort__arrow__icon"
                  src={order === -1 ? Arrow_1 : Arrow_2}
                  alt="arrow"
                />
              ) : null}
            </div>
            {customField ? (
              <div
                style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}
                onClick={() => {
                  this.sortBy('custom_column_date');
                }}
              >
                {customField}{' '}
                {sort === 'custom_column_date' ? (
                  <img
                    className="sort__arrow__icon"
                    src={order === -1 ? Arrow_1 : Arrow_2}
                    alt="arrow"
                  />
                ) : null}
              </div>
            ) : null}
            <div
              style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}
              onClick={() => {
                this.sortBy('created_at');
              }}
            >
              תאריך פתיחת הצעה{' '}
              {sort === 'created_at' ? (
                <img
                  className="sort__arrow__icon"
                  src={order === -1 ? Arrow_1 : Arrow_2}
                  alt="arrow"
                />
              ) : null}
            </div>
            <div
              style={
                customField
                  ? { width: `calc(100% / 8)`, cursor: 'pointer' }
                  : { width: `calc(100% / 7)`, cursor: 'pointer' }
              }
              onClick={() => {
                this.sortBy('due_date');
              }}
            >
              תאריך אספקה{' '}
              {sort === 'due_date' ? (
                <img
                  className="sort__arrow__icon"
                  src={order === -1 ? Arrow_1 : Arrow_2}
                  alt="arrow"
                />
              ) : null}{' '}
            </div>
            <div style={customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }}>
              סטטוס
            </div>
          </header>

          <table className="bids-page__orders">
            {orders && orders.length > 0 ? (
              orders.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="bids-page__orders__bid"
                    onClick={() => {
                      this.saveSelectedOrder(item);
                    }}
                  >
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {item.order_number}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {item.client_name}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {item.client_phone}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {item.client_email}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {item.value ? '₪' + this.formatNumber(item.value) : '₪' + '0'}
                    </div>

                    {customField ? (
                      <div
                        style={
                          customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                        }
                      >
                        {item.custom_column_date
                          ? moment(item.custom_column_date).format('DD/MM/YYYY')
                          : null}
                      </div>
                    ) : null}

                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {moment(item.created_at).format('DD/MM/YYYY')}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                    >
                      {moment(item.due_date).format('DD/MM/YYYY')}
                    </div>
                    <div
                      style={
                        customField ? { width: `calc(100% / 8)` } : { width: `calc(100% / 7)` }
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropDownBox
                        key={item._id}
                        validate_all_form={false}
                        title={false}
                        data={this.statusDropDownOptions(item)}
                        updateForm={this.updateOrder}
                        name={'started'}
                        validate_message={'יש לבחור סטטוס'}
                        selected_step={item.started ? 'הזמנה' : 'הצעה'}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        this.setSelectedBid(e, item);
                      }}
                    >
                      הצג
                    </button>
                  </div>
                );
              })
            ) : loader ? (
              <div className="bids-loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <div className="no__bids">אין הצעות מחיר</div>
            )}
          </table>

          {show_error_popup ? (
            <ErrorPopup afterConfirmationError={error_text} updatePopup={this.showErorrPopup} />
          ) : null}

          {this.props.loaderPopup.loaderPopup ? <Loader /> : null}
        </div>

        {this.props.orders.warningPopup ? (
          <OnDragPopup
            warningApiPayload={draggable_process_for_popup}
            popupActionHandler={this.popupActionHandler}
            afterConfirmationError={warning_message}
            warnings={warnings}
          />
        ) : null}

        {error_update_popup ? (
          <ErrorPopup
            afterConfirmationError={warning_message}
            updatePopup={this.updateErrorPopup}
          />
        ) : null}

        {this.props.orders.reason_popup ? (
          <ReasonPopup
            handleSpreadWithReason={this.handleSpreadWithReason}
            cancelPopup={() => this.closeReasonPopup()}
          />
        ) : null}

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
            spreadingTrue={this.spreadingTrue}
            cancleSpreading={this.cancleSpreading}
          />
        ) : null}
      </div>
    );
  }
}

// export default BidsPage

function mapStateToProps({ router, route, orders, csv, mainPopup, loaderPopup, login }) {
  return { router, route, orders, csv, mainPopup, loaderPopup, login };
}
export default connect(mapStateToProps, actions)(BidsPage);
