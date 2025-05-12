import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generalGetRequest } from '../../functions/api/general';
import UpdateProccessPopup from '../updatePopups/UpdateProccessPopup';
import { useStyles } from './styles';
import DateSection from './parts/DateSection';
import ProcessesPerHour from './parts/ProcessesPerHour';
import MyHeader from './parts/MyHeader';
import VertikalHeader from './parts/VertikalHeader';

const DailyView = () => {
  const [resourses, setResourses] = useState([]);
  const [items, setItems] = useState([]);
  const [updateProcessPopup, setUpdateProcessPopup] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState('');
  const classes = useStyles();
  const holidays = useSelector((state) => state.login.user.holidays);
  const offDays = useSelector((state) => state.login.user.off_days);
  const [date, setDate] = useState(new Date());

  const getOrders = async () => {
    const data = await generalGetRequest(
      `/system/order/get-for-daily-view?date=${new Date(date).toDateString()}`,
    );

    const newSquedule = data?.result ? data.result : [];
  };

  const getProcess = async () => {
    const mydata = await generalGetRequest(
      `/system/order/get-for-new-daily-view?date=${new Date(date).toDateString()}`,
    );
    const users = mydata.result.map((item) => item.user);
    const preprocess = mydata.result.map((item) => item.processes);

    // setItems(users)
    setItems(mydata.result);
    setResourses(preprocess);
  };

  useEffect(() => {
    getOrders();
    getProcess();
  }, [date]);

  const showUpdateProcessPopUpHandler = () => {
    setUpdateProcessPopup(!updateProcessPopup);
  };

  const submitUpdatesFromPopup = () => {
    getOrders();
    showUpdateProcessPopUpHandler();
  };

  return (
    <div>
      <DateSection date={date} setDate={setDate} />

      <div className="background_line" style={{ marginRight: '15vw', zIndex: 80 }} />
      <div className={classes.calendarBox}>
        <VertikalHeader items={items} />
      </div>
      {updateProcessPopup ? (
        <UpdateProccessPopup
          selectedProcess={selectedProcess}
          closeUpdateMenu={showUpdateProcessPopUpHandler}
          submitUpdatesFromPopup={submitUpdatesFromPopup}
          offDays={offDays}
          holidays={holidays}
        />
      ) : null}
    </div>
  );
};

export default DailyView;
