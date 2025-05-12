import React from 'react';
import { useStyles } from '../../styles';
import ProductPropertyAndValue from './ProductPropertyAndValue';
import { QUOTE } from '../../../../../constants/translations/customersPage';

const ProductPartsInfo = ({ product }) => {
  const { GLASS, NET_HEIGHT, NET_WIDTH, NET_TYPE, PARTITION, BUFFER } = QUOTE;

  const { glass_type, buffer, partition, net_type, net_width, net_height } = product;

  const classes = useStyles();

  const getValue = (data) => (data?.name ? data?.name : data);

  return (
    <div className={classes.productDescriptionColumnWrapper}>
      <ProductPropertyAndValue property={GLASS} value={getValue(glass_type)} />
      <ProductPropertyAndValue property={BUFFER} value={getValue(buffer)} />
      <ProductPropertyAndValue property={PARTITION} value={getValue(partition)} />
      <ProductPropertyAndValue property={NET_TYPE} value={getValue(net_type)} />
      <ProductPropertyAndValue property={NET_WIDTH} value={getValue(net_width)} />
      <ProductPropertyAndValue property={NET_HEIGHT} value={getValue(net_height)} />
    </div>
  );
};

export default ProductPartsInfo;
