import React from 'react';
import { useStyles } from '../../styles';
import ProductPropertyAndValue from './ProductPropertyAndValue';
import { QUOTE, PRODUCT_FORM } from '../../../../../constants/translations/customersPage';

const ProductGeneralInfo = ({ product }) => {
  const { ENGINE } = QUOTE;

  const { SHUTTER_TYPE, SHUTTER_OPEN, BOX, BOX_WIDTH } = PRODUCT_FORM;

  const getValue = (data) => (data?.name ? data?.name : data);

  const { engine, shutter_type, shutter_open, box, box_width } = product;

  const classes = useStyles();
  return (
    <div className={classes.productDescriptionColumnWrapper}>
      <ProductPropertyAndValue property={SHUTTER_TYPE} value={getValue(shutter_type)} />
      <ProductPropertyAndValue property={SHUTTER_OPEN} value={getValue(shutter_open)} />
      <ProductPropertyAndValue property={BOX} value={getValue(box)} />
      <ProductPropertyAndValue property={BOX_WIDTH} value={getValue(box_width)} />
      <ProductPropertyAndValue property={ENGINE} value={getValue(engine)} />
    </div>
  );
};

export default ProductGeneralInfo;
