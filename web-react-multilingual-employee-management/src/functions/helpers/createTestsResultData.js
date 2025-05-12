import {
  CUSTOMERS_PAGE,
  REPORT_HEADER,
  CHECK_LIST_TRANSLATION,
} from '../../constants/translations/customersPage';
import moment from 'moment';
import {
  SERVICE_CALL_TYPE_ALL_SYSTEMS,
  SERVICE_CALL_TYPE_HALF_YEAR,
} from '../../constants/customers-page';
const BLOWER = '6073df43e206baa7365fcbb9';
const COMPRESSION_SYSTEM = '5f6e181008fac40af4cecf15';
const MANDATORY_TO_SHOW_IN_BLOWER = 7;
const MANDATORY_TO_SHOW_IN_COMPRESSION_SYSTEM = 3;
const DOES_NOT_EXIST = `לא קיים`;
const RED_SHOW_STOPPER = `תקלה קריטית / סיכון בטיחותי קריטי: השבתה`;

const {
  LOCATION_FLOOR,
  LOCATION_DESCRIPTION,
  SYSTEM_NAME_REPORT,
  SYSTEM_NAME,
  ADDITIONAL_NOTE,
  PHOTO,
  REMARKS,
  REASON,
  STATUS,
  TEST,
  ACTUAL_SYSTEM_NAME,
  CUSTOMER_NAME,
  ADDRESS,
  START_TIME_AND_END_TIME,
} = CUSTOMERS_PAGE;

const {
  DATE,
  HALF_YEAR_OR_YEARLY,
  TECH_NAME,
  TEST_DATE,
  DESCRIPTION_REASON_REDING,
  ACTUAL_HOURS_INVESTED,
  ANNUAL,
  SEMI_ANNUAL,
  REPORT_TITLE,
  DETAILS_OF_THE_SYSTEMS_TESTED_IN_THE_PROJECT,
  SYSTEM_IS_DISABLED,
  GOOD_OR_NOT_GOOD,
} = REPORT_HEADER;

const { PROPER, NOT_PROPER } = CHECK_LIST_TRANSLATION;

const csvDataHeader = [' ', SYSTEM_NAME, ACTUAL_SYSTEM_NAME, LOCATION_FLOOR, LOCATION_DESCRIPTION];

const testsHeader = [TEST, STATUS, REASON, REMARKS, PHOTO, ADDITIONAL_NOTE];

const testsHeaderCustomerReport = [TEST, STATUS, REASON, REMARKS];

export const createInternalReportTestResultData = (data, iterationNumber, isSystem) => {
  const [generalSectionTitle, generalSectionBody] = createGeneralSectionTable(data);
  const {
    location_description,
    location_floor,
    actual_system_name,
    system_name,
    test_result: tests,
  } = data;
  const test_result = filterExistingTests(tests);
  let testResult = [];
  let firstRow = [
    isSystem ? '1' : '2',
    system_name ? system_name : ' ',
    actual_system_name ? actual_system_name : ' ',
    location_floor ? location_floor : ' ',
    location_description ? location_description : ' ',
  ];
  const isSystemProper = checkAllTestsProper(test_result);
  testResult.push(
    [...csvDataHeader, ...generalSectionTitle, GOOD_OR_NOT_GOOD],
    [...firstRow, ...generalSectionBody, isSystemProper],
    [''],
  );
  if (!test_result) {
    return testResult;
  }

  testResult.push(['', '', '', '', '', ...testsHeader]);

  for (let a of test_result) {
    const values = a.values.map((i) => (i.value?.join?.(', ') ? i.value?.join?.(', ') : i.value));
    let testData = [a.row_title ? a.row_title : ' ', ...values];
    testData = [' ', ' ', ' ', ' ', ' ', ...testData];
    testResult.push(testData);
  }

  return testResult;
};

export const createCustomerReportTestResultData = (data, isSystem, systemInfo) => {
  const [generalSectionTitle, generalSectionBody] = createGeneralSectionTable(data, isSystem);
  let testResult = [];
  const {
    location_description,
    location_floor,
    actual_system_name,
    system_name,
    test_result: tests,
    actual_system_id,
  } = data;
  const test_result = filterExistingTests(tests);

  let firstRow = [
    isSystem ? '1' : '2',
    system_name ? system_name : ' ',
    actual_system_name ? actual_system_name : ' ',
    location_floor ? location_floor : ' ',
    location_description ? location_description : ' ',
  ];

  const badTestResults = test_result?.filter((testRow, idx) => {
    if (actual_system_id === BLOWER && idx === MANDATORY_TO_SHOW_IN_BLOWER) return testRow;
    if (actual_system_id === COMPRESSION_SYSTEM && idx > MANDATORY_TO_SHOW_IN_COMPRESSION_SYSTEM) {
      const remarks = testRow?.values?.[2]?.value;
      const internalRemarks = testRow?.values?.[4]?.value;
      const newRemarks = joinInternalRemarksAndRemarks(remarks, internalRemarks);
      testRow.values[2].value = newRemarks;
      return testRow;
    }
    const inputType = testRow.values[0].typeOfInput;
    const keyValue = testRow.values[0].value;
    if (parseInt(inputType) && keyValue && keyValue !== PROPER) return testRow;
  });

  const isSystemProper = checkAllTestsProper(test_result);

  testResult.push(
    [...csvDataHeader, ...generalSectionTitle, GOOD_OR_NOT_GOOD],
    [...firstRow, ...generalSectionBody, isSystemProper],
    [''],
  );

  if (!badTestResults?.length) {
    return testResult;
  }

  testResult.push(['', '', '', '', '', ...testsHeaderCustomerReport]);

  for (let a of badTestResults) {
    // if value is from first 3 values return it (exclude photo and additional note)
    // const values = a.values.map((i, idx) => idx < 3 ? i : '');
    const values = a.values.map((i, idx) =>
      idx < 3 ? (i.value?.join?.(', ') ? i.value?.join?.(', ') : i.value) : '',
    );
    let testData = [a.row_title ? a.row_title : ' ', ...values];
    testData = [' ', ' ', ' ', ' ', ' ', ...testData];
    testResult.push(testData);
  }

  return testResult;
};

