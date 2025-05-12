import React, { useRef } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import SignatureCanvas from 'react-signature-canvas';
import { uploadSignature } from '../../../../functions/api/orders';
import { API } from '../../../../tools/keys/keys';
import { dataURLtoBlob } from '../../../../utils/binaryConvertingData';
import { useDigitalSignature } from '../../../../hooks/useDigitalSignature';

const useStyles = makeStyles((theme) => ({
  signatureContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
  },
  canvas: {
    height: '80%',
    width: '100%',
    border: '3px solid #0091ff',
    borderRadius: '10px',
  },
  alignCenter: {
    margin: '0 auto',
  },
  okButton: {
    backgroundColor: '#0091ff',
  },
}));

const DigitalSignature = (props) => {
  const { closeHandler, orderId } = props;
  const canvasRef = useRef({});
  const classes = useStyles();
  const { url, setUrl, pending } = useDigitalSignature(orderId);

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
    <div className={classes.signatureContainer}>
      {pending ? null : url ? (
        <img src={`${API}${url}`} alt="signature" />
      ) : (
        <React.Fragment>
          <SignatureCanvas
            ref={canvasRef}
            canvasProps={{ className: classes.canvas }}
            backgroundColor={`rgba(255, 255, 255, 1)`}
          />
          <section className="custom__popup__update__submit-section">
            <div></div>
            <div className={classes.alignCenter}>
              <button onClick={closeHandler}>ביטול</button>
              <button className={classes.okButton} onClick={handleSave}>
                שמור
              </button>
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};

export default DigitalSignature;
