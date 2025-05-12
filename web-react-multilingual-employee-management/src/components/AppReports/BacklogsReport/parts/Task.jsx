import moment from 'moment';
import React from 'react';

const Task = ({ data }) => {
  const { description, due_date, resource } = data;
  const processDate = due_date ? moment(due_date).format('DD/MM/YYYY') : '';
  return (
    <span className="task-holder">
      <p>{description}</p>
      <span>
        <p className="task-date-and-employee" style={{ marginLeft: resource ? '10px' : '0' }}>
          {resource ? resource : ''}
        </p>
        <p className="task-date-and-employee">{processDate}</p>
      </span>
    </span>
  );
};

export default Task;
