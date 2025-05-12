import React, { Component } from 'react';
import '../../../../../../../sass/task/task.scss';
import { Draggable } from 'react-beautiful-dnd';
import { polyfill } from 'es6-promise';
import styled from 'styled-components';
import drag_icon from '../../../../../../../images/icons/drag_x.svg';
import * as actions from '../../../../../../../actions/actions';
import Lock from '../../../../../../../images/updatepopup/openLock.svg';
import { PER_USER } from '../../../../../../../tools/keys/variables';
import { connect } from 'react-redux';
import { createOrderProcessBackground } from '../../../../../../../functions/helpers/createOrderProcessBackground';
import { InformationPopup } from '../../../../../../updatePopups/InformationPopup';
import { getPosition, setInfoTopView } from '../../../../../../../hooks/helper';
// import { styled as mui_styled } from '@material-ui/core';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import { HtmlTooltipStyled } from "../../../../../../../hooks/helper";
// import Fade from '@mui/material/Fade';

polyfill();

// const HtmlTooltip = mui_styled(({ className, ...props }) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: HtmlTooltipStyled,
// }));

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_detached_from_state: props.task.is_detached,
      finished: props.task.finished,
      orders_warning: props.orders.orders_warnings,
    };
  }

  componentWillReceiveProps(nextProps) {
    let { process, task, update_process_obj, order } = this.props;

    if (nextProps.process._id !== process._id) {
      if (nextProps.process._id === task._id) {
        let orders = JSON.parse(JSON.stringify(this.props.orders.orders));

        let process = orders[order].processes.find((p) => p._id === nextProps.process._id);
        let index = orders[order].processes.findIndex((p) => p._id === nextProps.process._id);
        process.is_detached = nextProps.process.is_detached;
        process.finished = Number(nextProps.process.finished);
        orders[order].processes.splice(index, 1, process);
        this.props.setOrders(orders);

        this.setState(
          {
            is_detached_from_state: nextProps.process.is_detached,
            finished: nextProps.process.finished,
          },
          () => {
            setTimeout(() => {
              update_process_obj({
                _id: 'sssssssssssss',
                finished: '',
                is_detached: '',
              });
            }, 1000);
          },
        );
      }
    }
  }

  percentage = (portion, total) => {
    return Math.floor((portion / total) * 100) + '%';
  };

  draggableProcess = (e) => {
    let {
      openUpdateMenuPopup,
      task,
      order,
      updateOrderBefoReposition,
      orderBeforRefosition,
      is_drag_update,
    } = this.props;

    let orders = JSON.parse(JSON.stringify(this.props.orders.orders));

    is_drag_update(true);
    task.is_detached = this.state.is_detached_from_state;
    task.finished = this.state.finished;
    task.client_name = orders[order].client_name;
    task.order_number = orders[order].order_number;

    this.props.draggableProcess(task);
  };

  openUpdateMenuPopup = () => {
    let {
      openUpdateMenuPopup,
      task,
      order,
      updateOrderBefoReposition,
      orderBeforRefosition,
    } = this.props;
    openUpdateMenuPopup(task);
    updateOrderBefoReposition(orderBeforRefosition);
  };

  previous_info_popup_id = '';
  initHandlerForInfoPopup = (event, popup_id) => {
    if (this.previous_info_popup_id) {
      let tag = document.getElementById(this.previous_info_popup_id);
      tag && (tag.style.display = 'none');
    }
    let tag = document.getElementById(popup_id).style;
    tag.display = 'block';
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
    return height < 160 ? '-152%' : '-28%';
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

  render() {
    let info_popup_position = {
      initial: 101,
      last: 101,
    };
    const { is_detached_from_state, finished, orders_warning } = this.state;
    const {
      task,
      index,
      order_color,
      openUpdateMenuPopup,
      is_drag_update,
      first_uncomplete_task,
      process,
      order,
      user_or_order_type,
    } = this.props;
    // const Container = styled.div`
    //   background-color: ${finished == task.quantity ? null : task.color};
    // `;
    const Container = styled.div`
      background: ${createOrderProcessBackground(task, user_or_order_type)};
    `;
    let process_percentage = this.percentage(finished, task.quantity);

    let is_detached = false;
    if (is_detached_from_state !== undefined) {
      if (is_detached_from_state) {
        is_detached = true;
      }
    }
    let task_id = first_uncomplete_task
      ? first_uncomplete_task.process_id === task.process_id
        ? 'first__uncomplete__task'
        : 'task__container'
      : 'task__container';

    let disableDrag =
      this.props.login &&
      Object.keys(this.props.login.user).length > 0 &&
      this.props.login.user.privileges.includes(PER_USER)
        ? true
        : false;
    let warning_border = task.warnings ? 'warning__border' : '';
    return (
      <Draggable
        draggableId={task.process_id}
        index={index}
        isDragDisabled={disableDrag || task.done}
      >
        {(provided) => (
          <>
            <Container
              onClick={() => this.openUpdateMenuPopup()}
              onMouseDown={(e) => {
                this.draggableProcess(e);
              }}
              onMouseUp={() => {
                is_drag_update(false);
              }}
              className={
                task.backlog
                  ? `task__container ${warning_border} task__container__backlog`
                  : `task__container ${warning_border}`
              }
              id={process.show_first_uncomplete_process ? task_id : null}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div
                id={process.show_first_uncomplete_process ? task_id : null}
                // className={task.warnings ? "red__circle" : ""}
              ></div>
              <div
                className="drag__icon__container"
                onMouseEnter={(event) => this.initHandlerForInfoPopup(event, task._id)}
                onMouseLeave={(event) => this.closeHandlerInfoPopup(event, task._id)}
              >
                {' '}
                {/* <HtmlTooltip
                    placement='right-start'
                    TransitionComponent={Fade}
                    title={<InformationPopup 
                        process={task} 
                        popupId={task._id}
                    />}
                  > */}
                <img className="drag__icon" src={drag_icon} alt="drag icon"></img>
                {/* </HtmlTooltip> */}
              </div>
              <div
                className="process__data__container"
                style={{ color: task.warnings ? 'red' : '' }}
              >
                {task.process_name}
                <div className="process__line">
                  <div
                    className="process__line__finished"
                    style={{ width: process_percentage }}
                  ></div>
                </div>
              </div>
              {/* {is_detached ? (  */}
              <div className="lock__icon__container">
                {is_detached ? (
                  <img
                    style={is_detached ? { marginBottom: '2px' } : {}}
                    className="lock__icon"
                    src={Lock}
                    alt="lock icon"
                  ></img>
                ) : null}
                {/* {task.backlog ? <SvgIcon component={ScheduleIcon} />:null} */}
              </div>
              {/* ) : null} */}
            </Container>
            <div
              style={{
                display: 'none',
                transform: `translateX(${getPosition(info_popup_position, task.process_date)}%)`,
                textAlign: 'right',
              }}
              className="info--popup"
              id={task._id}
            >
              <InformationPopup process={task} popupId={task._id} />
            </div>
          </>
        )}
      </Draggable>
    );
  }
}

function mapStateToProps({ process, orders, login }) {
  return { process, orders, login };
}

export default connect(mapStateToProps, actions)(Task);
