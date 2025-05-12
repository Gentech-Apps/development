import {
  updateActualSystemCheckListSectionMobile,
  updateSubSystemCheckListSectionMobile,
  updateUnionChecklist,
} from '../../api/orders';

import {
  DELAYED_CHECK_LIST_DATA,
  CURRENT_ORDER_ID,
  CACHED_CHECK_LISTS_DATA,
  UNION_CHECK_LIST_DATA,
} from '../../../constants/offline-mode';

export const sendDelayedCheckLists = async () => {
  if (!window.navigator.onLine) return;
  const delayedData = JSON.parse(localStorage.getItem(DELAYED_CHECK_LIST_DATA));
  if (delayedData) {
    const requestList = delayedData.map((i) => {
      if (i.is_sub_system) {
        return updateSubSystemCheckListSectionMobile(i);
      } else {
        return updateActualSystemCheckListSectionMobile(i);
      }
    });
    const promise_status = Promise.all(requestList);
    promise_status.then((item) => {
      localStorage.removeItem(DELAYED_CHECK_LIST_DATA);
      localStorage.removeItem(CACHED_CHECK_LISTS_DATA);
      localStorage.removeItem(CURRENT_ORDER_ID);
    });
  }

  let union_data = JSON.parse(localStorage.getItem(UNION_CHECK_LIST_DATA));
  if (union_data) {
    let union_update_status = Object.entries(union_data).map(([key, { delayed, data }]) => {
      if (delayed) {
        return updateUnionChecklist(data);
      }
    });
    Promise.all(union_update_status).then((res) => {
      localStorage.removeItem(UNION_CHECK_LIST_DATA);
    });
  }
};
