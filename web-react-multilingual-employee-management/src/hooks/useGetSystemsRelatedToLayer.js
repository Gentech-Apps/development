import { useEffect, useState } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useGetSystemsRelatedToLayer = (layer) => {
  const [systems, setSystems] = useState([]);
  useEffect(() => {
    const loadSystems = async () => {
      let uri = `/system/order-system-types/get?layer=${layer}`;
      const data = await generalGetRequest(uri);
      if (data && data.result) {
        setSystems(data.result);
      }
    };
    if (layer) loadSystems();
  }, [layer]);

  return systems;
};
