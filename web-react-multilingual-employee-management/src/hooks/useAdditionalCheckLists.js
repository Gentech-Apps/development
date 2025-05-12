import { useState, useEffect } from 'react';
import { UNION_CHECK_LIST_DATA } from '../constants/offline-mode';
import { generalGetRequest } from '../functions/api/general';
import { updateFailedUnionCheckList } from '../functions/api/orders';

export const useAdditionalCheckList = (orderId, actualSystemId, unionCheckList) => {
  const [rowTitle, setRowTitle] = useState('');
  const [unionTest, setUnionTest] = useState('');

  useEffect(() => {
    const getCheckList = async () => {
      const responce = await generalGetRequest(
        `/system/order-systems/get-union-tests?order_id=${orderId}&row_title=${rowTitle}&actual_system_id=${actualSystemId}`,
      );
      if (responce?.result) {
        setUnionTest(responce?.result);
        updateFailedUnionCheckList(responce?.result, orderId, actualSystemId, rowTitle);
      } else {
        let union_checklist_data = JSON.parse(localStorage.getItem(UNION_CHECK_LIST_DATA));
        if (union_checklist_data) {
          let union_data = union_checklist_data[`${orderId}${actualSystemId}${rowTitle}`];
          setUnionTest(union_data);
        }
      }
    };
    if (rowTitle && !unionCheckList) getCheckList();
  }, [rowTitle]);

  const updateUnionTestHandler = (data) => {
    const { systemChecklistSection } = data;
    setUnionTest(systemChecklistSection);
  };

  return { unionTest, setUnionTest, setRowTitle, rowTitle, updateUnionTestHandler };
};
