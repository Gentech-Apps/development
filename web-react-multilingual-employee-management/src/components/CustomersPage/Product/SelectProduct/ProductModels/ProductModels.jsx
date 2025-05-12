import React from 'react';
import { useStyles } from '../styles';
import ProductModel from './ProductModel';

const ProductModels = (props) => {
  const classes = useStyles();
  const { productModels, productModel, setProductModel } = props;
  return (
    <div className={classes.typesWrapper}>
      {productModels.map((i) => (
        <ProductModel
          key={i}
          model={i}
          productModel={productModel}
          setProductModel={setProductModel}
        />
      ))}
    </div>
  );
};

export default ProductModels;
