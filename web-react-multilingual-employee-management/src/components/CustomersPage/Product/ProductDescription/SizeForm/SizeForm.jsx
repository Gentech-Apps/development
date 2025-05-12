import React from 'react';
import { PRODUCT_FORM } from '../../../../../constants/translations/customersPage';
import CustomizedInputWithLabel from '../../../reused_components/CustomizedInputWithLabel';
import { useStyles } from '../styles';

const SizeForm = (props) => {
  const classes = useStyles();
  const { WIDTH, HEIGHT } = PRODUCT_FORM;
  const { width, height, setWidth, setHeight, title, disabled } = props;
  return (
    <div className={classes.sizeFormWrapper}>
      <p className={classes.title}>{title}</p>
      <CustomizedInputWithLabel
        value={height}
        label={HEIGHT}
        changeHandler={setHeight}
        type="number"
        disabled={disabled}
      />
      <CustomizedInputWithLabel
        value={width}
        label={WIDTH}
        changeHandler={setWidth}
        type="number"
        disabled={disabled}
      />
    </div>
  );
};

export default SizeForm;
