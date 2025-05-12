import { useState, useEffect } from 'react';
import { useDataUpload } from './useDataUpload';

export const useDigitalSignature = (orderId) => {
  const [uploadSignatureUrl, setSignatureUrl] = useState('');
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (orderId) {
      setSignatureUrl(`/system/order/get-signature?order_id=${orderId}`);
    }
  }, [orderId]);

  const [orderSignature, setSignature, pending] = useDataUpload(uploadSignatureUrl);
  useEffect(() => {
    if (orderSignature?.length) {
      setUrl(orderSignature);
    }
  }, [orderSignature]);

  return { url, setUrl, pending };
};
