import React from 'react';
import { PRODUCT_FORM, QUOTE } from '../../../../../constants/translations/customersPage';
import { useStyles } from '../styles';
import CustomizedSelect from '../../../reused_components/inputs/CustomizedSelect';
import CustomizedTextArea from '../../../reused_components/inputs/CustomizedTextArea';
import CustomizedTextField from '../../../reused_components/inputs/CustomizedTextField';
import {
  HANDLE_OPTIONS,
  COLOR_OPTIONS,
  HUE_OPTIONS,
  HANDLE_TYPE_OPTIONS,
} from '../../../../../constants/product-parts';
import { useSelector } from 'react-redux';

const ProductAdditionalAttributes = (props) => {
  const readOnly = useSelector((state) => state.quotationManagement.readOnly);
  const {
    PRODUCT_ADDITIONAL_ATTRIBUTES_TITLE,
    HANDLE_TYPE,
    COLOR_TYPE,
    HUE,
    HANDLE,
    REMARKS,
    PARTITION,
    BUFFER,
  } = PRODUCT_FORM;
  const classes = useStyles();
  const {
    handle,
    setHandle,
    handleType,
    setHandleType,
    color,
    setColor,
    hue,
    setHue,
    remarks,
    setRemarks,
    partition,
    setPartition,
    buffer,
    setBuffer,
    inputsOptions,
  } = props;

  const setValueHandler = (inputName) => {
    return (name) => {
      switch (inputName) {
        case HANDLE_OPTIONS: {
          const optionObject = inputsOptions[HANDLE_OPTIONS].find((i) => i.name === name);
          setHandle(optionObject || {});
          break;
        }
        // case HANDLE_TYPE_OPTIONS:{
        //     const optionObject = inputsOptions[HANDLE_TYPE_OPTIONS].find(i=>i.name === name)
        //     setHandleType(optionObject || {})
        //     break
        // }
        case COLOR_OPTIONS: {
          const optionObject = inputsOptions[COLOR_OPTIONS].find((i) => i.name === name);
          setColor(optionObject || {});
          break;
        }
      }
    };
  };

  return (
    <div className={classes.attributesFormWrapper}>
      <p className={classes.title}>{PRODUCT_ADDITIONAL_ATTRIBUTES_TITLE}</p>
      <CustomizedTextField
        label={PARTITION}
        value={partition}
        changeHandler={setPartition}
        width={12}
        type="number"
        disabled={readOnly}
      />
      <CustomizedTextField
        label={BUFFER}
        value={buffer}
        changeHandler={setBuffer}
        width={12}
        type="number"
        disabled={readOnly}
      />
      <CustomizedSelect
        label={HANDLE}
        value={handle}
        changeHandler={setValueHandler(HANDLE_OPTIONS)}
        options={inputsOptions[HANDLE_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={HANDLE_TYPE}
        value={handleType}
        // changeHandler={setValueHandler(HANDLE_TYPE_OPTIONS)}
        changeHandler={setHandleType}
        options={inputsOptions[HANDLE_TYPE_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={COLOR_TYPE}
        value={color}
        changeHandler={setValueHandler(COLOR_OPTIONS)}
        options={inputsOptions[COLOR_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={HUE}
        value={hue}
        changeHandler={setHue}
        options={inputsOptions[HUE_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedTextArea
        label={REMARKS}
        value={remarks}
        changeHandler={setRemarks}
        height={9}
        disabled={readOnly}
      />
    </div>
  );
};

export default ProductAdditionalAttributes;
