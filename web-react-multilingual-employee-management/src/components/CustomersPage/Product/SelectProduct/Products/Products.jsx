import React from 'react';
import { useStyles } from '../styles';
import Product from './Product';

const Products = (props) => {
  const classes = useStyles();
  const { productModel, selectedProduct, setProduct, products } = props;

  return (
    <div className={classes.productsWrapper}>
      {products.map((i) => (
        <Product
          key={i._id}
          product={i}
          selectedProduct={selectedProduct}
          productModel={productModel}
          setProduct={setProduct}
        />
      ))}
    </div>
  );
};

export default Products;
