import React from 'react';
import { CHECK_LIST_TRANSLATION } from '../../../../../../../../constants/translations/customersPage';
import CustomizedAddIcon from '../../../../../reusableComponents/customizedAddIcon';
import CustomizedButton from '../../../../../reusableComponents/customizedButton';
import { Grid } from '@material-ui/core';
import { BLUE_COLOR, WHITE_COLOR } from '../../../../../../../../constants/review-popup';
import { SAVE } from '../../../../../../../../constants/translations/review-popup';

const TestsPerFloorActions = (props) => {
  const { saveHandler, addTestHandler } = props;

  return (
    <Grid style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <CustomizedAddIcon clickHandler={addTestHandler} />
      <CustomizedButton
        backgroundColor={BLUE_COLOR}
        textColor={WHITE_COLOR}
        text={SAVE}
        clickHandler={saveHandler}
        width={'30%'}
      />
    </Grid>
  );
};

export default TestsPerFloorActions;
