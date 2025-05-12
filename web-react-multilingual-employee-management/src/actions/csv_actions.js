import {
  SET_CSV_WEEK_HEADERS,
  SET_CSV_WEEK_DATA,
  SET_CSV_MONTHLY,
  SET_CSV_CUSTOMER,
} from './types';
import { polyfill } from 'es6-promise';
import moment from 'moment';
polyfill();

export const setCsvWeekHeaders = (weeks) => async (dispatch) => {
  const headers_array = [{ label: `שבוע ${moment(weeks[0].date).week()}`, key: 'y' }]; // Week number

  for (const week of weeks) {
    if (!week.offDay) {
      headers_array.push({
        label: `${week.dateName} - ${week.parsedDate}`,
        key: `details.${weeks.indexOf(week)}`,
      });
    }
  }

  const week_headers_and_title = { headers: headers_array, title: headers_array[0].label };

  dispatch({
    type: SET_CSV_WEEK_HEADERS,
    payload: week_headers_and_title,
  });
};

export const setCsvWeekDate = (data) => async (dispatch) => {
  const dataCopy = JSON.parse(JSON.stringify(data)); // Deep copy data
  const processData = [];

  for (const row of dataCopy) {
    if (row.processes.length > 0) {
      for (const dayProcess of row.processes) {
        for (const process of dayProcess) {
          if (!process.backlog) {
            const employee = process.employee?.name || 'אין עובד';
            processData.push({
              details: {
                [process.p]: [
                  process.order_number,
                  '\n' + process.client_name,
                  '\n' + employee,
                  '\n' + process.finished + '/' + process.quantity,
                ],
              },
              y: row.process_name,
            });
          }
        }
      }
    }
  }

  dispatch({
    type: SET_CSV_WEEK_DATA,
    payload: processData,
  });
};

export const setCsvMonthly = (month_data) => async (dispatch) => {
  const allData = [...month_data]; // Create a shallow copy
  const headers_array = [];
  const month_title = `${allData[0].parsedDate} - ${allData[allData.length - 1].parsedDate} :חודש`;
  const week_processes = [];

  // Add first week header
  headers_array.push({ label: `שבוע ${moment(allData[0].date).format('w')} מס`, key: 'y' });

  // Add headers for the first week
  for (let i = 0; i < 5; i++) {
    headers_array.push({
      label: `${allData[i].dateName} - ${allData[i].parsedDate}`,
      key: `details.${i}`,
    });
  }

  // Generate data for each week
  while (allData.length > 0) {
    dataGeneratator(allData, week_processes);
    week_processes.push(empty_line); // Add empty line between weeks
    allData.splice(0, 7); // Remove processed week
  }

  const monthyl_headers_data_title = {
    headers: headers_array,
    data: week_processes,
    title: month_title,
  };

  dispatch({
    type: SET_CSV_MONTHLY,
    payload: monthyl_headers_data_title,
  });
};

const newWeekGeneratator = (new_date_array, week_processes) => {
  //   need to push new "headers" for the new week { details: { a:  "ראשון",b:  "שני", c:  "שלישי", d:  "רביעי", e:  "חמישי"}, y: 'שבוע  51'},
  let new_week_line_obj = {
    details: {},
    y: moment(new_date_array[0].date).format('w') + ' שבוע מס',
  };

  for (let i = 0; i < 5; i++) {
    new_week_line_obj.details[i] =
      new_date_array[i].dateName + ' - ' + new_date_array[i].parsedDate;
  }

  week_processes.push(new_week_line_obj);
  dataGeneratrator(new_date_array, week_processes);
};

const dataGeneratrator = (all_data, week_processes) => {
  for (let i = 0; i < 5; i++) {
    for (let p = 0; p < all_data[i].dayData.length; p++) {
      let day_process = all_data[i].dayData[p];

      if (!day_process.proccess.backlog) {
        let employee = 'אין עובד';

        if (!day_process.proccess.employee) {
          employee = 'אין עובד';
        } else {
          employee = day_process.proccess.employee.name;
        }

        week_processes.push({
          details: {
            [i]: [
              day_process.order_number,
              '\n' + day_process.client_name,
              '\n' + employee,
              '\n' + day_process.proccess.finished + '/' + day_process.proccess.quantity,
            ],
          },
          y: day_process.proccess.process_name,
        });
      }
    }
  }

  return week_processes;
};

export const setCsvCustomer = (customerData) => {
  const allData = [...customerData]; // Shallow copy
  const factory = JSON.parse(localStorage.getItem('LOGIN_DATA')).result.factory_name;

  const headersArray = ['כתובת', 'עִיר', 'אימייל', 'טלפון', 'שֵׁם', 'ם איש קשר', 'מספר לקוח'].map(
    (label, index) => ({
      label,
      key: `details.${index}`,
    }),
  );

  const customerTitle = 'customer';
  const customerData = allData.map((customer) => ({
    details: {
      [0]: customer.address,
      [1]: customer.city,
      [2]: customer.email,
      [3]: customer.phone,
      [4]: customer.name,
      [5]: customer.contact_name,
      [6]: customer.customer_number,
    },
  }));

  const customerHeadersDataTitle = {
    headers: headersArray,
    data: customerData,
    title: `${factory}_${customerTitle}_${new Date().toISOString()}`,
  };

  return {
    type: SET_CSV_CUSTOMER,
    payload: customerHeadersDataTitle,
  };
};
