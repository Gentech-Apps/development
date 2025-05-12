import React from 'react';

const ProcessStatusReport = (props) => {
  const { finished, quantity, cancelDoneHandler, reportDone, reportDoneHandler } = props;

  return (
    // <span className="custom__popup__update__data-section__second-row">
    finished === quantity ? (
      <a
        onClick={() => {
          cancelDoneHandler();
        }}
      >
        בטל סיום
      </a>
    ) : !reportDone ? (
      <a
        onClick={() => {
          reportDoneHandler();
        }}
      >
        דווח על סיום
      </a>
    ) : (
      <a>{reportDone}</a>
    )
    //   </span>
  );
};

export default ProcessStatusReport;
