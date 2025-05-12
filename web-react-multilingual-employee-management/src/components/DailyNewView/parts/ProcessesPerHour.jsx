import React from 'react';
import Period from './Period';

const ProcessesPerHour = (props) => {
  const { squedule, showUpdateProcessPopUpHandler, setSelectedProcess } = props;
  return (
    <div className="main__box__container">
      {squedule.map((i, idx) => (
        <Period
          setSelectedProcess={setSelectedProcess}
          showUpdateProcessPopUpHandler={showUpdateProcessPopUpHandler}
          key={idx}
          period={i}
          index={idx}
        />
      ))}
    </div>
  );
};

export default ProcessesPerHour;
