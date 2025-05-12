import React, { Component } from 'react';
import Column from './Parts/Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import '../../../../../sass/dragAndDrop/dragAndDrop.scss';
import { polyfill } from 'es6-promise';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import DropDownContainer from '../../../../DropDownContainer/DropDownContainer';
import {
  replaceOrderEmployee,
  getWarnings,
  upateOrders,
  repositionForConst,
} from '../../../../../functions/api/orders';
import problem_icon from '../../../../../images/icons/problem.svg';
import { findRangOfDatesFromWeeksArr } from '../../../../../functions/data/weeks_generator';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/actions';
import OnDragPopup from '../../../../updatePopups/OnDragPopup';
import { getClientDateForPopup } from '../../../../../functions/api/popup';
import { PER_USER, VIEW_ONLY, NO_FINANCIALS } from '../../../../../tools/keys/variables';
import { generalGetRequest } from '../../../../../functions/api/general';
import Warning_sign from '../../../../../images/general/warning-sign.svg';

let uniqid = require('uniqid');

polyfill();

const CATEGORY_ALLOW_SHOW_POPUP = {
  WORK: 'work',
};

class DragAndDrop extends Component {
  constructor() {
    super();
    this.state = {
      // order_data : props.order,
      draggable_process: '',
      draggable_process_for_popup: {},
      reposition_body: {},
    };
  }

  onDragEnd = async (result) => {
    let { order_data, draggable_process } = this.state;
    let { order, is_drag_update, orders } = this.props;
    let { weeks_array } = orders;
    const { destination, source, draggableId } = result;
    let drag_order = this.props.orders.orders[order];
    let drag_order_copy = JSON.parse(JSON.stringify(drag_order));
    is_drag_update(false);
    //****************************** */ forbid users with status 500 or 200 move forvard
    const getColumnNumber = (colId) => colId.split('-')[1];
    const destinationColNumber = getColumnNumber(destination.droppableId);
    const sourceColNumber = getColumnNumber(source.droppableId);
    const privileges = this.props.login.user.privileges;
    const isViewOnlyOrPerUser = privileges.find((privilege) => privilege === VIEW_ONLY);
    if (destinationColNumber > sourceColNumber && isViewOnlyOrPerUser) {
      return;
    }
    // ********************************************************************************
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = drag_order_copy.columns[source.droppableId];
    const finish = drag_order_copy.columns[destination.droppableId];

    if (start === finish) {
      //***Avoid moving on the same week***
      return;
    }

    // Moving from one list to another
    const start_process_ids = Array.from(start.processId);
    start_process_ids.splice(source.index, 1);

    const new_start = {
      ...start,
      processId: start_process_ids,
    };

    const finish_process_ids = Array.from(finish.processId);
    finish_process_ids.splice(destination.index, 0, draggableId);
    const new_finish = {
      ...finish,
      processId: finish_process_ids,
    };

    const new_state = {
      ...drag_order_copy,
      columns: {
        ...drag_order_copy.columns,
        [new_start.id]: new_start,
        [new_finish.id]: new_finish,
      },
    };

    // find the dates and make post req with the new date

    let start_week_num = Number(start.id.slice(7));
    let finish_week_num = Number(finish.id.slice(7));

    let difference_between_weeks = finish_week_num - start_week_num;
    let new_date_process = '';

    let range_of_dates = findRangOfDatesFromWeeksArr(this.props.orders.weeks_array);

    //go to the past
    let new_date;
    if (difference_between_weeks < 0) {
      this.props.isGreaterDate(false);
      let positive_num = Math.abs(difference_between_weeks);

      if (this.props.mpsView === 'day') {
        // new_date = moment(draggable_process.process_date).subtract(
        //     positive_num,
        //     "days"
        //   );

        let date = weeks_array.find((day) => day.id === destination.droppableId);
        new_date = moment(date.start_day_for_mps_day);
      } else {
        new_date = moment(draggable_process.process_date).subtract(positive_num, 'weeks');
      }

      new_date_process = new_date._d;

      let reposition_body = {
        order_id: draggable_process.order_id,
        _id: draggable_process._id,
        date: new_date_process.toISOString(),
        view: 'XL',
        from: range_of_dates.start,
        to: range_of_dates.end,
      };

      this.checkReposition(new_state, reposition_body);

      //go to the future
    } else {
      this.props.isGreaterDate(true);

      if (this.props.mpsView === 'day') {
        // new_date = moment(draggable_process.process_date).add(
        //     difference_between_weeks,
        //     "days"
        //   );
        let date = weeks_array.find((day) => day.id === destination.droppableId);
        new_date = moment(date.start_day_for_mps_day);
      } else {
        new_date = moment(draggable_process.process_date).add(difference_between_weeks, 'weeks');
      }

      new_date_process = new_date._d;

      let reposition_body = {
        order_id: draggable_process.order_id,
        _id: draggable_process._id,
        date: new_date_process.toISOString(),
        view: 'XL',
        from: range_of_dates.start,
        to: range_of_dates.end,
      };

      this.checkReposition(new_state, reposition_body);
    }
  };

