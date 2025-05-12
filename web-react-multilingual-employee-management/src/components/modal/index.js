import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Icon } from '@material-ui/core';
//import { useModal } from 'hooks/useModal'
import { useHistory } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
//import Button from 'components/interfaceComponents/Button'
import './styles.scss';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { CustomButton } from '../generals/CustomButton';

export default function Modal() {
  const {
    isModal,
    maxWidth,
    fullWidth,
    open,
    title,
    component,
    onSubmitClick,
    submitIcon,
    submitLabel,
    submitLabelDelete,
    form,
    onClose,
  } = useSelector((state) => state.modal);
  const {
    location: { pathname },
  } = useHistory();
  const { closeModal } = useModal();
  const closeWithCallback = () => {
    onClose && onClose();
    closeModal();
  };
  useEffect(() => {
    closeModal();
    return closeModal;
  }, [pathname]);

  return (
    <Dialog
      // disableBackdropClick={!isModal}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose(event, reason);
        }
      }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      className="modal-material"
      onClose={closeWithCallback}
    >
      <div className={`title ${title ? '' : 'without-label'}`}>
        <i className={`fas fa-times`} onClick={closeWithCallback} /> {title}
      </div>
      <DialogContent>
        <div className="modal-container"> {component} </div>
      </DialogContent>
      {(onSubmitClick || form) && (
        <DialogActions>
          <div className="button-wrapper">
            <CustomButton
              onClick={onSubmitClick}
              type={form ? 'submit' : 'button'}
              form={form}
              //   {...(submitIcon && { icon: submitIcon })}
              //   {...(form && { form: `${form}-form` })}
            >
              {' '}
              {submitLabel}
            </CustomButton>
          </div>
          {submitLabelDelete && (
            <div className="button-wrapper">
              <CustomButton
                onClick={onSubmitClick}
                type={form ? 'submit' : 'button'}
                form={form}
                //   {...(submitIcon && { icon: submitIcon })}
                //   {...(form && { form: `${form}-form` })}
              >
                {' '}
                {submitLabelDelete}
              </CustomButton>
            </div>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { Dialog, Icon } from '@material-ui/core'
// //import { useModal } from 'hooks/useModal'
// import { useHistory } from 'react-router-dom'
// import { useModal } from '../../hooks/useModal'
// //import Button from 'components/interfaceComponents/Button'

// export default function Modal () {
//    const {
//       isModal,
//       maxWidth,
//       fullWidth,
//       open,
//       title,
//       component,
//       onSubmitClick,
//       submitIcon,
//       submitLabel,
//       form,
//       onClose
//    } = useSelector((state) => state.modal)
//    const {
//       location: { pathname }
//    } = useHistory()
//    const { closeModal } = useModal()
//    const closeWithCallback = () => {
//       onClose && onClose()
//       closeModal()
//    }
//    useEffect(() => {
//       closeModal()
//       return closeModal
//    }, [pathname])

//    return (
//       <Dialog
//          disableBackdropClick={!isModal}
//          maxWidth={maxWidth}
//          fullWidth={fullWidth}
//          hideBackdrop
//          open={open}
//          className="modal-material"
//          onClose={closeWithCallback}
//       >
//          <div className={`title ${title ? '' : 'without-label'}`}>
//             {title}
//             <i className={`fas fa-times`} onClick={closeWithCallback}/>
//          </div>
//          <div className="modal-container"> {component} </div>
//          {(onSubmitClick || form) && (
//             <div className="button-wrapper">
//                {/* <Button
//                   isRaised
//                   onClick={onSubmitClick}
//                   type={form ? 'submit' : 'button'}
//                   {...(submitIcon && { icon: submitIcon })}
//                   {...(form && { form: `${form}-form` })}
//                   fullWidth
//                   label={submitLabel}
//                   backgroundColor="#FF7C06"
//                   labelStyle={{ color: '#fff' }}
//                /> */}
//             </div>
//          )}
//       </Dialog>
//    )
// }
