import { updateTasksPerFloor } from '../../../../../functions/api/systems';
import { REG_EXP_OBJECT_ID } from '../../../../../constants/admin-systems';
import { CHECK_LIST_TRANSLATION } from '../../../../../constants/translations/customersPage';

const { PROPER, NOT_PROPER, CRITICAL } = CHECK_LIST_TRANSLATION;

export class CheckListService {
  constructor() {}
  static setRowTitleColor(test) {
    const { test_union, test_per_floor_id } = test;
    return test_union || test_per_floor_id ? { color: 'blue' } : {};
  }

  static setRowTitleActive(test) {
    const { test_union, test_per_floor_id } = test;
    return test_union || test_per_floor_id ? { cursor: 'pointer' } : {};
  }

  static async submitTests(tests) {
    const testsCopy = { ...tests };
    testsCopy.data = testsCopy.data.map((i) => {
      const { _id, values } = i;
      // delete temporary _id
      const id = _id.match(REG_EXP_OBJECT_ID) ? _id : undefined;
      // filter unnnecessary data from tests
      const filteredValues = values.map((i) => i.value);
      return { values: filteredValues, _id: id };
    });
    const result = await updateTasksPerFloor(testsCopy);
    return result;
  }

  static calculateTestsStatus(tests) {
    // find good or not good status in union tests && if not good present return it to set status in test link
    const status = tests.reduce((result, test) => {
      const status = test.values[0].value;
      return (result += status);
    }, '');

    switch (true) {
      case status.includes(NOT_PROPER) || status.includes(CRITICAL):
        return NOT_PROPER;
      case status.includes(PROPER):
        return PROPER;
      default:
        return '';
    }
  }
}
