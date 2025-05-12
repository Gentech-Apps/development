import { useEffect, useState } from 'react';

export const useCreateUrlWithCustomerId = (templateUrl, customerId) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (templateUrl && customerId) setUrl(`${templateUrl}?customer_id=${customerId}`);
  }, [templateUrl, customerId]);

  return url;
};
