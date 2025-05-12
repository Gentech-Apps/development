import { useEffect, useState } from 'react';
import { generalGetRequest } from '../functions/api/general';
import {
  CUSTOMERS_PAGE,
  REPORT_HEADER,
  CHECK_LIST_TRANSLATION,
} from '../constants/translations/customersPage';
import {
  createInternalReportTestResultData,
  createCustomerReportTestResultData,
  createReportHeader,
} from '../functions/helpers/createTestsResultData';
import { useSelector } from 'react-redux';
const {
  LOCATION_FLOOR,
  LOCATION_DESCRIPTION,
  ACTUAL_SYSTEM_NAME,
  SYSTEM_NAME,
  ADDITIONAL_NOTE,
  PHOTO,
  REMARKS,
  REASON,
  STATUS,
  TEST,
  LAYER,
  ACTION_REQUIRED,
  REPAIRED_ON_THE_SPOT,
  SHOW_STOPPER,
} = CUSTOMERS_PAGE;

const { PROPER, NOT_PROPER } = CHECK_LIST_TRANSLATION;

export const useCustomerReport = (orderId) => {
  const workingHours = useSelector((state) => state.login.user.working_hours);
  const [internalReport, setInternalReport] = useState([]);
  const [customerReport, setCustomerReport] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reportData, setReportData] = useState('');
  const [reportHeader, setReportHeader] = useState('');
  const [customerReportHeader, setCustomerReportHeader] = useState('');
  // const [customerReportHeader, setCustomerReportHeader] = useState('')
  const CUSTOMER_REPORT_FILE_NAME = 'customer_report.csv';
  const INTERNAL_REPORT_FILE_NAME = 'internal_report.csv';

  useEffect(() => {
    const upload = async () => {
      setLoading(true);
      const { ok, result } = await generalGetRequest(
        `/system/customer-page/get-report?orderId=${orderId}`,
      );
      if (ok && result) {
        setReportData(result);
        const { report, problemSystemsHeader } = createReportHeader(result, workingHours);
        setReportHeader(report);
        setCustomerReportHeader(problemSystemsHeader);
      }
    };

    if (orderId) upload();
  }, [orderId]);

  useEffect(() => {
    const generateReports = async () => {
      createCsvDataCustomerReport(reportData);
      createCsvDataInternalReport(reportData);
      setLoading(false);
    };

    const createCsvDataCustomerReport = ({ systems }) => {
      const emptyLine = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      let csvData = [...customerReportHeader];
      // get bad systems
      const problemSystems = systems.filter((system) => {
        const { check_list } = system;
        if (check_list?.data) {
          const badTests = check_list.data.filter((test) => {
            const { values } = test;
            const inputType = values[0].typeOfInput;
            const keyValue = values[0].value;
            if (parseInt(inputType) && keyValue && keyValue !== PROPER) {
              return test;
            }
          });

          system.check_list.data = badTests;

          if (badTests?.length) return system;
        }
      });

      problemSystems.forEach((i) => {
        const {
          actual_system_name,
          layer,
          location_description,
          location_floor,
          system_name,
          general_section,
          check_list,
        } = i;
        const systemHeader = [
          LAYER,
          SYSTEM_NAME,
          ACTUAL_SYSTEM_NAME,
          LOCATION_FLOOR,
          LOCATION_DESCRIPTION,
        ];
        const systemInfo = [
          layer,
          system_name,
          actual_system_name,
          location_floor,
          location_description,
        ];
        // add general section data
        if (general_section?.data) {
          general_section.data.forEach((row) => {
            const { row_title, values } = row;
            const value = values[0].value;
            systemHeader.push(row_title);
            systemInfo.push(value || '');
          });
        }

        csvData.push(systemHeader);
        csvData.push(systemInfo);

        if (check_list?.data) {
          const checkListHeader = [
            '',
            '',
            '',
            '',
            '',
            TEST,
            STATUS,
            REASON,
            ACTION_REQUIRED,
            REPAIRED_ON_THE_SPOT,
            REMARKS,
            PHOTO,
            ADDITIONAL_NOTE,
            SHOW_STOPPER,
          ];
          csvData.push(checkListHeader);
          check_list.data.forEach((row) => {
            const { row_title, show_stopper, values } = row;
            // not good test
            const inputType = row.values[0].typeOfInput;
            const keyValue = row.values[0].value;
            if (parseInt(inputType) && keyValue && keyValue !== PROPER) {
              const test = ['', '', '', '', '', row_title];
              values.forEach(({ value }) => {
                const formattedValue = Array.isArray(value) ? value.join(',') : value;
                test.push(formattedValue || '');
              });
              test.push(show_stopper);
              csvData.push(test);
            }
          });
        }
      });

      setCustomerReport(csvData);
    };

    const createCsvDataInternalReport = ({ systems }) => {
      // all systems
      const emptyLine = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      let csvData = [...reportHeader];

      systems.forEach((i) => {
        const {
          actual_system_name,
          layer,
          location_description,
          location_floor,
          system_name,
          general_section,
          check_list,
        } = i;
        const systemHeader = [
          LAYER,
          SYSTEM_NAME,
          ACTUAL_SYSTEM_NAME,
          LOCATION_FLOOR,
          LOCATION_DESCRIPTION,
        ];
        const systemInfo = [
          layer,
          system_name,
          actual_system_name,
          location_floor,
          location_description,
        ];
        // add general section data
        if (general_section?.data) {
          general_section.data.forEach((row) => {
            const { row_title, values } = row;
            const value = values[0].value;
            systemHeader.push(row_title);
            systemInfo.push(value || '');
          });
        }

        csvData.push(systemHeader);
        csvData.push(systemInfo);

        // add checklist data

        if (check_list?.data) {
          const checkListHeader = [
            '',
            '',
            '',
            '',
            '',
            TEST,
            STATUS,
            REASON,
            ACTION_REQUIRED,
            REPAIRED_ON_THE_SPOT,
            REMARKS,
            PHOTO,
            ADDITIONAL_NOTE,
            SHOW_STOPPER,
          ];
          csvData.push(checkListHeader);
          check_list.data.forEach((row) => {
            const { row_title, show_stopper, values } = row;
            const test = ['', '', '', '', '', row_title];
            values.forEach(({ value }) => {
              const formattedValue = Array.isArray(value) ? value.join(',') : value;
              test.push(formattedValue || '');
            });
            test.push(show_stopper);
            csvData.push(test);
          });
        }
      });

      setInternalReport(csvData);
    };

    if (reportData && reportHeader && customerReportHeader) {
      generateReports();
    }
  }, [reportData, reportHeader, customerReportHeader]);

  const reports = {
    CUSTOMER_REPORT_FILE_NAME,
    INTERNAL_REPORT_FILE_NAME,
    internalReport,
    customerReport,
  };

  return [reports, isLoading];
};
