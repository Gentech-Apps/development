import { useState, useEffect } from 'react';
import { useDataUpload } from './useDataUpload';

export const useFiles = (customerId) => {
  const [url, setUrl] = useState('');
  const [filesList, setFilesList] = useDataUpload(url);

  useEffect(() => {
    if (customerId) {
      const createNewUrl = (customerId) =>
        `/system/order-systems/get-attachments?customer_id=${customerId}`;
      setUrl(createNewUrl(customerId));
    }
  }, [customerId]);

  return [filesList, setFilesList];
};
