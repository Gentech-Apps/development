import React, { useState, useRef, useEffect } from 'react';
import Line from '../../reused_components/Line';
import SizeForm from './SizeForm/SizeForm';
import { PRODUCT_FORM } from '../../../../constants/translations/customersPage';
import ProductAdditionalAttributes from './AdditionalAttributesForm/ProductAdditonalAttributes';
import ProductStructureAttributes from './StructureAttributesForm/ProductStructureAttributes';
import { useStyles } from './styles';
import VerticalLine from '../../reused_components/VerticalLine';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

const ProductDescriptionForm = (props) => {
  const classes = useStyles();
  const ref = useRef();
  const readOnly = useSelector((state) => state.quotationManagement.readOnly);
  const [verticalLineHeight, setVerticalLineHeight] = useState(0);
  const {
    productHeight,
    setProductHeight,
    productWidth,
    setProductWidth,
    inputsOptions,
    // ------------------------------------
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
    // -----------------------
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
    //  --------------------
    submitForm,
  } = props;
  useEffect(() => {
    setVerticalLineHeight(ref.current.clientHeight);
  }, []);

  const { TITLE_FOR_SIZES, CREATE_PRODUCT } = PRODUCT_FORM;
  return (
    <div>
      <Line />
      <SizeForm
        title={TITLE_FOR_SIZES}
        height={productHeight}
        setHeight={setProductHeight}
        width={productWidth}
        setWidth={setProductWidth}
        disabled={readOnly}
      />
      <Line />
      <div ref={ref} className={classes.attributesFormsHolder}>
        <ProductStructureAttributes
          inputsOptions={inputsOptions}
          seriesType={seriesType}
          setSeriesType={setSeriesType}
          glassType={glassType}
          setGlassType={setGlassType}
          boxWidth={boxWidth}
          setBoxWidth={setBoxWidth}
          shutterType={shutterType}
          setShutterType={setShutterType}
          shutterOpen={shutterOpen}
          setShutterOpen={setShutterOpen}
          engine={engine}
          setEngine={setEngine}
          box={box}
          setBox={setBox}
          netType={netType}
          setNetType={setNetType}
          netHeight={netHeight}
          setNetHeight={setNetHeight}
          netWidth={netWidth}
          setNetWidth={setNetWidth}
          seriesTypes={seriesTypes}
        />
        <VerticalLine height={verticalLineHeight} />
        <ProductAdditionalAttributes
          inputsOptions={inputsOptions}
          handle={handle}
          setHandle={setHandle}
          handleType={handleType}
          setHandleType={setHandleType}
          color={color}
          setColor={setColor}
          hue={hue}
          setHue={setHue}
          remarks={remarks}
          setRemarks={setRemarks}
          partition={partition}
          setPartition={setPartition}
          buffer={buffer}
          setBuffer={setBuffer}
        />
      </div>
      <Button variant="contained" className={classes.submitButton} onClick={submitForm}>
        {CREATE_PRODUCT}
      </Button>
    </div>
  );
};

export default ProductDescriptionForm;