export const createGeneralSectionTable = (data, isSystem) => {
  const { general_section } = data;
  if (general_section) {
    const generalSectionHeader = [
      // SYSTEM_NAME_REPORT,
      // LOCATION_FLOOR,
      // LOCATION_DESCRIPTION,
    ];
    let generalSectionDescription = [];
    for (let i = 0; i < general_section.length; i++) {
      const { row_title } = general_section[i];
      try {
        const { value } = general_section[i]?.values[0];
        generalSectionHeader.push(row_title);
        generalSectionDescription.push(value);
      } catch (e) {
        generalSectionHeader.push(row_title);
        generalSectionDescription.push('');
      }
    }
    let generalSection = [generalSectionHeader, generalSectionDescription];
    return generalSection;
  }
  // if !general section return empty general section info
  return [];
};

export const createReportHeader = (reportData, workingHours) => {
  const {
    customer_name,
    order_type,
    due_date,
    data,
    created_at,
    technician,
    systems,
    address,
    order_number,
  } = reportData;

  const setType = (type) => {
    switch (type) {
      case SERVICE_CALL_TYPE_HALF_YEAR:
        return SEMI_ANNUAL;
      case SERVICE_CALL_TYPE_ALL_SYSTEMS:
        return ANNUAL;
      default:
        return '';
    }
  };

  const createSystemsDataInternalReport = (systemsList) => {
    const result = [];
    systemsList.forEach((i) => {
      const { system_name, layer, check_list } = i;
      const tests = check_list?.data;
      result.push([
        '',
        ...createLayerMargin(layer),
        layer,
        system_name,
        checkAllTestsProper(tests),
        createShowStoppers(tests),
      ]);
    });
    return result;
  };

  const createSystemsDataCustomerReport = (systemsList) => {
    const result = [];

    const systems = systemsList.filter((system) => {
      const { check_list } = system;
      if (check_list?.data) {
        const badTests = check_list.data.filter((test) => {
          const { values, show_stopper } = test;

          if (show_stopper?.includes?.(RED_SHOW_STOPPER)) {
            const testCopy = { ...test, show_stopper: RED_SHOW_STOPPER };
            return testCopy;
          }
        });

        // system.check_list.data = badTests
        system.check_list.data = badTests.length > 0 ? badTests : system.check_list.data;

        if (badTests?.length) return system;
      }
    });

    systems.forEach((i) => {
      const { system_name, layer, check_list } = i;
      const tests = check_list?.data;
      result.push([
        '',
        ...createLayerMargin(layer),
        layer,
        system_name,
        checkAllTestsProper(tests),
        createShowStoppers(tests),
      ]);
    });

    return result;
  };

  const createLayerMargin = (layer) => {
    const result = [];
    while (result.length < layer - 1) {
      result.push('');
    }
    return result;
  };

  const createShowStoppers = (tests) => {
    if (tests) {
      let showStopper = '';
      tests.forEach((test) => {
        const { show_stopper } = test;
        if (show_stopper?.includes(RED_SHOW_STOPPER)) {
          showStopper = RED_SHOW_STOPPER;
        }
      });
      return showStopper;
    }
    return '';
  };

  const reportSystemsList = createSystemsDataInternalReport(systems);

  const problemSystemsList = createSystemsDataCustomerReport(systems);

  const reportInfo = [
    ['', DATE, moment().format('DD/MM/YYYY')],
    ['', CUSTOMER_NAME, customer_name],
    ['', ADDRESS, address],
    ['', HALF_YEAR_OR_YEARLY, setType(order_type)],
    ['', TEST_DATE, moment(due_date).format('DD/MM/YYYY')],
    ['', START_TIME_AND_END_TIME, ''],
    ['', ACTUAL_HOURS_INVESTED, ''] /**countActualInvestedHours() */,
    ['', DESCRIPTION_REASON_REDING, order_number],
    ['', TECH_NAME, technician || ''],
    [''],
    ['', REPORT_TITLE],
    ['', ''],
    ['', ''],
  ];

  const report = [
    ...reportInfo,
    ...reportSystemsList,
    [''],
    ['', DETAILS_OF_THE_SYSTEMS_TESTED_IN_THE_PROJECT],
    [''],
  ];

  const problemSystemsHeader = [
    ...reportInfo,
    ...problemSystemsList,
    [''],
    ['', DETAILS_OF_THE_SYSTEMS_TESTED_IN_THE_PROJECT],
    [''],
  ];

  return { report, problemSystemsHeader };
};

const checkAllTestsProper = (tests) => {
  if (tests) {
    const result = tests?.filter((i) => {
      const goodOrNotGoodValue = i?.values?.[0]?.value;
      if (goodOrNotGoodValue && goodOrNotGoodValue !== PROPER) return i;
    });
    return result?.length ? NOT_PROPER : PROPER;
  }
  return '';
};

const joinInternalRemarksAndRemarks = (remarks, internalRemarks) =>
  remarks && internalRemarks ? `קומה ${remarks} ערך ${internalRemarks}` : '';

const filterExistingTests = (tests) => {
  const existingTests = tests?.filter((test) => {
    if (test.values[0].value !== DOES_NOT_EXIST) return test;
  });
  return existingTests;
};
