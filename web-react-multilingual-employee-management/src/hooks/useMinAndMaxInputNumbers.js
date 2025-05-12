import { useEffect, useState } from 'react';

export const useMinAndMaxInputNumbers = (inputs) => {
  const [multipleNumber, setMultipleNumber] = useState('');
  const [singleNumber, setSingleNumber] = useState('');

  useEffect(() => {
    const inputNumbers = inputs.map((i) => {
      if (parseInt(i.input_number)) {
        return parseInt(i.input_number);
      }
      return 0;
    });

    const min = Math.min(...inputNumbers);
    const max = Math.max(...inputNumbers);

    setSingleNumber(min);
    setMultipleNumber(max);
  }, [inputs]);
  return { singleNumber, multipleNumber };
};
