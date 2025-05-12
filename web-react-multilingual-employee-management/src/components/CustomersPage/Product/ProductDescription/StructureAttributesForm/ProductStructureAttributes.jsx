import React from 'react';
import { PRODUCT_FORM, QUOTE } from '../../../../../constants/translations/customersPage';
import { useStyles } from '../styles';
import SizeForm from '../SizeForm/SizeForm';
import CustomizedSelect from '../../../reused_components/inputs/CustomizedSelect';
import CustomizedTextField from '../../../reused_components/inputs/CustomizedTextField';
import {
  SHUTTER_OPEN_OPTIONS,
  BOX_OPTIONS,
  SHUTTER_OPTIONS,
  GLASS_OPTIONS,
  ENGINE_OPTIONS,
  NET_OPTIONS,
} from '../../../../../constants/product-parts';
import { useSelector } from 'react-redux';

const ProductStructureAttributes = (props) => {
  const readOnly = useSelector((state) => state.quotationManagement.readOnly);
  const {
    STRUCTURE,
    NET_SIZE_TITLE,
    GLASS_TYPE,
    BOX_WIDTH,
    SERIES_TYPE,
    SHUTTER_TYPE,
    SHUTTER_OPEN,
    ENGINE,
    BOX,
    NET_TYPE,
  } = PRODUCT_FORM;
  const {
    seriesType,
    setSeriesType,
    glassType,
    setGlassType,
    boxWidth,
    setBoxWidth,
    shutterType,
    setShutterType,
    shutterOpen,
    setShutterOpen,
    engine,
    setEngine,
    box,
    setBox,
    netType,
    setNetType,
    netHeight,
    setNetHeight,
    netWidth,
    setNetWidth,
    seriesTypes,
    inputsOptions,
  } = props;
  const classes = useStyles();

  const setValueHandler = (inputName) => {
    return (name) => {
      switch (inputName) {
        case SERIES_TYPE: {
          const optionObject = seriesTypes.find((i) => i.name === name);
          setSeriesType(optionObject);
          break;
        }
        case SHUTTER_OPTIONS: {
          const optionObject = inputsOptions[SHUTTER_OPTIONS].find((i) => i.name === name);
          setShutterType(optionObject || {});
          break;
        }
        case ENGINE_OPTIONS: {
          const optionObject = inputsOptions[ENGINE_OPTIONS].find((i) => i.name === name);
          setEngine(optionObject || {});
          break;
        }
        case BOX_OPTIONS: {
          const optionObject = inputsOptions[BOX_OPTIONS].find((i) => i.name === name);
          setBox(optionObject || {});
          break;
        }
        case NET_OPTIONS: {
          const optionObject = inputsOptions[NET_OPTIONS].find((i) => i.name === name);
          setNetType(optionObject || {});
          break;
        }
      }
    };
  };

  return (
    <div className={classes.attributesFormWrapper}>
      <p className={classes.title}>{STRUCTURE}</p>
      <CustomizedSelect
        disabled={readOnly}
        label={SERIES_TYPE}
        value={seriesType}
        changeHandler={setValueHandler(SERIES_TYPE)}
        options={seriesTypes}
        width={12}
      />
      <CustomizedSelect
        label={GLASS_TYPE}
        value={glassType}
        changeHandler={setGlassType}
        options={inputsOptions[GLASS_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={SHUTTER_TYPE}
        value={shutterType}
        changeHandler={setValueHandler(SHUTTER_OPTIONS)}
        options={inputsOptions[SHUTTER_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={SHUTTER_OPEN}
        value={shutterOpen}
        changeHandler={setShutterOpen}
        options={inputsOptions[SHUTTER_OPEN_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={ENGINE}
        value={engine}
        changeHandler={setValueHandler(ENGINE_OPTIONS)}
        options={inputsOptions[ENGINE_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={BOX}
        value={box}
        changeHandler={setValueHandler(BOX_OPTIONS)}
        options={inputsOptions[BOX_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <CustomizedTextField
        label={BOX_WIDTH}
        value={boxWidth}
        changeHandler={setBoxWidth}
        width={12}
        disabled={readOnly}
      />
      <CustomizedSelect
        label={NET_TYPE}
        value={netType}
        changeHandler={setValueHandler(NET_OPTIONS)}
        options={inputsOptions[NET_OPTIONS]}
        width={12}
        disabled={readOnly}
      />
      <SizeForm
        title={NET_SIZE_TITLE}
        height={netHeight}
        setHeight={setNetHeight}
        width={netWidth}
        setWidth={setNetWidth}
        disabled={readOnly}
      />
    </div>
  );
};

export default ProductStructureAttributes;