  checkReposition = async (new_state, body) => {
    let { order } = this.props;

    let { draggable_process } = this.state;
    let process_obj = { process: draggable_process };

    this.props.updateOrderData(new_state); // the drag befor reposition post req  --> change the position Immediatly  === not good !!!!!!!

    let order_data_prev_copy = JSON.parse(JSON.stringify(this.props.orders.orders[order]));

    this.props.updateStateForWarningPopup(process_obj, body, order_data_prev_copy);
    // *** if is_detached === true ***
    if (draggable_process.is_detached === true) {
      let get_warnings = await getWarnings(body);
      if (!get_warnings.ok) {
        this.props.updateWarningMessage(get_warnings.result);
        this.props.updateWarningsArray([]);
        this.props.upadteLoaderPopup(true);
      } else {
        this.props.updateWarningMessage('');
        this.props.updateWarningsArray(get_warnings.result);
      }

      this.props.upadteLoaderPopup(true);
      let order_reposition;
      if (get_warnings.result.length === 0) {
        order_reposition = await upateOrders(body); /// send the new reposition
        this.props.upadteLoaderPopup(false);

        if (!order_reposition.ok) {
          this.props.updateWarningMessage('לא ניתן להזיז את התהליך שבחרת');
          this.props.updateWarningPopup(true);
          // alert("לא ניתן להזיז את התהליך שבחרת");
          // send back the prev order position
          this.props.updateOrderData(order_data_prev_copy);
          return;
        } else {
          // update the orders data with the correct order
          this.props.updateOrderData(order_reposition.result);
        }
      } else {
        //if warnings -> make warning popup
        this.props.upadteLoaderPopup(false); //for now
        this.props.updateWarningPopup(true);
        return;
      }
    } else {
      if (draggable_process.constant) {
        this.props.updateWarningMessage('');
        this.props.updateConstantPopup(true);
      } else {
        this.props.updateWarningMessage('');
        this.props.updateSpreadPopup(true);
      }
    }
  };

  draggableProcess = (process) => {
    this.setState({
      draggable_process: process,
    });
  };

  findDepartmentEmployees = (department) => {
    let { order } = this.props;
    let order_data_prev_copy = JSON.parse(JSON.stringify(this.props.orders.orders[order]));

    let departmentObj =
      order_data_prev_copy.departments_for_mps != null &&
      order_data_prev_copy.departments_for_mps.find((e) =>
        department ? e.name === department : e.project_manager,
      );
    if (departmentObj) {
      let current_employee_obj = departmentObj.employees.find((c) => c.current);
      departmentObj.current_employee = current_employee_obj ? current_employee_obj : '';
      return departmentObj;
    } else {
      return false;
    }
  };

  getCustomField = () => {
    let { order } = this.props;
    let order_data_prev_copy = JSON.parse(JSON.stringify(this.props.orders.orders[order]));
    if (order_data_prev_copy.info_panel_custom_inputs != null) {
      return order_data_prev_copy.info_panel_custom_inputs;
    } else {
      return [];
    }
  };

