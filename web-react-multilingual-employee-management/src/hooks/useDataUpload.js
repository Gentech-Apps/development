import { useEffect, useState } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useDataUpload = (url) => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (url) {
        setPending(true);
        const { result } = await generalGetRequest(url);
        if (result) setData(result);
        setPending(false);
      }
    };
    loadData();
  }, [url]);

  return [data, setData, pending];
};
