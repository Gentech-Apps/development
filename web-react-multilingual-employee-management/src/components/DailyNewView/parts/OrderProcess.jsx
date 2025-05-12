import React from 'react';
import { createOrderProcessBackground } from '../../../functions/helpers/createOrderProcessBackground';
import { useStyles } from '../styles';

const OrderProcess = (props) => {
  const { process, showUpdateProcessPopUpHandler, setSelectedProcess } = props;
  const { order_number } = process;
  const { finished, quantity } = process.processes[0];
  const classes = useStyles();

  const openEditPopUpHandler = (process) => {
    const proccess = process?.processes[0];
    const { client_name, order_number } = process;
    const newProcess = {
      client_name,
      order_number,
      proccess,
    };
    setSelectedProcess(newProcess);
    showUpdateProcessPopUpHandler();
  };

  const setDoneColor = (process) => {
    const backgroundColor = `rgb(232, 233, 235)`;
    const color = `rgb(214, 214, 214)`;
    const { done, quantity, finished } = process;
    if (finished === quantity || done) {
      return { backgroundColor, color };
    }
    return {};
  };

  return (
    <div
      className={classes.orderProcessContainer}
      onClick={() => openEditPopUpHandler(process)}
      style={setDoneColor(process.processes[0])}
    >
      <div className={classes.oderProcessInfoWrapper}>
        <div className={classes.orderInfoWrapper}>
          <div
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: '#0091ff',
              borderRadius: '100%',
              display: 'block',
              content: '',
              margin: 'auto',
            }}
          ></div>
          <div className={classes.orderInfo}>
            <span className={classes.text}>{order_number}</span>
            <span className={classes.text}>{' ?? ????? '}</span>
          </div>
        </div>
        <div className={classes.doneAside}>
          <div className={classes.arrowIcon}>
            <span className={classes.arrowButton}></span>
          </div>
          <span className={classes.completionStatus}>
            {finished}/{quantity}
          </span>
        </div>
      </div>
      <div
        className={classes.resourcesColorPointer}
        style={{ background: createOrderProcessBackground(process.processes[0]) }}
      ></div>
    </div>
  );
};

export default OrderProcess;
