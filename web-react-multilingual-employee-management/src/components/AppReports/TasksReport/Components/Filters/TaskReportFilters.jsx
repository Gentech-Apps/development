import React, { useState, useEffect } from 'react';
import { TASKS_REPORT } from '../../../../../constants/translations/order-tasks-report';
import { ORDER_TASKS_REPORT } from '../../../../../constants/translations/order-tasks-report';
import FiltersSelect from './Parts/Select';
// import FiltersTextInput from "./Parts/TextInput";
import { useSelector } from 'react-redux';
import { getUsersByFactoryId } from '../../../../../functions/api/popup';
import { useDataUpload } from '../../../../../hooks/useDataUpload';

const TasksReportFilters = (props) => {
  const { RESOURCE_NAME, CUSTOMER_NAME, ORDER_NUMBER } = ORDER_TASKS_REPORT;
  const [resources, setResources] = useState([]);
  // const customers = useDataUpload(`/system/customer-page/get-all-customers`);
  // const orders = useDataUpload(`/system/reports/get-order-numbers-list`);
  const factoryId = useSelector((state) => state.login.user.factory_id);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await getUsersByFactoryId(factoryId);
      setResources(res ? res : []);
    };

    getData();
  }, []);

  const {
    currentResource,
    setCurrentResource,
    currentCustomer,
    setCurrentCustomer,
    currentOrderNumber,
    setCurrentOrderNumber,
    tasksReport,
  } = props;

  useEffect(() => {
    if (tasksReport) {
      const ordersOptions = [];
      const customersOptions = [];
      tasksReport.forEach((task) => {
        const { customer_id, customer_name, order_id, order_number } = task;
        ordersOptions.push({ _id: order_id, order_number });
        customersOptions.push({ _id: customer_id, name: customer_name });
      });
      setOrders(ordersOptions);
      setCustomers(customersOptions);
    }
  }, []);

  return (
    <header>
      <span>
        <p style={{ width: '177px' }}>{TASKS_REPORT}</p>
        <FiltersSelect
          label={RESOURCE_NAME}
          value={currentResource}
          handleChange={setCurrentResource}
          optionsData={resources}
        />
        <FiltersSelect
          label={CUSTOMER_NAME}
          value={currentCustomer}
          handleChange={setCurrentCustomer}
          optionsData={customers}
        />
        <FiltersSelect
          label={ORDER_NUMBER}
          value={currentOrderNumber}
          handleChange={setCurrentOrderNumber}
          optionsData={orders}
        />
      </span>
    </header>
  );
};

export default TasksReportFilters;
