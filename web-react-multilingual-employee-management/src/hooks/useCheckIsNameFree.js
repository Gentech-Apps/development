import { useState, useEffect } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useCheckIsNameFree = (name, originalName) => {
  const [isNameFree, setNameFree] = useState(true);
  useEffect(() => {
    const checkIsNameFree = async (name) => {
      if (name && name !== originalName) {
        const { result } = await generalGetRequest(
          `/system/customer-page/check-is-customer-name-free?customer_name=${name}`,
        );
        setNameFree(result);
      }
    };
    checkIsNameFree(name);
  }, [name]);

  return isNameFree;
};
