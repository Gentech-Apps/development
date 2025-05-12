import React, { useEffect } from 'react';
import Task from './task';
import { useStyles } from './styles';
import { METALPRESS } from '../../../../../constants/factories';
import { useSelector } from 'react-redux';

const TasksList = (props) => {
  const classes = useStyles();
  const {
    resources,
    editTasksList,
    orderProcess,
    newTask,
    tasksFromFormBody,
    actualDuration,
    startTime,
    updateProcessPopupStateHandler,
    tasks,
    setTasks,
  } = props;
  const resourcesList = resources.map((i) => ({ name: i.full_name, _id: i._id }));
  const { _id: orderProcessId, original } = orderProcess;
  const currentFactory = useSelector((state) => state.login.user.factory_id);

  useEffect(() => {
    if (newTask) {
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
    }
  }, [newTask]);

  useEffect(() => {
    if (tasks) {
      editTasksList(tasks);
    }
  }, [tasks]);

  const editTask = (id, fieldName, value) => {
    const newData = [...tasks];
    const index = newData.findIndex((i) => i._id === id || i.temporarilyId === id);
    if (~index) {
      newData[index][fieldName] = value;
      setTasks(newData);
    }
  };

  return (
    <div>
      {tasks?.map((i) => (
        <Task
          key={i._id ? i._id : i.temporarilyId}
          resources={resourcesList}
          data={i}
          editTask={editTask}
          orderProcessId={orderProcessId}
          setTasks={setTasks}
        />
      ))}
    </div>
  );
};

export default TasksList;
