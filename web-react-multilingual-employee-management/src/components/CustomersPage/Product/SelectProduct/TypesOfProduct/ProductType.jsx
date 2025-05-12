import React, { useState, useEffect } from 'react';
import { useStyles } from '../styles';
import { useIsSelected } from '../../../../../hooks/useIsSelected';

const ProductType = (props) => {
  const classes = useStyles();
  const { type, productType, setProductType } = props;
  // const { name, _id } = type
  const selected = useIsSelected(type, productType);

  return (
    <span
      className={selected ? classes.selectedProductType : classes.productType}
      onClick={() => setProductType(type)}
    >
      {type}
    </span>
  );
};

export default ProductType;
