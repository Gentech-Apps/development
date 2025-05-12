import React from 'react';
import { useStyles } from '../styles';
import OrderProcess from './OrderProcess';

const Period = (props) => {
  const { period, showUpdateProcessPopUpHandler, setSelectedProcess, index } = props;
  const classes = useStyles();

  const [startTime, processes] = period;
  return (
    <div className={classes.processesBox}>
      <div className={classes.sideBarBox}>
        {/* don't show first time mark because it doesn't fit correctly in squedule layout */}
        <div className={classes.timeMark}>{index ? startTime : null}</div>
      </div>
      <div className={classes.timeRowBox}>
        {processes.map((process, idx) => {
          return (
            <div className={classes.processCell} key={idx}>
              {process ? (
                <OrderProcess
                  process={process}
                  showUpdateProcessPopUpHandler={showUpdateProcessPopUpHandler}
                  setSelectedProcess={setSelectedProcess}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Period;
