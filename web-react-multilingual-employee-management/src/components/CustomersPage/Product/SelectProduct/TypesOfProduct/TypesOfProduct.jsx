import React from 'react';
import { useStyles } from '../styles';
import ProductType from './ProductType';

const TypesOfProduct = (props) => {
  const classes = useStyles();
  const { productType, setProductTypeHandler, productTypes } = props;
  return (
    <div className={classes.typesWrapper}>
      {productTypes.map((i) => (
        <ProductType
          key={i}
          type={i}
          productType={productType}
          setProductType={setProductTypeHandler}
        />
      ))}
    </div>
  );
};

export default TypesOfProduct;
