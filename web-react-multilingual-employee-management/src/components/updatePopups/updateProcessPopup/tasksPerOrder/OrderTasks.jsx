import React, { useEffect } from 'react';
import OrderTask from './OrderTask';
import { useTasks } from '../../../../hooks/useTasks';

const OrderTasks = (props) => {
  const {
    resources,
    editTasksList,
    orderProcess,
    newTask,
    tasksFromFormBody,
    actualDuration,
    startTime,
    updateProcessPopupStateHandler,
  } = props;
  const resourcesList = resources.map((i) => ({ name: i.full_name, _id: i._id }));
  const { _id: orderProcessId, original } = orderProcess;
  const [tasks, setTasks] = useTasks(original ? original : orderProcessId, tasksFromFormBody);

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

  const deleteTask = (taskId) => {
    const tasksCopy = [...tasks];
    const index = tasksCopy.findIndex((i) => i._id === taskId || i.temporarilyId === taskId);
    if (~index) {
      tasksCopy.splice(index, 1);
    }
    setTasks(tasksCopy);
  };

  return (
    <div style={{ display: 'block', overflow: 'auto' }}>
      {tasks?.map((i) => (
        <OrderTask
          key={i._id ? i._id : i.temporarilyId}
          resources={resourcesList}
          data={i}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default OrderTasks;
