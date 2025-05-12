import React, { useState, useEffect } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useGeneralSection = (id, customerId) => {
  const [generalSection, setGeneralSection] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        const {
          ok,
          result,
        } = await generalGetRequest(
          `/system/customer-page/get-general-section-for-edit?actual_system_id=${id}`,
          { name: 'GENERAL_SECTION', _id: id },
        );
        if (ok && result) {
          result.customer_id = customerId;
          setGeneralSection(result);
        }
      })();
    }
  }, [id, customerId]);

  return [generalSection, setGeneralSection];
};
