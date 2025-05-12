import { useState, useEffect } from 'react';
import { getBadShowStoppers } from '../functions/api/systems';

export const useBadSystemsList = (orderId) => {
  const [badSystems, setBadSystems] = useState([]);

  useEffect(() => {
    const uploadBadSystems = async (orderId) => {
      const badSystemsList = await getBadShowStoppers(orderId);
      setBadSystems(badSystemsList);
    };
    orderId && uploadBadSystems(orderId);
  }, [orderId]);

  return badSystems;
};
