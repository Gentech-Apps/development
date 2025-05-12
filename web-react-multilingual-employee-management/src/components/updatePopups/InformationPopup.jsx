import React, { Fragment } from 'react';
import circleAdd from '../../images/general/circle-add.svg';
//sass
import '../../sass/popups/_update_proccess_popup.scss';
import { Divider } from '@material-ui/core';

export const InformationPopup = ({ process, popupId, data = {} }) => {
  const orderNumber = !process.order_number ? data.order_number : process.order_number;
  const clientName = !process.client_name ? data.client_name : process.client_name;
  const processName = !process?.process_name
    ? process?.proccess?.process_name
    : process?.process_name;
  const projectManagerName = !process.project_manager_name ? '' : process.project_manager_name;

  return (
    <div
      onMouseLeave={() => {
        let tag = document.getElementById(popupId).style;
        tag.display = 'none';
      }}
    >
      <div className="info--header" sx={{ boxShadow: 3 }}>
        <h4>מֵידָע</h4>
      </div>
      <Divider />
      <div className="info--content">
        <p>
          {' '}
          {'מספר הזמנה / קריאה'} {' | '} {orderNumber ? orderNumber : ''}
        </p>
        <p>
          {' '}
          {'הלקוח'} {' | '} {clientName ? clientName : ''}
        </p>
        <p>
          {' '}
          {'התהליך'} {' | '} {processName ? processName : ''}
        </p>
        {!JSON.parse(localStorage.getItem('LOGIN_DATA')).result.type_of_factory.includes(
          'service',
        ) && (
          <p>
            {' '}
            {'מנהל פרוייקט'} {' | '} {projectManagerName ? projectManagerName : ''}
          </p>
        )}
      </div>
      <Divider />
      <div className="info--footer">
        <span>
          <button className="add-btn">
            {' '}
            הוסף משימה חדשה <img className="add--task--icon" src={circleAdd} alt="circle-add" />
          </button>
        </span>
      </div>
    </div>
  );
};
