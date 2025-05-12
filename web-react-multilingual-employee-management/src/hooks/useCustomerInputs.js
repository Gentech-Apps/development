import { useEffect, useState } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useCustomerInputs = () => {
  const [data, setData] = useState([]);
  const url = `/system/customer-page/get-inputs`;

  const createNumericOptions = (number) => {
    const arr = [];
    for (let i = 1; i <= number; i++) {
      arr.push(i + '');
    }
    return arr;
  };

  useEffect(() => {
    const loadData = async () => {
      if (url) {
        const { result } = await generalGetRequest(url);
        if (result) {
          const inputs = {
            building_model: [],
            parking_lot_shared: [],
            terms_of_engagement: [],
            quantity_of_floors: createNumericOptions(100),
            quantity_of_parking_levels: createNumericOptions(10),
            quantity_of_shared_parkings: createNumericOptions(10),
            ...result,
          };
          setData(inputs);
        }
      }
    };
    loadData();
  }, []);

  return data;
};
