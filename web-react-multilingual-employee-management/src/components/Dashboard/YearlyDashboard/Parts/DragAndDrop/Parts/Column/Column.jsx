import React, { Component } from 'react';
import '../../../../../../../sass/column/column.scss';
import Task from '../Task/Task';
import { Droppable } from 'react-beautiful-dnd';
import moment from 'moment';
import { isSameDay } from '../../../../../../../functions/general/general';
import { polyfill } from 'es6-promise';
polyfill();

class Column extends Component {
  getCurrentWeekDate = () => {
    let current_week_num_start_day;
    let index;

    if (this.props.mpsView === 'day') {
      current_week_num_start_day = moment();
      current_week_num_start_day = moment(current_week_num_start_day._d).format('l');

      index = this.props.dates_arr.findIndex(
        (w) => current_week_num_start_day === moment(w.start_day_formated).format('l'),
      );
    } else {
      current_week_num_start_day = moment(new Date()).startOf('week');
      current_week_num_start_day = moment(current_week_num_start_day._d).format('l');

      index = this.props.dates_arr.findIndex(
        (w) => current_week_num_start_day === moment(w.start_week).format('l'),
      );
    }

    let column_index = index + 1;
    let number_of_current_column = 'column-' + column_index;
    return number_of_current_column;
  };

  render() {
    const {
      first_uncomplete_task,
      is_drag_update,
      column,
      tasks,
      order_color,
      draggableProcess,
      orderBeforRefosition,
      openUpdateMenuPopup,
      updateOrderBefoReposition,
      order,
      user_or_order_type,
    } = this.props;

    return (
      <div
        className="column__container"
        id={this.getCurrentWeekDate() === column.id ? 'current__week' : column.id}
      >
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              id="task__list"
              className="task__list"
              isdraggingover={snapshot.isDraggingOver.toString()}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <InnerList
                tasks={tasks}
                first_uncomplete_task={first_uncomplete_task}
                is_drag_update={is_drag_update}
                orderBeforRefosition={orderBeforRefosition}
                updateOrderBefoReposition={updateOrderBefoReposition}
                order={order}
                order_color={order_color}
                draggableProcess={draggableProcess}
                openUpdateMenuPopup={openUpdateMenuPopup}
                user_or_order_type={user_or_order_type}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default Column;

class InnerList extends Component {
  shouldComponentUpdate(nextProps) {
    let { tasks, is_drag_update } = this.props;
    //if the reference change allow to render
    if (nextProps.tasks === tasks) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let {
      tasks,
      is_drag_update,
      first_uncomplete_task,
      orderBeforRefosition,
      draggableProcess,
      order_color,
      openUpdateMenuPopup,
      updateOrderBefoReposition,
      order,
      user_or_order_type,
    } = this.props;
    return tasks.map((task, index) => (
      <Task
        first_uncomplete_task={first_uncomplete_task}
        is_drag_update={is_drag_update}
        order={order}
        orderBeforRefosition={orderBeforRefosition}
        updateOrderBefoReposition={updateOrderBefoReposition}
        openUpdateMenuPopup={openUpdateMenuPopup}
        key={task._id}
        task={task}
        index={index}
        order_color={order_color}
        draggableProcess={draggableProcess}
        user_or_order_type={user_or_order_type}
      />
    ));
  }
}
