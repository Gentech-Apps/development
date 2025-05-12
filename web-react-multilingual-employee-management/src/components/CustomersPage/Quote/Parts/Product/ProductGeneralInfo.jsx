import React from 'react';
import { useStyles } from '../../styles';
import ProductPropertyAndValue from './ProductPropertyAndValue';
import { QUOTE, PRODUCT_FORM } from '../../../../../constants/translations/customersPage';

const ProductGeneralInfo = ({ product }) => {
  const { SERIES_TYPE, HUE, HEIGHT, WIDTH } = QUOTE;
  const { HANDLE, HANDLE_TYPE } = PRODUCT_FORM;
  const { width, height, series_type, hue, handle, handle_type } = product;
  const classes = useStyles();

  const getValue = (data) => (data?.name ? data?.name : data);

  return (
    <div className={classes.productDescriptionColumnWrapper}>
      <ProductPropertyAndValue property={WIDTH} value={width} />
      <ProductPropertyAndValue property={HEIGHT} value={height} />
      <ProductPropertyAndValue property={SERIES_TYPE} value={getValue(series_type)} />
      <ProductPropertyAndValue property={HUE} value={getValue(hue)} />
      <ProductPropertyAndValue property={HANDLE} value={getValue(handle)} />
      <ProductPropertyAndValue property={HANDLE_TYPE} value={getValue(handle_type)} />
    </div>
  );
};

export default ProductGeneralInfo;
