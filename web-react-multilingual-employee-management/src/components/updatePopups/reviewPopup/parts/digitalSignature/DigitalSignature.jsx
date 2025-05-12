import React, { useRef } from 'react';
import { Box } from '@material-ui/core';
import { useStyles } from './styles';
import SignatureCanvas from 'react-signature-canvas';
import { uploadSignature } from '../../../../../functions/api/orders';
import { API } from '../../../../../tools/keys/keys';
import { dataURLtoBlob } from '../../../../../utils/binaryConvertingData';
import ShowStoppersList from './showStoppers';
import DialogPopup from '../../../../reused-components/DialogPopup/dialogPopup';
import { SIGNATURE } from '../../../../../constants/translations/review-popup';
import { calculatePopupWidth } from '../../../../../utils';
import Actions from './parts/Buttons';
import { useDigitalSignature } from '../../../../../hooks/useDigitalSignature';
import { useBadSystemsList } from '../../../../../hooks/useBadSystemsList';

const DigitalSignature = (props) => {
  const { isOpen, closeHandler, orderId } = props;
  const canvasRef = useRef({});
  const classes = useStyles();
  const badSystemsList = useBadSystemsList(orderId);
  const { url, setUrl } = useDigitalSignature(orderId);

  const handleSave = async () => {
    const canvas = canvasRef.current.getTrimmedCanvas();
    const height = canvas.height;
    const width = canvas.width;
    const blob = dataURLtoBlob(canvas.toDataURL('image/png'));
    const formData = new FormData();
    formData.append('signature', blob);
    const { result } = await uploadSignature(formData, orderId, width, height);
    if (result) {
      setUrl(result);
      closeHandler();
    }
  };

  return (
    <DialogPopup
      handleClose={closeHandler}
      isOpen={isOpen}
      handleCancel={calculatePopupWidth}
      title={SIGNATURE}
      actions={<Actions cancelHandler={closeHandler} saveHandler={handleSave} />}
      content={
        <Box container={'true'} className={classes.container} style={{ height: '100%' }}>
          <Box container={'true'} className={classes.holder}>
            <ShowStoppersList badSystemsList={badSystemsList} />
          </Box>
          <Box container={'true'} className={classes.holder}>
            {typeof url === 'string' ? (
              <img src={`${API}${url}`} alt="signature" />
            ) : (
              <SignatureCanvas
                ref={canvasRef}
                canvasProps={{ className: classes.canvas }}
                backgroundColor={`rgba(255, 255, 255, 1)`}
              />
            )}
          </Box>
        </Box>
      }
    />
  );
};

export default DigitalSignature;
