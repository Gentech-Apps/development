import React, { useState, useEffect } from 'react';
import { useStyles } from '../styles';
import { useIsSelected } from '../../../../../hooks/useIsSelected';

const ProductModel = (props) => {
  const classes = useStyles();
  const { model, productModel, setProductModel } = props;
  // const {name, _id } = model

  const selected = useIsSelected(model, productModel);

  return (
    <span
      className={selected ? classes.selectedProductModelType : classes.productModelType}
      onClick={() => setProductModel(model)}
    >
      {model}
    </span>
  );
};

export default ProductModel;
