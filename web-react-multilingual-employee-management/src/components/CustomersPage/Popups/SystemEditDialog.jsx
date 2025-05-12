import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Box } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { BLUE_COLOR, WHITE_COLOR } from '../../../constants/customers-page';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import CustomizedButton from '../reused_components/customizedButton';

// const SystemEditDialog = ({ isOpen, closeHandler , message='', count=0}) => {
//     return (
//       <Box container={'true'} p={isOpen ? 5 : 0} style = {{position:'absolute'}}>
//         <Dialog
//           p={5}
//           open={isOpen}>
//           <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '130px' }}>
//             <h3 p={5}>{message}</h3>
//             {(count > 0) && <p style={{textAlign: 'center'}}>{'המערכת משוכפלת'}-{count}</p>}
//             <span style ={{display:'flex',justifyContent: 'center'}}>
//               <Button variant="contained" color="primary" onClick={closeHandler}>סגור</Button>
//             </span>
//           </div>
//         </Dialog>
//       </Box>
//     )
// }

const SystemEditDialog = ({ isOpen, closeHandler, message = '', count = 0 }) => {
  return (
    <DialogPopup
      width={'auto'}
      height={'auto'}
      isOpen={isOpen}
      actions={
        <CustomizedButton
          clickHandler={closeHandler}
          backgroundColor={BLUE_COLOR}
          textColor={WHITE_COLOR}
          text={`אישור`}
          width={'auto'}
          height={'auto'}
        >
          אישור
        </CustomizedButton>
      }
      contentStyle={{ overflow: 'hidden', minHeight: '0px', paddingTop: '10px' }}
      content={
        <Box component="div" overflow="hidden" p={3}>
          <Typography variant="h6" align="center" gutterBottom>
            {message}
          </Typography>
        </Box>
      }
    />
  );
};

export default SystemEditDialog;