  changeEmployee = (update_order) => {
    let { orders } = this.props;
    //update project menager:
    let copy_orders_2 = JSON.parse(JSON.stringify(orders.orders));

    let project_managers = copy_orders_2[update_order._id].departments_for_mps.find(
      (e) => e.name === 'מנהל פרויקט',
    );
    let new_manager;

    for (let i = 0; i < update_order.employees.length; i++) {
      let manager = project_managers.employees.find((e) => e._id === update_order.employees[i]);
      if (manager) {
        new_manager = manager;
      }
    }

    for (let i = 0; i < project_managers.employees.length; i++) {
      if (project_managers.employees[i]._id === new_manager._id) {
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
  };

  replaceEmployee = async (option, prev_employee) => {
    let prev_employee_id;

    if (prev_employee) {
      prev_employee_id = prev_employee._id;
    } else {
      prev_employee_id = '';
    }

    let { order } = this.props;
    let body = {
      previous_employee_id: prev_employee_id,
      new_employee_id: option._id,
      order_id: this.props.orders.orders[order].order_id,
    };

    let result = await replaceOrderEmployee(body);
    if (result.ok === false) {
      alert('העובד לא הוחלף');
      return false;
    } else {
      this.changeEmployee(result);
    }
  };

  //for pop up!
  openEditClientPopup = async () => {
    let { order } = this.props;
    const { hovering_dropdown } = this.state;

    if (hovering_dropdown) return;
    let order_data_for_popup = await getClientDateForPopup(
      this.props.orders.orders[order].order_id,
    );

    if (order_data_for_popup.ok) {
      this.props.setOrderDataForPopup(order_data_for_popup.result);

      this.props.setOrderIdForPopup(this.props.orders.orders[order].order_id);
      this.props.showMainPopup(true);
    } else {
      console.log('לא ניתן לעדכן הזמנה זו');
    }
  };

  getOrderTasks() {
    const { order } = this.props;
    let orderTasks = [];
    if (
      this.props.orders.orders &&
      this.props.orders.orders[order] &&
      this.props.orders.orders[order].columnOrder
    ) {
      this.props.orders.orders[order].columnOrder.forEach((colId) => {
        const column = this.props.orders.orders[order].columns[colId];
        const tasksByColumn = column.processId.map((id) =>
          this.props.orders.orders[order].processes.find((p) => p.process_id === id),
        );
        orderTasks = [...tasksByColumn, ...orderTasks];
      });
    } else {
    }
    return orderTasks;
  }

  getTasksByColumn(colId) {
    const { order } = this.props;
    const column = this.props.orders.orders[order].columns[colId]; // GET THE CORRECT COLUMN
    const tasksByColumn = column.processId.map((id) =>
      this.props.orders.orders[order].processes.find((p) => p.process_id === id),
    );
    // const tasksByColumn =  column?.order_process_ids ? column.order_process_ids.map((id) =>{

    //   return this.props.orders.orders[order].processes.find((p) => p._id === id)}
    // ) : column.processId.map((id) =>{

    //   return this.props.orders.orders[order].processes.find((p) => p.process_id === id)}
    // )

    tasksByColumn.sort(function (a, b) {
      return a.order - b.order;
    });

    return { tasksByColumn, column };
  }

  getEarliestIncompleteTask() {
    const orderTasks = this.getOrderTasks();
    const incompleteTasks = orderTasks.filter((t) => !t?.done);
    return incompleteTasks.reduce(function (pre, cur) {
      return pre.order < cur.order ? pre : cur;
    }, []);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let { order } = this.props;

    let prev_props = JSON.stringify(this.props.orders.orders[order]);
    let new_props = JSON.stringify(nextProps.orders.orders[order]);

    if (prev_props !== new_props) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let alert_process_problem = false; // for warnings [1]
    let offer = false;
    let projectManagersObj = this.findDepartmentEmployees('');
    let salesAgengtObj = this.findDepartmentEmployees('נציג מכירות');
    let customFields = this.getCustomField();
    let {
      order,
      openUpdateMenuPopup,
      updateOrderBefoReposition,
      is_drag_update,
      user_or_order_type,
    } = this.props;

    if (this.props.orders.orders[order].started !== undefined) {
      if (this.props.orders.orders[order].started) {
        offer = false;
      } else {
        offer = true;
      }
    }

    const approvedDone = this.props.orders.orders[order]?.approved_done ? 'green' : '';
    const overloadColor = this.props.orders.orders[order]?.warnings?.length > 0 ? 'red' : '';
    let customInputs =
      this.props.orders.orders[order].required_custom_inputs &&
      this.props.orders.orders[order].required_custom_inputs.length > 0
        ? this.props.orders.orders[order].required_custom_inputs
        : [];
    return (
      <div
        className="projects__box__container"
        id="projects__box__container"
        style={{ width: this.props.width }}
      >
        <div
          onClick={() => {
            this.openEditClientPopup();
          }}
          className="side__bar__box"
          id="side__bar__box"
          style={{ zIndex: this.props.zIndex || 30 }}
        >
          {offer ? <div className="side__bar__box__messege">הצעה</div> : null}

          <div className="side__bar__box__container" style={{ zIndex: this.props.zIndex || 0 }}>
            <div className="side__bar__box__text">
              <div className="side__bar__box__client" style={{ color: overloadColor }}>
                {' '}
                <div style={{ color: overloadColor || approvedDone }}>
                  {this.props.orders.orders[order].order_number}
                </div>
                {customInputs.length > 0
                  ? customInputs.map((item, idx) => {
                      return <div key={idx}>{item.name + ': ' + item.value}</div>;
                    })
                  : null}
                <div style={{ color: overloadColor || approvedDone }}>
                  {' '}
                  {this.props.orders.orders[order].client_name}
                </div>
                {this.props.orders.orders[order].city ? (
                  <div style={{ color: overloadColor || approvedDone }}>
                    {' '}
                    {this.props.orders.orders[order].city}
                  </div>
                ) : null}
              </div>
              <div className="side__bar__box__manager" style={{ color: overloadColor }}>
                {projectManagersObj ? (
                  <div
                    className="employees__section"
                    onMouseLeave={() => this.setState({ hovering_dropdown: false })}
                    onMouseEnter={() => this.setState({ hovering_dropdown: true })}
                  >
                    {projectManagersObj.name} -
                    <DropDownContainer
                      replaceFunc={this.replaceEmployee}
                      items={projectManagersObj.employees}
                      current_item={
                        projectManagersObj.current_employee
                          ? projectManagersObj.current_employee
                          : ''
                      }
                      current_item_text={
                        projectManagersObj.current_employee
                          ? projectManagersObj.current_employee.full_name
                          : 'אין עובד'
                      }
                      color={overloadColor || 'black'}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>

              {/* {customFields.length > 0 && (
              <div
                className="side__bar__box__other_info"
                style={{ color: alert_process_problem ? "red" : "" }}
                >
                 { customFields.map((item) => {
                    return (  <div key = {item.name}>
                                {`${item.name}  -  ${item.value}`}
                              </div>
                          )} )
                }
              </div>
              )} */}
              <div
                className="side__bar__box__sales__agent"
                style={{ color: alert_process_problem ? 'red' : '' }}
              >
                {salesAgengtObj ? (
                  <div className="employees__section">
                    {salesAgengtObj.name} -
                    <DropDownContainer
                      replaceFunc={this.replaceEmployee}
                      items={salesAgengtObj.employees}
                      current_item={
                        salesAgengtObj.current_employee ? salesAgengtObj.current_employee : ''
                      }
                      current_item_text={
                        salesAgengtObj.current_employee
                          ? salesAgengtObj.current_employee.full_name
                          : 'אין עובד'
                      }
                      color={'black'}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="side__bar__box__alert">
              {overloadColor ? (
                <img
                  className="problem__icon"
                  style={{ width: '17px' }}
                  src={Warning_sign}
                  alt="process problem"
                ></img>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="column__wraaper__container" id="column__wraaper__container">
            {this.props.orders.orders &&
              this.props.orders.orders[order] &&
              this.props.orders.orders[order].columnOrder != null &&
              this.props.orders.orders[order].columnOrder.map((colId) => {
                const { tasksByColumn, column } = this.getTasksByColumn(colId);
                const first_uncomplete_task = this.getEarliestIncompleteTask();

                return (
                  <Column
                    first_uncomplete_task={first_uncomplete_task}
                    is_drag_update={is_drag_update}
                    updateOrderBefoReposition={updateOrderBefoReposition}
                    order={order}
                    openUpdateMenuPopup={openUpdateMenuPopup}
                    draggableProcess={this.draggableProcess}
                    key={uniqid()}
                    dates_arr={this.props.orders.weeks_array}
                    column={column}
                    tasks={tasksByColumn}
                    order_color={this.props.orders.orders[order].color}
                    orderBeforRefosition={this.props.orders.orders[order]}
                    mpsView={this.props.mpsView}
                    user_or_order_type={user_or_order_type}
                  />
                );
              })}
          </div>
        </DragDropContext>
      </div>
    );
  }
}

function mapStateToProps({ orders, login }) {
  return { orders, login };
}

export default connect(mapStateToProps, actions)(DragAndDrop);
