import React from 'react';
import { useSelector } from 'react-redux';
import { calculateButtonWidth } from '../../../../../../utils';
import CustomizedButton from '../../../reusableComponents/customizedButton';
import {
  BLUE_COLOR,
  WHITE_COLOR,
  CLOSE_BUTTON_BACKGROUND,
} from '../../../../../../constants/review-popup';
import { SAVE, CANCEL } from '../../../../../../constants/translations/review-popup';
import { Grid } from '@material-ui/core';

const Actions = (props) => {
  const { cancelHandler, saveHandler } = props;
  const windowWidth = useSelector((state) => state.pageInfo.width);
  const buttonWidth = calculateButtonWidth(windowWidth);

  return (
    <Grid style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={saveHandler}
        width={buttonWidth}
      />
      <CustomizedButton
        backgroundColor={CLOSE_BUTTON_BACKGROUND}
        textColor={WHITE_COLOR}
        text={CANCEL}
        clickHandler={cancelHandler}
        width={buttonWidth}
      />
    </Grid>
  );
};
export default Actions;
